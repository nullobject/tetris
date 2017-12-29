import Block from './block'
import SRS from './srs'
import Vector from './vector'
import {copy, zip} from 'fkit'

/**
 * Applies the given transform `t` to the tetromino.
 *
 * @param tetromino A tetromino.
 * @param t A transform vector.
 * @returns A new tetromino.
 */
function applyTransform (tetromino, t) {
  const vector = tetromino.vector.add(t)
  const blocks = calculateBlocks(tetromino, vector)
  return copy(tetromino, {vector, blocks, lastTransform: t})
}

/**
 * Calculates the blocks for the given tetromino and transform `t`.
 *
 * @param tetromino A tetromino.
 * @param t A transform vector.
 * @returns An array of blocks.
 */
function calculateBlocks (tetromino, t) {
  const positions = SRS[tetromino.shape].positions[t.rotation]
  return positions.map(([x, y]) =>
    new Block(x + t.x, y + t.y, tetromino.color)
  )
}

/**
 * Calculates the wall kick transforms for the given transform `t` and
 * tetromino. These transforms should be attempted in order when trying to
 * transform a tetromino.
 *
 * See http://harddrop.com/wiki/SRS#How_Guideline_SRS_Really_Works for details.
 *
 * @param tetromino A tetromino.
 * @param t A transform vector.
 * @returns An array of vectors.
 */
function calculateWallKickTransforms (tetromino, t) {
  const from = tetromino.offsets[tetromino.vector.rotation]
  const to = tetromino.offsets[tetromino.vector.add(t).rotation]
  return zip(from, to).map(([[x0, y0], [x1, y1]]) =>
    t.add(new Vector(x0 - x1, y0 - y1))
  )
}

/**
 * A tetromino is a polyomino made of four square blocks. The seven one-sided
 * tetrominoes are I, O, T, S, Z, J, and L.
 */
export default class Tetromino {
  constructor (shape) {
    this.shape = shape
    this.lastTransform = null

    if (shape) {
      this.vector = new Vector(SRS[shape].spawn[0], SRS[shape].spawn[1])
      this.blocks = calculateBlocks(this, this.vector)
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
   * Returns true if the given transform `t` can be applied to the tetromino,
   * false otherwise.
   *
   * @param c A collision function.
   * @returns A boolean.
   */
  canApplyTransform (t, c) {
    return !c(applyTransform(this, t))
  }

  /**
   * Drops the tetromino down as far as it can go without colliding.
   *
   * @param c A collision function.
   * @returns A new tetromino.
   */
  drop (c) {
    let t = Vector.zero

    while (true) {
      const u = t.add(Vector.down)
      if (!this.canApplyTransform(u, c)) { break }
      t = u
    }

    return applyTransform(this, t)
  }

  /**
   * Applies the given transform `t` if it doesn't collide.
   *
   * @param t A transform vector.
   * @param c A collision function.
   * @returns A new tetromino.
   */
  transform (t, c) {
    // Find the first wall kick that doesn't collide.
    const u = calculateWallKickTransforms(this, t)
      .find(u => this.canApplyTransform(u, c))

    return u ? applyTransform(this, u) : this
  }

  toString () {
    return `Tetromino (blocks: ${this.blocks})`
  }
}
