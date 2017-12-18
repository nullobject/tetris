import StateMachine from 'state-machine'

export default class Game {
  constructor() {
    this.time = 0
    this.intention = null
    this.fsm = new StateMachine({
      initial: 'a',
      final: 'e',
      transitions: [
        'next: a > b > c > d > e > a'
      ],
      handlers: {
        'e': (_, fsm) => {
          console.log('done!')
          // fsm.reset()
        }
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
