/**
 * A `Vector` represents a position and a rotation.
 */
export default class Vector {
  // Pre-canned vectors.
  static zero () { return new Vector(0, 0, 0) }
  static up () { return new Vector(0, 1, 0) }
  static down () { return new Vector(0, -1, 0) }
  static left () { return new Vector(-1, 0, 0) }
  static right () { return new Vector(1, 0, 0) }
  static rotateLeft () { return new Vector(0, 0, -1) }
  static rotateRight () { return new Vector(0, 0, 1) }

  constructor (x = 0, y = 0, rotation = 0) {
    this.x = x
    this.y = y
    this.rotation = Math.abs((rotation + 4) % 4)
  }

  /**
   * Returns true if the vector represents a rotation, false otherwise.
   */
  get isRotation () { return this.rotation !== 0 }

  /**
   * Returns true if the vector represents a translation, false otherwise.
   */
  get isTranslation () { return (this.x !== 0) || (this.y !== 0) }

  /**
   * Returns true if this vector is a zero vector.
   */
  get isZero () { return (this.x === 0) && (this.y === 0) && (this.rotation === 0) }

  /**
   * Adds the given vector.
   */
  add (other) {
    return new Vector(
      this.x + other.x,
      this.y + other.y,
      this.rotation + other.rotation
    )
  }

  toString () { return `(${this.x}, ${this.y}, ${this.rotation})` }
}
