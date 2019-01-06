import React from 'react'
import { render } from 'react-dom'
import nanobus from 'nanobus'
import { Signal, keyboardKeys, merge } from 'bulb'
import { append, head, tail } from 'fkit'

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

const commandSignal = keyboardKeys(document)
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

const bus = nanobus()
const busSignal = Signal.fromEvent('*', bus)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const muted = window.localStorage.getItem('muted') === 'true'
const initialState = { game: new Game(muted), commands: [] }
const root = document.getElementById('root')

const subscription = merge(busSignal, clockSignal, commandSignal)
  .scan(transformer, initialState)
  .subscribe(state => render(<RootView bus={bus} state={state} />, root))

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscription.unsubscribe()
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
