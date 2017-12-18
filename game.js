import nanostate from 'nanostate'

export default class Game {
  constructor() {
    this.time = 0
    this.fsm = nanostate('a', {
      a: {next: 'b'},
      b: {next: 'c'},
      c: {next: 'a'}
    })
  }

  tick(intention) {
    this.time++
    this.intention = intention
    this.fsm.emit('next')
    return this
  }

  toString() {
    return `Game (time: ${this.time}, intention: ${this.intention}, state: ${this.fsm.state})`
  }
}
