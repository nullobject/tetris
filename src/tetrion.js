import Bag from './bag'
import Playfield from './playfield'
import Progress from './progress'
import Reward from './reward'
import Tetromino from './tetromino'
import Vector from './vector'
import log from './log'
import {copy} from 'fkit'

/**
 * A tetrion controls the game state according to the rules of Tetris.
 */
export default class Tetrion {
  constructor () {
    this.progress = new Progress()
    this.reward = null
    this.bag = new Bag()
    this.playfield = new Playfield()
    this.fallingPiece = null
    this.ghostPiece = null
  }

  /**
   * Returns true if the falling piece can move down, false otherwise.
   */
  get canMoveDown () {
    return this.fallingPiece.canApplyTransform(Vector.down, this.collision)
  }

  /**
   * Returns a collision function which collides the given tetromino with the
   * playfield.
   */
  get collision () {
    return tetromino => this.playfield.collide(tetromino.blocks)
  }

  /**
   * Returns true if the last transform resulted in a T-spin, false otherwise.
   */
  get tspin () {
    const v = this.fallingPiece.vector
    const positions = [
      {x: v.x - 1, y: v.y - 1},
      {x: v.x + 1, y: v.y - 1},
      {x: v.x - 1, y: v.y + 1},
      {x: v.x + 1, y: v.y + 1}
    ]
    const adjacentBlocks = this.playfield.findBlocks(positions)
    return this.fallingPiece.shape === 'T' &&
      this.fallingPiece.lastTransfrom.isRotation &&
      adjacentBlocks.length >= 3
  }

  /**
   * Spawns a new falling piece.
   *
   * @returns A new tetrion.
   */
  spawn () {
    log.info('spawn')
    const {bag, shape} = this.bag.shift()
    const fallingPiece = new Tetromino(shape)
    const ghostPiece = fallingPiece.drop(this.collision)
    return copy(this, {bag, fallingPiece, ghostPiece})
  }

  /**
   * Moves the falling piece left.
   *
   * @returns A new tetrion.
   */
  moveLeft () {
    log.info('moveLeft')
    return this.transform(Vector.left)
  }

  /**
   * Moves the falling piece right.
   *
   * @returns A new tetrion.
   */
  moveRight () {
    log.info('moveRight')
    return this.transform(Vector.right)
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  moveDown () {
    log.info('moveDown')
    return this.transform(Vector.down)
  }

  /**
   * Rotates the falling piece left.
   *
   * @returns A new tetrion.
   */
  rotateLeft () {
    log.info('rotateLeft')
    return this.transform(Vector.rotateLeft)
  }

  /**
   * Rotates the falling piece right.
   *
   * @returns A new tetrion.
   */
  rotateRight () {
    log.info('rotateRight')
    return this.transform(Vector.rotateRight)
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  softDrop () {
    log.info('softDrop')

    const reward = Reward.softDrop()
    const progress = this.progress.add(reward)

    return copy(this.transform(Vector.down), {progress, reward})
  }

  /**
   * Moves the falling piece to the bottom of the playfield.
   *
   * @returns A new tetrion.
   */
  firmDrop () {
    log.info('firmDrop')

    const fallingPiece = this.fallingPiece.drop(this.collision)
    const dropped = this.fallingPiece.vector.y - fallingPiece.vector.y
    const reward = Reward.firmDrop(dropped)
    const progress = this.progress.add(reward)

    return copy(this, {progress, reward, fallingPiece})
  }

  /**
   * Moves the falling piece to the bottom of the playfield and immediately
   * locks it.
   *
   * @returns A new tetrion.
   */
  hardDrop () {
    log.info('hardDrop')

    const fallingPiece = this.fallingPiece.drop(this.collision)
    const dropped = this.fallingPiece.vector.y - fallingPiece.vector.y
    const {playfield, cleared} = this.playfield.lock(fallingPiece.blocks).clearLines()
    const reward = Reward.hardDrop(dropped, cleared)
    const progress = this.progress.add(reward)

    return copy(this, {progress, reward, playfield, fallingPiece: null})
  }

  /**
   * Locks the given tetromino into the playfield and clears any completed
   * rows.
   *
   * @returns A new tetrion.
   */
  lock () {
    log.info('lock')

    if (this.collision(this.fallingPiece)) {
      throw new Error('Cannot lock falling piece')
    }

    const {playfield, cleared} = this.playfield.lock(this.fallingPiece.blocks).clearLines()
    const reward = Reward.clearLines(cleared, this.tspin)
    const progress = this.progress.add(reward)
    return copy(this, {progress, reward, playfield, fallingPiece: null})
  }

  /**
   * Applies the given transform `t` to the falling piece.
   *
   * @returns A new tetrion.
   */
  transform (t) {
    log.info(`transform: ${t}`)

    const fallingPiece = this.fallingPiece.transform(t, this.collision)

    if (fallingPiece !== this.fallingPiece) {
      const ghostPiece = fallingPiece.drop(this.collision)
      return copy(this, {fallingPiece, ghostPiece})
    } else {
      return this
    }
  }

  toString () {
    return `Tetrion (playfield: ${this.playfield}, fallingPiece: ${this.fallingPiece})`
  }
}
