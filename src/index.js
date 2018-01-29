import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import RootView from './views/root_view'
import log from './log'
import nanobus from 'nanobus'
import {Signal, keyboard, merge} from 'bulb'
import {elem} from 'fkit'

const CLOCK_PERIOD = 10

const ENTER = 13
const SPACE = 32
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const C = 67
const X = 88
const Z = 90

const SYSTEM_EVENTS = ['pause', 'restart', 'tick']

function transformer (state, event) {
  if (event === 'tick' && !state.paused) {
    const command = state.commands.shift()
    const game = state.game.tick(CLOCK_PERIOD, command)
    state = {...state, game}
  } else if (event === 'pause') {
    const paused = state.paused
    state = {...state, paused: !paused}
  } else if (event === 'restart') {
    const game = new Game()
    state = {...state, game}
  } else if (!elem(event, SYSTEM_EVENTS) && !state.paused) {
    state.commands.push(event)
  }

  return state
}

const commandSignal = keyboard
  .keys(document)
  .stateMachine((_, key, emit) => {
    if (key === Z) {
      emit.next('rotateLeft')
    } else if (key === X) {
      emit.next('rotateRight')
    } else if (key === UP) {
      emit.next('rotateRight')
    } else if (key === DOWN) {
      emit.next('softDrop')
    } else if (key === LEFT) {
      emit.next('moveLeft')
    } else if (key === RIGHT) {
      emit.next('moveRight')
    } else if (key === ENTER) {
      emit.next('firmDrop')
    } else if (key === SPACE) {
      emit.next('hardDrop')
    } else if (key === C) {
      emit.next('hold')
    }
  })

const bus = nanobus()
const busSignal = Signal.fromEvent('*', bus)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const initialState = {game: new Game(), commands: [], paused: false}
const root = document.getElementById('root')

const subscription = merge(busSignal, clockSignal, commandSignal)
  .scan(transformer, initialState)
  .subscribe(state => ReactDOM.render(<RootView bus={bus} state={state} />, root))

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscription.unsubscribe()
  })
}
