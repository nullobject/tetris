import 'tachyons'
import Game from './game'
import choo from 'choo'
import html from 'choo/html'
import nanologger from 'nanologger'
import styles from './styles.css'
import {Signal, keyboard} from 'bulb'
import {elem, values} from 'fkit'

const CLOCK_PERIOD = 100
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const SPACE = 32

const game = new Game()

window.initialState = {game}

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

const log = nanologger('game')

function gameView (state, emit) {
  const tetrion = state.game.tetrion
  return html`
    <body class="sans-serif bg-hot-pink">
      <p>${state.game.toString()}</p>
      <button class="f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer" onclick=${() => emit('tick')}>Pause</button>
      ${tetrionView(tetrion, emit)}
    </body>
  `
}

function tetrionView (tetrion, emit) {
  return html`
    <div class="${styles.tetrion}">
      ${playfieldView(tetrion.playfield, emit)}
      ${tetrominoView(tetrion.fallingPiece, emit)}
    </ul>
  `
}

function playfieldView (playfield, emit) {
  const blocks = playfield.blocks
  return html`
    <ul class="${styles.playfield}">
      ${blocks.map(block =>
        html`<li class="bg-${block.color}" style="bottom: ${block.y * 20}px; left: ${block.x * 20}px;"></li>`
      )}
    </ul>
  `
}

function tetrominoView (tetromino, emit) {
  const blocks = tetromino.blocks
  return html`
    <ul class="${styles.fallingPiece}">
      ${blocks.map(block =>
        html`<li class="bg-${block.color}" style="bottom: ${block.y * 20}px; left: ${block.x * 20}px;"></li>`
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
      emit.next('moveDown')
    } else if (keys.has(LEFT)) {
      emit.next('moveLeft')
    } else if (keys.has(RIGHT)) {
      emit.next('moveRight')
    } else if (keys.has(SPACE)) {
      emit.next('lock')
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
