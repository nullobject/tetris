import Bag from './bag'
import Playfield from './playfield'
import Reward from './reward'
import Tetromino from './tetromino'
import Transform from './transform'
import Vector from './vector'
import log from './log'
import {copy} from 'fkit'

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
   * Returns true if the last transform resulted in a T-spin, false otherwise.
   */
  get tspin () {
    const v = this.fallingPiece.transform.vector
    const positions = [
      v.add(new Vector(-1, -1)),
      v.add(new Vector(1, -1)),
      v.add(new Vector(-1, 1)),
      v.add(new Vector(1, 1))
    ]
    const adjacentBlocks = this.playfield.findBlocks(positions)
    return this.fallingPiece.shape === 'T' &&
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

    let {bag, shape} = this.bag.shift()
    const fallingPiece = new Tetromino(shape).spawn()
    const ghostPiece = fallingPiece.drop(this.collision)
    const nextPiece = new Tetromino(bag.next)

    return {tetrion: copy(this, {bag, fallingPiece, ghostPiece, nextPiece})}
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
      return {tetrion: this}
    } else if (this.holdPiece) {
      // Swap the falling piece with the hold piece.
      const fallingPiece = this.holdPiece.spawn()
      const ghostPiece = fallingPiece.drop(this.collision)
      const holdPiece = this.fallingPiece.hold()
      return {tetrion: copy(this, {fallingPiece, ghostPiece, holdPiece})}
    } else {
      // Hold the falling piece.
      const {bag, shape} = this.bag.shift(this.fallingPiece.shape)
      const fallingPiece = new Tetromino(shape).hold().spawn()
      const ghostPiece = fallingPiece.drop(this.collision)
      const holdPiece = this.fallingPiece.hold()
      const nextPiece = new Tetromino(bag.next)
      return {tetrion: copy(this, {bag, fallingPiece, ghostPiece, holdPiece, nextPiece})}
    }
  }

  /**
   * Moves the falling piece left.
   *
   * @returns A new tetrion.
   */
  moveLeft () {
    log.info('moveLeft')
    return {tetrion: this.transform(Transform.left)}
  }

  /**
   * Moves the falling piece right.
   *
   * @returns A new tetrion.
   */
  moveRight () {
    log.info('moveRight')
    return {tetrion: this.transform(Transform.right)}
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  moveDown () {
    log.info('moveDown')
    return {tetrion: this.transform(Transform.down)}
  }

  /**
   * Rotates the falling piece left.
   *
   * @returns A new tetrion.
   */
  rotateLeft () {
    log.info('rotateLeft')
    return {tetrion: this.transform(Transform.rotateLeft)}
  }

  /**
   * Rotates the falling piece right.
   *
   * @returns A new tetrion.
   */
  rotateRight () {
    log.info('rotateRight')
    return {tetrion: this.transform(Transform.rotateRight)}
  }

  /**
   * Moves the falling piece down.
   *
   * @returns A new tetrion.
   */
  softDrop () {
    log.info('softDrop')
    return {tetrion: this.transform(Transform.down), reward: Reward.softDrop()}
  }

  /**
   * Moves the falling piece to the bottom of the playfield.
   *
   * @returns A new tetrion.
   */
  firmDrop () {
    log.info('firmDrop')

    const fallingPiece = this.fallingPiece.drop(this.collision)
    const delta = this.fallingPiece.transform.vector.sub(fallingPiece.transform.vector)

    return {tetrion: copy(this, {fallingPiece}), reward: Reward.firmDrop(delta.y)}
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
    const delta = this.fallingPiece.transform.vector.sub(fallingPiece.transform.vector)
    const {playfield, cleared} = this.playfield.lock(fallingPiece.blocks).clearLines()

    return {tetrion: copy(this, {playfield, fallingPiece: null}), reward: Reward.hardDrop(delta.y, cleared)}
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

    return {tetrion: copy(this, {playfield, fallingPiece: null}), reward: Reward.clearLines(cleared, this.tspin)}
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
      return copy(this, {fallingPiece, ghostPiece})
    } else {
      return this
    }
  }

  toString () {
    return `Tetrion (playfield: ${this.playfield}, fallingPiece: ${this.fallingPiece})`
  }
}
