import {compose, copy, dec, difference, fold, groupBy, sortBy, union, update} from 'fkit'

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
const isComplete = row => row.length === Playfield.WIDTH

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
class Playfield {
  constructor () {
    this.blocks = []
  }

  /**
   * Locks the given tetromino into the playfield.
   *
   * @returns A new playfield.
   */
  lock (tetromino) {
    // Add the tetromino's blocks to the playfield.
    let blocks = union(this.blocks, tetromino.blocks)

    // Clear completed rows.
    blocks = clearRows(blocks)

    return copy(this, {blocks})
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}

Playfield.WIDTH = 10
Playfield.HEIGHT = 20

export default Playfield
