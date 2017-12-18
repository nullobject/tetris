import './styles.scss'
import 'tachyons'
import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import {Signal, keyboard} from 'bulb'

const CLOCK_PERIOD = 1000
const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39

const App = ({game}) => (
  <h1 className="f-headline pa3 pa4-ns">{game.toString()}</h1>
)

const root = document.getElementById('root')

const transformer = (state, event, emit) => {
  if (event === 'tick') {
    // Get the next intention.
    const intention = state.intentions.shift()
    const game = state.game.tick(intention)

    // Emit the next game state.
    emit.next(game)

    state = {...state, game}
  } else {
    state.intentions.push(event)
  }

  return state
}

const intentionSignal = keyboard
  .keys(document)
  .stateMachine((_, keys, emit) => {
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

const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')

const subscription = clockSignal
  .merge(intentionSignal)
  .stateMachine(transformer, {game: new Game(), intentions: []})
  .subscribe(game =>
    ReactDOM.render(<App game={game} />, root)
  )

if (module.hot) {
  module.hot.dispose(() => {
    subscription.unsubscribe()
  })
}
