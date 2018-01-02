import Block from './block'
import SRS from './srs'
import Transform from './transform'
import Vector from './vector'
import {copy, zip} from 'fkit'

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
    if (!this._blocks) {
      const positions = SRS[this.shape].positions[this.transform.rotation]
      this._blocks = positions.map(position => {
        return new Block(this.transform.vector.add(position), this.color)
      })
    }

    return this._blocks
  }

  get transform () {
    return this._transform
  }

  set transform (t) {
    this._transform = t

    // Clear cached blocks.
    this._blocks = null
  }

  /**
   * Returns true if the given transform `t` can be applied to the tetromino,
   * false otherwise.
   *
   * @param c A collision function.
   * @returns A boolean.
   */
  canApplyTransform (t, c) {
    return !c(this.applyTransformWithoutCollisions(t))
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
    const transform = new Transform(SRS[this.shape].spawn)
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

    return this.applyTransformWithoutCollisions(t)
  }

  /**
   * Applies the given transform `t` to the tetromino. If there is a collision,
   * then the wall kick transforms will attempted before giving up.
   *
   * @param t A transform.
   * @param c A collision function.
   * @returns A new tetromino.
   */
  applyTransform (t, c) {
    // Find the first wall kick that doesn't collide.
    const u = this.calculateWallKickTransforms(t)
      .find(u => this.canApplyTransform(u, c))

    return u ? this.applyTransformWithoutCollisions(u) : this
  }

  /**
   * Applies the given transform `t` to the tetromino without detecting
   * collisions.
   *
   * @param t A transform.
   * @returns A new tetromino.
   */
  applyTransformWithoutCollisions (t) {
    const transform = this.transform.add(t)
    return copy(this, {transform, lastTransform: t})
  }

  /**
   * Calculates the wall kick transforms for the given transform `t`. These
   * transforms should be attempted in order when trying to transform a
   * tetromino.
   *
   * See http://harddrop.com/wiki/SRS#How_Guideline_SRS_Really_Works for details.
   *
   * @param t A transform.
   * @returns An array of transforms.
   */
  calculateWallKickTransforms (t) {
    const from = this.offsets[this.transform.rotation]
    const to = this.offsets[this.transform.add(t).rotation]
    return zip(from, to).map(([a, b]) => {
      const c = new Vector(a).sub(b)
      return t.add(new Transform(c))
    })
  }

  toString () {
    return `Tetromino (blocks: [${this.blocks}])`
  }
}
