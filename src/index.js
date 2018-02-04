import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import RootView from './views/root_view'
import log from './log'
import nanobus from 'nanobus'
import {Signal, keyboard, merge} from 'bulb'
import {append, head, tail} from 'fkit'

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
const muted = window.localStorage.getItem('muted') === 'true'
const initialState = {game: new Game(muted), commands: []}
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

function transformer (state, event) {
  let {game, commands} = state

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

  return {...state, game, commands}
}
