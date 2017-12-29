import {any, compose, copy, difference, fold, groupBy, sortBy, sub, union, update, whereAny} from 'fkit'

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
 * The playfield is the grid in which the tetrominoes fall.
 */
export default class Playfield {
  constructor () {
    this.blocks = []
  }

  /**
   * Collides the given blocks with the playfield.
   *
   * Returns true if a block collides with (or is outside) the playfield, false
   * otherwise.
   *
   * @params blocks An array of blocks.
   * @returns A boolean value.
   */
  collide (blocks) {
    const collideBlock = b => this.blocks.some(a => a.x === b.x && a.y === b.y)
    const isOutside = b => b.x < 0 || b.x >= WIDTH || b.y < 0 || b.y >= HEIGHT + 2
    return blocks.some(whereAny([collideBlock, isOutside]))
  }

  /**
   * Locks the given blocks into the playfield.
   *
   * @params blocks An array of blocks.
   * @returns A new playfield.
   */
  lock (blocks) {
    blocks = union(this.blocks, blocks)
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

  /**
   * Returns the blocks at the given positions `ps`.
   */
  findBlocks (ps) {
    return this.blocks.filter(b =>
      any(p => p.x === b.x && p.y === b.y, ps)
    )
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}
