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
    const blocks = union(this.blocks, tetromino.blocks)
    return copy(this, {blocks})
  }

  /**
   * Removes completed rows from the playfield. Rows above any cleared rows
   * will be moved down.
   *
   * @returns An object containing the playfield and the number of cleared
   * rows.
   */
  clearRows () {
    const rows = groupBlocksByRow(this.blocks)
    let blocks = this.blocks

    const numRows = fold((numRows, row) => {
      if (isComplete(row)) {
        blocks = difference(blocks, row)
        numRows++
      } else if (numRows > 0) {
        blocks = difference(blocks, row)
        const newRow = row.map(update('y', sub(numRows)))
        blocks = union(blocks, newRow)
      }

      return numRows
    }, 0, rows)

    return {playfield: copy(this, {blocks}), numRows}
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}

Playfield.WIDTH = 10
Playfield.HEIGHT = 20

export default Playfield
