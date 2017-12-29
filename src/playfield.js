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
   * @param blocks An array of blocks.
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
   * @param blocks An array of blocks.
   * @returns A new playfield.
   */
  lock (blocks) {
    blocks = union(this.blocks, blocks)
    return copy(this, {blocks})
  }

  /**
   * Removes completed lines from the playfield. Blocks above any cleared rows
   * will be moved down.
   *
   * @returns An object containing the playfield and the number of cleared
   * lines.
   */
  clearLines () {
    const rows = groupBlocksByRow(this.blocks)
    let blocks = this.blocks

    const cleared = fold((cleared, row) => {
      if (isComplete(row)) {
        blocks = difference(blocks, row)
        cleared++
      } else if (cleared > 0) {
        blocks = difference(blocks, row)
        const newRow = row.map(update('y', sub(cleared)))
        blocks = union(blocks, newRow)
      }

      return cleared
    }, 0, rows)

    return {playfield: copy(this, {blocks}), cleared}
  }

  /**
   * Returns the blocks at the given positions `ps`.
   *
   * @param ps An array of positions.
   * @returns An array of blocks.
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
