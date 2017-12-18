import StateMachine from 'state-machine'

export default class Game {
  constructor() {
    this.time = 0
    this.intention = null
    this.fsm = new StateMachine({
      initial: 'a',
      transitions: [
        'next: a > b > c > d > e'
      ],
      handlers: {
        'e': () => console.log('done!')
      }
    })
  }

  tick(intention) {
    this.time++
    this.intention = intention
    this.fsm.do('next')
    return this
  }

  toString() {
    return `Game (time: ${this.time}, intention: ${this.intention}, state: ${this.fsm.state})`
  }
}
