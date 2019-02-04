import React from 'react'
import { Bus, Signal } from 'bulb'
import { Keyboard } from 'bulb-input'
import { append, head, tail } from 'fkit'
import { render } from 'react-dom'

import Game from './game'
import RootView from './views/root_view'
import log from './log'

const CLOCK_PERIOD = 10

const ENTER = 13
const SPACE = 32
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const C = 67
const H = 72
const M = 77
const X = 88
const Z = 90

const root = document.getElementById('root')

const commandSignal = Keyboard
  .keys(document)
  .stateMachine((_, key, emit) => {
    if (key === Z) {
      emit.value('rotateLeft')
    } else if (key === X) {
      emit.value('rotateRight')
    } else if (key === UP) {
      emit.value('rotateRight')
    } else if (key === DOWN) {
      emit.value('softDrop')
    } else if (key === LEFT) {
      emit.value('moveLeft')
    } else if (key === RIGHT) {
      emit.value('moveRight')
    } else if (key === ENTER) {
      emit.value('firmDrop')
    } else if (key === SPACE) {
      emit.value('hardDrop')
    } else if (key === C) {
      emit.value('hold')
    } else if (key === H) {
      emit.value('pause')
    } else if (key === M) {
      emit.value('mute')
    }
  })

const bus = new Bus()
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const muted = window.localStorage.getItem('muted') === 'true'
const initialState = { game: new Game(muted), commands: [] }
const stateSignal = bus.scan(transformer, initialState)

const subscriptions = [
  // Forward events from the clock signal to the bus.
  bus.connect(clockSignal),

  // Forward events from the command signal to the bus.
  bus.connect(commandSignal),

  // Render the UI whenever the state changes.
  stateSignal.subscribe(state => render(<RootView bus={bus} state={state} />, root))
]

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscriptions.forEach(s => s.unsubscribe())
  })
}

/**
 * Applies an event to yield a new state.
 *
 * @param state The current state.
 * @param event An event.
 * @returns A new game.
 */
function transformer (state, event) {
  let { game, commands } = state

  if (event === 'tick') {
    game = game.tick(CLOCK_PERIOD, head(commands))
    commands = tail(commands)
  } else if (event === 'pause') {
    game = game.pause()
  } else if (event === 'mute') {
    game = game.mute()
    window.localStorage.setItem('muted', game.muted)
  } else if (event === 'restart') {
    game = new Game()
  } else if (!game.paused) {
    commands = append(event, commands)
  }

  return { ...state, game, commands }
}
