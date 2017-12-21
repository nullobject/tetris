import {any, copy, union, whereAny} from 'fkit'

const WIDTH = 10
const HEIGHT = 20

/**
 * The playfield is the grid in which the tetrominoes fall.
 */
export default class Playfield {
  constructor () {
    this.blocks = []
  }

  /**
   * Locks the given tetromino into the playfield.
   *
   * @returns A new playfield.
   */
  lock (tetromino) {
    if (this.collide(tetromino)) {
      throw new Error('Cannot lock a colliding tetromino')
    }

    // Add the tetromino's blocks to the playfield.
    const blocks = union(this.blocks, tetromino.blocks)

    return copy(this, {blocks})
  }

  /**
   * Collides the given tetromino with the playfield.
   *
   * Returns true if the given tetromino collides with any other blocks in the
   * playfield or is outside the bounds of the playfield, false otherwise.
   *
   * @returns A boolean value.
   */
  collide (tetromino) {
    const collideBlock = b => any(a => a.x === b.x && a.y === b.y, this.blocks)
    const isOutside = b => b.x < 0 || b.x >= WIDTH || b.y < 0 || b.y >= HEIGHT + 2
    return any(whereAny([collideBlock, isOutside]), tetromino.blocks)
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}
