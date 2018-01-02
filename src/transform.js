/**
 * A `Transform` represents a position and a rotation.
 */
export default class Transform {
  // Pre-canned transforms.
  static get zero () { return new Transform(0, 0, 0) }
  static get up () { return new Transform(0, 1, 0) }
  static get down () { return new Transform(0, -1, 0) }
  static get left () { return new Transform(-1, 0, 0) }
  static get right () { return new Transform(1, 0, 0) }
  static get rotateLeft () { return new Transform(0, 0, -1) }
  static get rotateRight () { return new Transform(0, 0, 1) }

  constructor (x = 0, y = 0, rotation = 0) {
    this.x = x
    this.y = y
    this.rotation = Math.abs((rotation + 4) % 4)
  }

  /**
   * Returns true if the transform represents a rotation, false otherwise.
   */
  get isRotation () { return this.rotation !== 0 }

  /**
   * Returns true if the transform represents a translation, false otherwise.
   */
  get isTranslation () { return (this.x !== 0) || (this.y !== 0) }

  /**
   * Returns true if this transform is a zero transform.
   */
  get isZero () { return (this.x === 0) && (this.y === 0) && (this.rotation === 0) }

  /**
   * Adds the given transform.
   */
  add (other) {
    return new Transform(
      this.x + other.x,
      this.y + other.y,
      this.rotation + other.rotation
    )
  }

  toString () { return `(${this.x}, ${this.y}, ${this.rotation})` }
}
