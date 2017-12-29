import Block from './block'
import SRS from './srs'
import Vector from './vector'
import {copy, zip} from 'fkit'

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

  /**
   * Returns the color.
   */
  get color () {
    return SRS[this.shape].color
  }

  /**
   * Returns the wall kick offsets.
   */
  get offsets () {
    return SRS[this.shape].offsets
  }

  /**
   * Calculates the tetromino blocks for the given transfom `t`.
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
   * Calculates the wall kick transforms for the given transform `t`. These
   * transforms should be attempted in order when trying to transform a
   * tetromino.
   *
   * See http://harddrop.com/wiki/SRS#How_Guideline_SRS_Really_Works for more
   * details.
   *
   * @param t A transform vector.
   * @returns An array of vectors.
   */
  calculateWallKickTransforms (t) {
    const from = this.offsets[this.vector.rotation]
    const to = this.offsets[this.vector.add(t).rotation]
    return zip(from, to).map(([[x0, y0], [x1, y1]]) =>
      t.add(new Vector(x0 - x1, y0 - y1))
    )
  }

  toString () {
    return `Tetromino (blocks: ${this.blocks})`
  }
}
