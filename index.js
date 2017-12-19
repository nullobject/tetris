import './styles.scss'
import 'tachyons'
import {prepend} from 'fkit'
import Game from './game'
import {Signal, keyboard} from 'bulb'
import choo from 'choo'
import html from 'choo/html'
import nanobus from 'nanobus'
import nanologger from 'nanologger'

const CLOCK_PERIOD = 1000
const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39

const game = new Game()

// window.initialState = {game}

const app = choo({initialState: {game}})

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

const log = nanologger('game')

const view = (state, emit) => {
  return html`
    <body class="sans-serif bg-hot-pink">
      <h1 class="f-headline pa3 pa4-ns">${state.game.toString()}</h1>
      <button class="f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer" onclick=${() => emit('tick')}>hello</button>
    </body>
  `
}

const transformer = (state, event, emit) => {
  if (event === 'tick') {
    // Get the next intention.
    const intention = state.intentions.shift()
    const game = state.game.tick(intention)

    // Emit the next game state.
    emit.next(game)

    state = {...state, game}
  } else if (event.startsWith('intention:')) {
    state.intentions.push(event)
  }

  return state
}

const busSignal = Signal.fromEvent('*', app.emitter)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
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
  .map(prepend('intention:'))

app.emitter.on('DOMContentLoaded', () => {
  const subscription = busSignal
    .merge(clockSignal, intentionSignal)
    .stateMachine(transformer, {game, intentions: []})
    .subscribe(game => {
      app.state.game = game
      app.emitter.emit(app.state.events.RENDER)
    })

  if (module.hot) {
    module.hot.dispose(() => {
      subscription.unsubscribe()
    })
  }
})

app.route('/', view)
app.mount(document.body)
