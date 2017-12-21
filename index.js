import 'tachyons'
import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import log from './log'
import nanobus from 'nanobus'
import styles from './styles.scss'
import {Signal, keyboard} from 'bulb'

const CLOCK_PERIOD = 100
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const SPACE = 32
const BLOCK_SIZE = 23

const Block = ({block}) => {
  const style = {bottom: block.y * BLOCK_SIZE, left: block.x * BLOCK_SIZE}
  return <li className={styles[block.color]} style={style} />
}

const Tetromino = ({tetromino}) => (
  <ul className={styles.fallingPiece}>
    {tetromino.blocks.map(block => <Block key={block.id} block={block} />)}
  </ul>
)

const Playfield = ({playfield}) => (
  <ul className={styles.playfield}>
    {playfield.blocks.map(block => <Block key={block.id} block={block} />)}
  </ul>
)

const Tetrion = ({tetrion}) => (
  <div className={styles.tetrion}>
    <Playfield playfield={tetrion.playfield} />
    <Tetromino tetromino={tetrion.fallingPiece} />
  </div>
)

const App = ({bus, game}) => (
  <div>
    <p>{game.toString()}</p>
    <Tetrion tetrion={game.tetrion} />
    <button className='f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer' onClick={() => bus.emit('tick')}>hello</button>
  </div>
)

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

const bus = nanobus()
const busSignal = Signal.fromEvent('*', bus)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const initialState = {game: new Game(), intentions: []}

const subscription = busSignal
  .merge(clockSignal, intentionSignal)
  .stateMachine(transformer, initialState)
  .subscribe(game => {
    ReactDOM.render(<App game={game} bus={bus} />, document.getElementById('root'))
  })

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscription.unsubscribe()
  })
}
