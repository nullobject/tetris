import Bag from './bag'
import Playfield from './playfield'
import Reward from './reward'
import Tetromino from './tetromino'
import Transform from './transform'
import log from './log'
import { copy } from 'fkit'

/**
 * A tetrion controls the game state according to the rules of Tetris.
 */
export default class Tetrion {
  constructor () {
    this.bag = new Bag()
    this.playfield = new Playfield()
    this.fallingPiece = null
    this.ghostPiece = null
    this.holdPiece = null
    this.nextPiece = null
    this.difficult = false
  }

  /**
   * Returns true if the falling piece can move down, false otherwise.
   */
  get canMoveDown () {
    return this.fallingPiece.canApplyTransform(Transform.down, this.collision)
  }

  /**
   * Returns a collision function which collides the given tetromino with the
   * playfield.
   */
  get collision () {
    return tetromino => this.playfield.collide(tetromino.blocks)
  }

  /**
   * Returns true if the last transform was a T-spin, false otherwise.
   */
  get tspin () {
    const v = this.fallingPiece.transform.vector
    const positions = [v.add([-1, -1]), v.add([1, -1]), v.add([-1, 1]), v.add([1, 1])]
    const adjacentBlocks = this.playfield.findBlocks(positions)
    return this.fallingPiece.shape === 'T' &&
      this.fallingPiece.lastTransform &&
      this.fallingPiece.lastTransform.isRotation &&
      adjacentBlocks.length >= 3
  }

  /**
   * Spawns a new falling piece.
   *
   * @returns A new tetrion.
   */
  spawn () {
    log.info('spawn')

    let { bag, shape } = this.bag.shift()
    const fallingPiece = new Tetromino(shape).spawn()

    if (this.collision(fallingPiece)) {
      // We can't span a piece if it will collide.
      return { tetrion: this }
    } else {
      const ghostPiece = fallingPiece.drop(this.collision)
      const nextPiece = new Tetromino(bag.next)
      return { tetrion: copy(this, { bag, fallingPiece, ghostPiece, nextPiece }) }
    }
  }

  /**
   * Moves the falling piece to the hold position and spawns a new falling
   * piece.
   *
   * @returns A new tetrion.
   */
  hold () {
    log.info('hold')

    if (this.fallingPiece.wasHeld) {
      // We can't hold a piece if the falling piece was previously held.
      return { tetrion: this, reward: Reward.zero }
    } else if (this.holdPiece) {
      // Swap the falling piece with the hold piece.
      const fallingPiece = this.holdPiece.spawn()
      const ghostPiece = fallingPiece.drop(this.collision)
      const holdPiece = this.fallingPiece.hold()
      return { tetrion: copy(this, { fallingPiece, ghostPiece, holdPiece }), reward: Reward.zero }
    } else {
      // Hold the falling piece.
      const { bag, shape } = this.bag.shift(this.fallingPiece.shape)
      const fallingPiece = new Tetromino(shape).hold().spawn()
      const ghostPiece = fallingPiece.drop(this.collision)
      const holdPiece = this.fallingPiece.hold()
      const nextPiece = new Tetromino(bag.next)
      return { tetrion: copy(this, { bag, fallingPiece, ghostPiece, holdPiece, nextPiece }), reward: Reward.zero }
    }
  }

  /**
   * Moves the falling piece left.
   *
   * @returns A new tetrion.
   */
  moveLeft () {
    log.info('moveLeft')
    return { tetrion: this.transform(Transform.left), reward: Reward.zero }
  }

  /**
   * Moves the falling piece right.
   *
   * @returns A new tetrion.
   */
  moveRight () {
    log.info('moveRight')
    return { tetrion: this.transform(Transform.right), reward: Reward.zero }
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  moveDown () {
    log.info('moveDown')
    return { tetrion: this.transform(Transform.down), reward: Reward.zero }
  }

  /**
   * Rotates the falling piece left.
   *
   * @returns A new tetrion.
   */
  rotateLeft () {
    log.info('rotateLeft')
    return { tetrion: this.transform(Transform.rotateLeft), reward: Reward.zero }
  }

  /**
   * Rotates the falling piece right.
   *
   * @returns A new tetrion.
   */
  rotateRight () {
    log.info('rotateRight')
    return { tetrion: this.transform(Transform.rotateRight), reward: Reward.zero }
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  softDrop (level) {
    log.info('softDrop')

    const tetrion = this.transform(Transform.down)
    const reward = tetrion !== this ? Reward.softDrop(level) : Reward.zero

    return { tetrion, reward }
  }

  /**
   * Moves the falling piece to the bottom of the playfield.
   *
   * @returns A new tetrion.
   */
  firmDrop (level) {
    log.info('firmDrop')

    const fallingPiece = this.fallingPiece.drop(this.collision)
    const dropped = this.fallingPiece.transform.vector.sub(fallingPiece.transform.vector).y

    return {
      tetrion: copy(this, { fallingPiece }),
      reward: Reward.firmDrop(dropped, level)
    }
  }

  /**
   * Moves the falling piece to the bottom of the playfield and immediately
   * locks it.
   *
   * @returns A new tetrion.
   */
  hardDrop (level) {
    log.info('hardDrop')

    const fallingPiece = this.fallingPiece.drop(this.collision)
    const dropped = this.fallingPiece.transform.vector.sub(fallingPiece.transform.vector).y
    const { playfield, cleared } = this.playfield.lock(fallingPiece.blocks).clearLines()
    const difficult = (cleared === 4)
    const combo = this.difficult && difficult

    return {
      tetrion: copy(this, { playfield, fallingPiece: null, difficult }),
      reward: Reward.hardDrop(dropped, cleared, level, combo)
    }
  }

  /**
   * Locks the given tetromino into the playfield and clears any completed
   * lines.
   *
   * @returns A new tetrion.
   */
  lock (level) {
    log.info('lock')

    if (this.collision(this.fallingPiece)) {
      throw new Error('Cannot lock falling piece')
    }

    const tspin = this.tspin
    const { playfield, cleared } = this.playfield.lock(this.fallingPiece.blocks).clearLines()
    const difficult = (cleared === 4) || (cleared > 0 && tspin)
    const combo = this.difficult && difficult

    return {
      tetrion: copy(this, { playfield, fallingPiece: null, difficult }),
      reward: Reward.clearLines(cleared, level, tspin, combo)
    }
  }

  /**
   * Applies the given transform `t` to the falling piece.
   *
   * @returns A new tetrion.
   */
  transform (t) {
    const fallingPiece = this.fallingPiece.applyTransform(t, this.collision)

    if (fallingPiece !== this.fallingPiece) {
      const ghostPiece = fallingPiece.drop(this.collision)
      return copy(this, { fallingPiece, ghostPiece })
    } else {
      return this
    }
  }

  toString () {
    return `Tetrion (playfield: ${this.playfield}, fallingPiece: ${this.fallingPiece})`
  }
}
