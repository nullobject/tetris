import Tetrion from './tetrion'
import log from './log'
import {copy, set} from 'fkit'

export default class Game {
  constructor () {
    this.time = 0
    this.tetrion = new Tetrion()
    this.state = 'idle'
  }

  /**
   * Returns true if the game is paused, false otherwise.
   */
  get isPaused () {
    return this.state === 'paused'
  }

  get gravityDelay () {
    return Math.round((-333.54 * Math.log(this.tetrion.progress.level)) + 999.98)
  }

  /**
   * Increments the game state and applies the given intention.
   */
  tick (intention) {
    if (this.isPaused) {
      throw new Error('Cannot tick a paused game')
    }

    // Dispatch the intention.
    const tetrion = intention ? this.tetrion[intention]() : this.tetrion

    return copy(this, {time: this.time + 1, tetrion})
  }

  /**
   * Pauses or resumes the game.
   */
  pause () {
    log.info('pause')
    const state = this.isPaused ? 'idle' : 'paused'
    return set('state', state, this)
  }

  toString () {
    return `Game (time: ${this.time}, state: ${this.state})`
  }
}
