import Playfield from './playfield'
import Tetromino from './tetromino'
import Vector from './vector'
import log from './log'
import {copy} from 'fkit'

/**
 * A `Tetrion` controls the game state according to the rules of Tetris.
 */
export default class Tetrion {
  constructor () {
    this.playfield = new Playfield()
    this.fallingPiece = new Tetromino('I')
  }

  /**
   * Moves the falling piece left.
   */
  moveLeft () {
    log.info('moveLeft')
    return this.transform(Vector.left())
  }

  /**
   * Moves the falling piece right.
   */
  moveRight () {
    log.info('moveRight')
    return this.transform(Vector.right())
  }

  /**
   * Moves the falling piece down.
   */
  moveDown () {
    log.info('moveDown')
    return this.transform(Vector.down())
  }

  /**
   * Rotates the falling piece left.
   */
  rotateLeft () {
    log.info('rotateLeft')
    return this.transform(Vector.rotateLeft())
  }

  /**
   * Rotates the falling piece right.
   */
  rotateRight () {
    log.info('rotateRight')
    return this.transform(Vector.rotateRight())
  }

  /**
   * Moves the falling piece down.
   */
  softDrop () {
  }

  /**
   * Moves the falling piece to the bottom of the playfield.
   */
  firmDrop () {
  }

  /**
   * Moves the falling piece to the bottom of the playfield and immediately
   * locks it.
   */
  hardDrop () {
  }

  /**
   * Locks the falling piece into the playfield and clears any completed rows.
   */
  lock () {
    log.info('lock')
    return copy(this, {
      playfield: this.playfield.lock(this.fallingPiece),
      fallingPiece: new Tetromino('T')
    })
  }

  /**
   * Applies the given transform `t` to the falling piece.
   */
  transform (t) {
    log.info(`transform: ${t}`)

    // Try to find a wall kick transform that can be applied without colliding
    // with the playfield.
    const u = this.fallingPiece.calculateWallKickTransforms(t).find(u => {
      const fallingPiece = this.fallingPiece.transform(u)
      return !this.playfield.collide(fallingPiece)
    })

    if (u) {
      const fallingPiece = this.fallingPiece.transform(u)
      return copy(this, {fallingPiece})
    } else {
      return this
    }
  }

  toString () {
    return `Tetrion (playfield: ${this.playfield}, fallingPiece: ${this.fallingPiece})`
  }
}
