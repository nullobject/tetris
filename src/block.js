let nextId = 1

/**
 * A block represents a position and color.
 */
export default class Block {
  constructor (x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.id = nextId++
  }

  toString () { return `(${this.x}, ${this.y}, ${this.color})` }
}
