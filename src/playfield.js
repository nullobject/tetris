import {any, compose, copy, difference, fold, groupBy, sortBy, set, union, whereAny} from 'fkit'

const WIDTH = 10
const HEIGHT = 20

/**
 * Sorts and groups blocks by row.
 */
const groupBlocksByRow = compose(
  groupBy((a, b) => a.position.y === b.position.y),
  sortBy((a, b) => a.position.y - b.position.y)
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
    const collideBlock = b => this.blocks.some(a =>
      a.position.isEqual(b.position)
    )
    const isOutside = b => b.position.x < 0 || b.position.x >= WIDTH || b.position.y < 0 || b.position.y >= HEIGHT + 2
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
        const newRow = row.map(block =>
          set('position', block.position.sub([0, cleared]), block)
        )
        blocks = union(blocks, newRow)
      }

      return cleared
    }, 0, rows)

    return {playfield: copy(this, {blocks}), cleared}
  }

  /**
   * Returns the blocks at the given positions `ps`.
   *
   * @param vs An array of vectors.
   * @returns An array of blocks.
   */
  findBlocks (vs) {
    return this.blocks.filter(b =>
      any(a => a.isEqual(b.position), vs)
    )
  }

  toString () {
    return `Playfield (blocks: [${this.blocks}])`
  }
}
