let nextId = 1

/**
 * A message represents a message to show to the player.
 */
export default class Message {
  constructor (text) {
    this.text = text
    this.id = nextId++
  }

  toString () { return `Message (id: ${this.id}, text: ${this.text})` }
}
