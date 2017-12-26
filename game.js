import Progress from './progress'
import Tetrion from './tetrion'
import {copy} from 'fkit'

const SPAWN_DELAY = 100
const LOCK_DELAY = 1000

export default class Game {
  constructor (clockPeriod) {
    this.clockPeriod = clockPeriod
    this.time = 0
    this.state = 'spawning'
    this.tetrion = new Tetrion()
    this.progress = new Progress()
    this.lastSpawn = 0
    this.lastLock = 0
    this.lastGravity = 0
  }

  /**
   * Returns true if the game is idle, false otherwise.
   */
  get isIdle () {
    return this.state === 'idle'
  }

  /**
   * Returns true if the game is spawning, false otherwise.
   */
  get isSpawning () {
    return this.state === 'spawning'
  }

  /**
   * Returns true if the game is locking, false otherwise.
   */
  get isLocking () {
    return this.state === 'locking'
  }

  get gravityDelay () {
    return Math.round((-333.54 * Math.log(this.progress.level)) + 999.98)
  }

  /**
   * Increments the game state and applies the given intention.
   */
  tick (intention) {
    const time = this.time + 1
    let state = this.state
    let tetrion = this.tetrion
    let lastSpawn = this.lastSpawn
    let lastLock = this.lastLock
    let lastGravity = this.lastGravity

    if (this.isSpawning && (time - this.lastSpawn) * this.clockPeriod >= SPAWN_DELAY) {
      tetrion = this.tetrion.spawn()
      state = 'idle'
      lastGravity = time
    } else if (this.isLocking && (time - this.lastLock) * this.clockPeriod >= LOCK_DELAY) {
      tetrion = this.tetrion.lock()
      state = 'spawning'
      lastSpawn = time
    } else if (this.isIdle && (time - this.lastGravity) * this.clockPeriod >= this.gravityDelay) {
      // Apply gravity.
      tetrion = this.tetrion.moveDown()
      lastGravity = time

      // Moving down failed, start locking.
      if (tetrion === this.tetrion) {
        state = 'locking'
        lastLock = time
      }
    } else if ((this.isIdle || this.isLocking) && intention) {
      // Dispatch the intention.
      tetrion = this.tetrion[intention]()

      // Abort locking if the falling piece can move down under gravity.
      if (tetrion.canMoveDown) {
        state = 'idle'
      }
    }

    return copy(this, {time, state, tetrion, lastSpawn, lastLock, lastGravity})
  }

  toString () {
    return `Game (time: ${this.time}, state: ${this.state})`
  }
}
