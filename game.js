import Tetrion from './tetrion'
import nanostate from 'nanostate'

export default class Game {
  constructor () {
    this.time = 0
    this.fsm = nanostate('a', {
      a: {next: 'b'},
      b: {next: 'c'},
      c: {next: 'a'}
    })
    this.tetrion = new Tetrion()
  }

  tick (intention) {
    this.time++
    this.intention = intention
    this.fsm.emit('next')

    // Dispatch the intention.
    if (intention) {
      if (!this.tetrion[intention]) {
        throw new Error(`Unknown intention: ${intention}`)
      }
      this.tetrion[intention].apply(this.tetrion)
    }

    return this
  }

  toString () {
    return `Game (time: ${this.time}, intention: ${this.intention}, state: ${this.fsm.state})`
  }
}
