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

  add (reward) {
    const lines = this.lines + reward.lines
    const score = this.score + (reward.points * this.level)
    return copy(this, {lines, score})
  }
}
