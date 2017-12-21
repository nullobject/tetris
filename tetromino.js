import Block from './block'
import SRS from './srs'
import Vector from './vector'
import {copy} from 'fkit'

/**
 * A tetromino is a polyomino made of four square blocks. The seven one-sided
 * tetrominoes are I, O, T, S, Z, J, and L.
 */
export default class Tetromino {
  constructor (shape) {
    this.shape = shape

    if (shape) {
      this.vector = new Vector(SRS[shape].spawn[0], SRS[shape].spawn[1])
      this.blocks = this.calculateBlocks(this.vector)
    }
  }

  get color () {
    return SRS[this.shape].color
  }

  /**
   * Applies the given transform.
   *
   * @param t A transform vector.
   * @returns A new tetromino.
   */
  transform (t) {
    const vector = this.vector.add(t)
    const blocks = this.calculateBlocks(vector)
    return copy(this, {vector, blocks})
  }

  /**
   * Calculates the tetromino blocks with the given transfom applied.
   *
   * @param t A transform vector.
   * @returns An array of blocks.
   */
  calculateBlocks (t) {
    const positions = SRS[this.shape].positions[t.rotation]
    return positions.map(([x, y]) =>
      new Block(x + t.x, y + t.y, this.color)
    )
  }

  toString () {
    return `Tetromino (blocks: ${this.blocks})`
  }
}
