/**
 * A `Vector` represents a position.
 */
export default class Vector {
  // Pre-canned vectors.
  static get zero () { return new Vector(0, 0) }

  constructor (x, y) {
    this.x = x
    this.y = y
  }

  /**
   * Returns true if this is a zero vector.
   */
  get isZero () { return this.isEqual(Vector.zero) }

  /**
   * Adds the given vector.
   */
  add (other) {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  /**
   * Subtracts the given vector.
   */
  sub (other) {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  isEqual (other) {
    return this.x === other.x && this.y === other.y
  }

  toString () { return `Vector (x: ${this.x}, y: ${this.y})` }
}
