import {compose, copy, difference, fold, groupBy, sortBy, sub, union, update} from 'fkit'

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
 * Removes completed rows from the playfield. Rows above cleared rows will be
 * moved down.
 *
 * @returns An object containing the blocks and the number of cleared rows.
 */
function clearRows (blocks) {
  const rows = groupBlocksByRow(blocks)

  const numRows = fold((memo, row) => {
    if (isComplete(row)) {
      blocks = difference(blocks, row)
      memo++
    } else if (memo > 0) {
      blocks = difference(blocks, row)
      const newRow = row.map(update('y', sub(memo)))
      blocks = union(blocks, newRow)
    }

    return memo
  }, 0, rows)

  return {blocks, numRows}
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
   * @param tetromino The tetromino to lock.
   * @returns A new playfield.
   */
  lock (tetromino) {
    // Add the tetromino's blocks to the playfield.
    const newBlocks = union(this.blocks, tetromino.blocks)

    // Clear completed rows.
    const {blocks, numRows} = clearRows(newBlocks)

    return {playfield: copy(this, {blocks}), numRows}
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}

Playfield.WIDTH = 10
Playfield.HEIGHT = 20

export default Playfield
