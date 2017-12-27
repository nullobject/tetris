import Tetrion from './tetrion'
import {copy} from 'fkit'

const SPAWN_DELAY = 100
const LOCK_DELAY = 1000

/**
 * The game is a state machine which controls a tetrion. The state is advanced
 * by repeatedly calling the `tick` function.
 */
export default class Game {
  constructor () {
    this.time = 0
    this.state = 'spawning'
    this.tetrion = new Tetrion()
    this.spawnTimer = 0
    this.lockTimer = 0
    this.gravityTimer = 0
  }

  get level () {
    return this.tetrion.progress.level
  }

  get lines () {
    return this.tetrion.progress.lines
  }

  get score () {
    return this.tetrion.progress.score
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

  /**
   * Returns the gravity delay in milliseconds.
   */
  get gravityDelay () {
    return Math.round((-333.54 * Math.log(this.level)) + 999.98)
  }

  /**
   * Increments the game state and applies the given intention.
   *
   * @param delta The time delta.
   * @param intention The user intention.
   * @returns A new game.
   */
  tick (delta, intention) {
    const time = this.time + delta
    let state = this.state
    let tetrion = this.tetrion
    let spawnTimer = this.spawnTimer
    let lockTimer = this.lockTimer
    let gravityTimer = this.gravityTimer

    if (this.isSpawning && time - this.spawnTimer >= SPAWN_DELAY) {
      tetrion = this.tetrion.spawn()
      state = 'idle'
      gravityTimer = time
    } else if (this.isLocking && time - this.lockTimer >= LOCK_DELAY) {
      tetrion = this.tetrion.lock()
      state = 'spawning'
      spawnTimer = time
    } else if (this.isIdle && time - this.gravityTimer >= this.gravityDelay) {
      // Apply gravity.
      tetrion = this.tetrion.moveDown()
      gravityTimer = time

      // Moving down failed, start locking.
      if (tetrion === this.tetrion) {
        state = 'locking'
        lockTimer = time
      }
    } else if ((this.isIdle || this.isLocking) && intention) {
      // Dispatch the intention.
      tetrion = this.tetrion[intention]()

      if (!tetrion.fallingPiece) {
        // Start spawning if there is no falling piece.
        state = 'spawning'
        spawnTimer = time
      } else if (this.isLocking && tetrion.canMoveDown) {
        // Abort locking if the falling piece can move down under gravity.
        state = 'idle'
        gravityTimer = time
      }
    }

    return copy(this, {time, state, tetrion, spawnTimer, lockTimer, gravityTimer})
  }

  toString () {
    return `Game (state: ${this.state}, lines: ${this.lines}, level: ${this.level}, score: ${this.score})`
  }
}
