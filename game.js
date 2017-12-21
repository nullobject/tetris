import Tetrion from './tetrion'
import nanostate from 'nanostate'
import {copy} from 'fkit'

export default class Game {
  constructor () {
    this.time = 0
    this.tetrion = new Tetrion()

    this.fsm = nanostate('spawning', {
      spawning: {next: 'idling'},
      idling: {next: 'locking'},
      locking: {next: 'spawning'}
    })

    // this.fsm.on('next', () => {
    //   if (this.fsm.state === 'locking') {
    //     this.tetrion.lock()
    //   }
    // })
  }

  tick (intention) {
    // this.fsm.emit('next')

    // Dispatch the intention.
    const tetrion = intention ? this.tetrion[intention]() : this.tetrion

    return copy(this, {time: this.time + 1, tetrion})
  }

  toString () {
    return `Game (time: ${this.time}, state: ${this.fsm.state}, tetrion: ${this.tetrion})`
  }
}
