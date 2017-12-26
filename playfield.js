import {compose, copy, dec, difference, fold, groupBy, sortBy, union, update, whereAny} from 'fkit'

const WIDTH = 10
const HEIGHT = 20

/**
 * Sorts and groups blocks by row.
 */
const groupBlocksByRow = compose(
  groupBy((a, b) => a.y === b.y),
  sortBy((a, b) => a.y - b.y)
)

/**
 * Returns true if the given row is complete, false otherwise.
 */
const isComplete = row => row.length === WIDTH

/**
 * Removes completed rows from the playfield.
 *
 * Rows above cleared rows will be moved down.
 */
function clearRows (blocks) {
  const rows = groupBlocksByRow(blocks)

  fold((memo, row) => {
    if (isComplete(row)) {
      blocks = difference(blocks, row)
      memo++
    } else if (memo > 0) {
      blocks = difference(blocks, row)
      const newRow = row.map(update('y', dec))
      blocks = union(blocks, newRow)
    }

    return memo
  }, 0, rows)

  return blocks
}

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
    let blocks = union(this.blocks, tetromino.blocks)

    // Clear completed rows.
    blocks = clearRows(blocks)

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
    const collideBlock = b => this.blocks.some(a => a.x === b.x && a.y === b.y)
    const isOutside = b => b.x < 0 || b.x >= WIDTH || b.y < 0 || b.y >= HEIGHT + 2
    return tetromino.blocks.some(whereAny([collideBlock, isOutside]))
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}
