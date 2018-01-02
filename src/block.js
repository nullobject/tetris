let nextId = 1

/**
 * A block represents a position and color.
 */
export default class Block {
  constructor (position, color) {
    this.position = position
    this.color = color
    this.id = nextId++
  }

  toString () { return `Block (position: ${this.position}, color: ${this.color})` }
}
