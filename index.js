import './styles.scss'
import 'tachyons'
import React from 'react'
import ReactDOM from 'react-dom'
import StateMachine from 'state-machine'
import bulb from 'bulb'

class Game {
  constructor() {
    this.time = 0
    this.intention = null
    this.fsm = new StateMachine({
      transitions: [
        'next: a > b > c'
      ],
      handlers: {
        'c': () => console.log('done!')
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

const CLOCK_PERIOD = 1000
const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39

const App = ({time}) => (
  <h1 className="f-headline pa3 pa4-ns">What's the time? {time}</h1>
)

const root = document.getElementById('root')

const transformer = (state, event, emit) => {
  if (event === 'tick') {
    state = {game: state.game.tick(state.intentions.shift()), intentions: state.intentions}
    emit.next(state.game)
    return state
  } else {
    state.intentions.push(event)
    return {game: state.game, intentions: state.intentions}
  }
}

const subscription = clockSignal()
  .merge(intentionSignal())
  .stateMachine(transformer, {game: new Game(), intentions: []})
  .subscribe(game =>
    ReactDOM.render(<App time={game.toString()} />, root)
  )

if (module.hot) {
  module.hot.dispose(() => {
    subscription.unsubscribe()
  })
}

function intentionSignal () {
  return bulb.keyboard.keys(document).stateMachine((_, keys, emit) => {
    if (keys.has(UP)) {
      emit.next('rotate-right')
    } else if (keys.has(DOWN)) {
      emit.next('soft-drop')
    } else if (keys.has(LEFT)) {
      emit.next('move-left')
    } else if (keys.has(RIGHT)) {
      emit.next('move-right')
    }
  })
}

function clockSignal () {
  return bulb.Signal.periodic(CLOCK_PERIOD).always('tick')
}
