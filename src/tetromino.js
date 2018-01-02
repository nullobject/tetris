import Block from './block'
import SRS from './srs'
import Transform from './transform'
import Vector from './vector'
import {copy, zip} from 'fkit'

/**
 * Applies the given transform `t` to the tetromino.
 *
 * @param tetromino A tetromino.
 * @param t A transform transform.
 * @returns A new tetromino.
 */
function applyTransform (tetromino, t) {
  const transform = tetromino.transform.add(t)
  return copy(tetromino, {transform, lastTransform: t})
}

/**
 * Calculates the wall kick transforms for the given transform `t` and
 * tetromino. These transforms should be attempted in order when trying to
 * transform a tetromino.
 *
 * See http://harddrop.com/wiki/SRS#How_Guideline_SRS_Really_Works for details.
 *
 * @param tetromino A tetromino.
 * @param t A transform.
 * @returns An array of transforms.
 */
function calculateWallKickTransforms (tetromino, t) {
  const from = tetromino.offsets[tetromino.transform.rotation]
  const to = tetromino.offsets[tetromino.transform.add(t).rotation]
  return zip(from, to).map(([[x0, y0], [x1, y1]]) =>
    t.add(new Transform(new Vector(x0 - x1, y0 - y1)))
  )
}

/**
 * A tetromino is a polyomino made of four square blocks. The seven one-sided
 * tetrominoes are I, O, T, S, Z, J, and L.
 */
export default class Tetromino {
  constructor (shape = 'I') {
    this.shape = shape
    this.lastTransform = null
    this.transform = Transform.zero
    this.wasHeld = false
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
   * Returns the blocks for the tetromino.
   */
  get blocks () {
    const positions = SRS[this.shape].positions[this.transform.rotation]
    return positions.map(([x, y]) => {
      const offset = new Vector(x, y)
      return new Block(this.transform.vector.add(offset), this.color)
    })
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
   * Resets the tetromino transform and marks it as held.
   *
   * @returns A new tetromino.
   */
  hold () {
    return copy(this, {transform: Transform.zero, wasHeld: true})
  }

  /**
   * Moves the tetromino to the spawn position.
   *
   * @returns A new tetromino.
   */
  spawn () {
    const vector = new Vector(SRS[this.shape].spawn[0], SRS[this.shape].spawn[1])
    const transform = new Transform(vector)
    return copy(this, {transform})
  }

  /**
   * Drops the tetromino down as far as it can go without colliding.
   *
   * @param c A collision function.
   * @returns A new tetromino.
   */
  drop (c) {
    let t = Transform.zero

    while (true) {
      const u = t.add(Transform.down)
      if (!this.canApplyTransform(u, c)) { break }
      t = u
    }

    return applyTransform(this, t)
  }

  /**
   * Applies the given transform `t` if it doesn't collide.
   *
   * @param t A transform transform.
   * @param c A collision function.
   * @returns A new tetromino.
   */
  applyTransform (t, c) {
    // Find the first wall kick that doesn't collide.
    const u = calculateWallKickTransforms(this, t)
      .find(u => this.canApplyTransform(u, c))

    return u ? applyTransform(this, u) : this
  }

  toString () {
    return `Tetromino (blocks: [${this.blocks}])`
  }
}
