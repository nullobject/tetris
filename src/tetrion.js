import Bag from './bag'
import Playfield from './playfield'
import Progress from './progress'
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
    this.bag = new Bag()
    this.playfield = new Playfield()
    this.fallingPiece = null
    this.ghostPiece = null
    this.lastReward = null
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
    const progress = this.progress.softDrop()
    return copy(this.transform(Vector.down), {progress})
  }

  /**
   * Moves the falling piece to the bottom of the playfield.
   *
   * @returns A new tetrion.
   */
  firmDrop () {
    log.info('firmDrop')
    const fallingPiece = this.fallingPiece.drop(this.collision)
    const delta = this.fallingPiece.vector.y - fallingPiece.vector.y
    const progress = this.progress.firmDrop(delta)
    return copy(this, {progress, fallingPiece})
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
    const delta = this.fallingPiece.vector.y - fallingPiece.vector.y
    const {playfield, numRows} = this.playfield.lock(fallingPiece.blocks).clearRows()
    const progress = this.progress.hardDrop(delta).clearRows(numRows)
    return copy(this, {progress, playfield, fallingPiece: null})
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

    const {playfield, numRows} = this.playfield.lock(this.fallingPiece.blocks).clearRows()
    const progress = this.progress.clearRows(numRows)
    return copy(this, {progress, playfield, fallingPiece: null})
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
