let nextId = 1

/**
 * A block represents a position and color.
 */
export default class Block {
  constructor (position, color) {
    this.id = nextId++
    this.position = position
    this.color = color
  }

  toString () { return `Block (id: ${this.id}, position: ${this.position}, color: ${this.color})` }
}
