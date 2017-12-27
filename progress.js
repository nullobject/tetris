import {copy} from 'fkit'

/**
 * Represents the player progress with the level, number of lines cleared, and
 * score.
 */
export default class Progress {
  constructor () {
    this.lines = 0
    this.score = 0
  }

  /**
   * Returns the level (between 1 and 20).
   */
  get level () {
    return Math.min(Math.floor(this.lines / 10) + 1, 20)
  }

  /**
   * Adds a soft drop to the score.
   *
   * @returns A new progress.
   */
  softDrop () {
    const score = this.score + 1
    return copy(this, {score})
  }

  /**
   * Adds a firm drop to the score.
   *
   * @param n The number of rows the falling piece was dropped.
   * @returns A new progress.
   */
  firmDrop (n) {
    const score = this.score + n
    return copy(this, {score})
  }

  /**
   * Adds a hard drop to the score.
   *
   * @param n The number of rows the falling piece was dropped.
   * @returns A new progress.
   */
  hardDrop (n) {
    const score = this.score + (n * 2)
    return copy(this, {score})
  }

  /**
   * Clears the given number of rows.
   *
   * @param n The number of rows cleared.
   * @returns A new progress.
   */
  clearRows (n) {
    const lines = this.lines + n
    const score = this.score + (n * this.level)
    return copy(this, {lines, score})
  }
}
