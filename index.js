import 'tachyons'
import Game from './game'
import choo from 'choo'
import html from 'choo/html'
import nanologger from 'nanologger'
import styles from './styles.css'
import {Signal, keyboard} from 'bulb'
import {elem, values} from 'fkit'

const CLOCK_PERIOD = 1000
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39

const game = new Game()

window.initialState = {game}

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

const log = nanologger('game')

function gameView (state, emit) {
  return html`
    <body class="sans-serif bg-hot-pink">
      <h1 class="f-headline pa3 pa4-ns">${state.game.toString()}</h1>
      <button class="f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer" onclick=${() => emit('tick')}>Pause</button>
      ${tetrionView(state, emit)}
    </body>
  `
}

function tetrionView (state, emit) {
  return html`
    <div class="${styles.tetrion}">
      ${playfieldView(state, emit)}
    </ul>
  `
}

function playfieldView (state, emit) {
  const blocks = [{x: 0, y: 0, c: 'red'}, {x: 1, y: 0, c: 'green'}]
  return html`
    <ul class="${styles.playfield}">
      ${blocks.map(block =>
        html`<li class="bg-${block.c}" style="bottom: 0px; left: ${block.x * 20}px;"></li>`
      )}
    </ul>
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
  } else if (!elem(event, values(app.state.events))) {
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
      emit.next('rotateRight')
    } else if (keys.has(DOWN)) {
      emit.next('softDrop')
    } else if (keys.has(LEFT)) {
      emit.next('moveLeft')
    } else if (keys.has(RIGHT)) {
      emit.next('moveRight')
    }
  })

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

app.route('/', gameView)
app.mount(document.body)
