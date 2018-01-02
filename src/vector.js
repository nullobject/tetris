/**
 * A `Vector` represents a position.
 */
export default class Vector {
  // Pre-canned vectors.
  static get zero () { return new Vector(0, 0) }

  constructor (...args) {
    if (args.length === 1 && Array.isArray(args[0])) {
      this.x = args[0][0]
      this.y = args[0][1]
    } else {
      this.x = args[0]
      this.y = args[1]
    }
  }

  /**
   * Returns true if this is a zero vector.
   */
  get isZero () { return this.isEqual(Vector.zero) }

  /**
   * Adds the given vector.
   *
   * @param other A vector.
   * @returns A new vector.
   */
  add (other) {
    if (Array.isArray(other)) {
      other = new Vector(other)
    }

    return new Vector(this.x + other.x, this.y + other.y)
  }

  /**
   * Subtracts the given vector.
   *
   * @param other A vector.
   * @returns A new vector.
   */
  sub (other) {
    if (Array.isArray(other)) {
      other = new Vector(other)
    }

    return new Vector(this.x - other.x, this.y - other.y)
  }

  isEqual (other) {
    return this.x === other.x && this.y === other.y
  }

  toString () { return `Vector (x: ${this.x}, y: ${this.y})` }
}
