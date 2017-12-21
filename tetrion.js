import Playfield from './playfield'
import Tetromino from './tetromino'
import Vector from './vector'
import {copy} from 'fkit'

/**
 * A `Tetrion` controls the game state according to the rules of Tetris.
 */
export default class Tetrion {
  constructor () {
    this.playfield = new Playfield()
    this.fallingPiece = new Tetromino('T')
  }

  /**
   * Moves the falling piece left.
   */
  moveLeft () {
    console.log('moveLeft')
    return this.transform(Vector.left())
  }

  /**
   * Moves the falling piece right.
   */
  moveRight () {
    console.log('moveRight')
    return this.transform(Vector.right())
  }

  /**
   * Moves the falling piece down.
   */
  moveDown () {
    console.log('moveDown')
    return this.transform(Vector.down())
  }

  /**
   * Rotates the falling piece left.
   */
  rotateLeft () {
    console.log('rotateLeft')
    return this.transform(Vector.rotateLeft())
  }

  /**
   * Rotates the falling piece right.
   */
  rotateRight () {
    console.log('rotateRight')
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
    console.log('lock')
    return copy(this, {
      playfield: this.playfield.lock(this.fallingPiece),
      fallingPiece: new Tetromino('T')
    })
  }

  /**
   * Applies the given transform to the falling piece.
   */
  transform (vector) {
    console.log(`transform: ${vector}`)

    // Transform the falling piece.
    const transformedFallingPiece = this.fallingPiece.transform(vector)

    // If it doesn't collide with anything, then set it as the new falling piece.
    const fallingPiece = this.playfield.collide(transformedFallingPiece) ? this.fallingPiece : transformedFallingPiece

    return copy(this, {fallingPiece})
  }

  toString () {
    return `Tetrion (playfield: ${this.playfield}, fallingPiece: ${this.fallingPiece})`
  }
}
