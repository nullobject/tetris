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

class Block extends React.PureComponent {
  render () {
    const {x, y, color} = this.props.block
    const style = {bottom: y * BLOCK_SIZE, left: x * BLOCK_SIZE}
    return <li className={styles[color]} style={style} />
  }
}

class Tetromino extends React.PureComponent {
  render () {
    const {blocks} = this.props.tetromino
    return (
      <ul className={styles.fallingPiece}>
        {blocks.map(block => <Block key={block.id} block={block} />)}
      </ul>
    )
  }
}

class Playfield extends React.PureComponent {
  render () {
    const {blocks} = this.props.playfield
    return (
      <ul className={styles.playfield}>
        {blocks.map(block => <Block key={block.id} block={block} />)}
      </ul>
    )
  }
}

class Tetrion extends React.PureComponent {
  render () {
    const {playfield, fallingPiece} = this.props.tetrion
    return (
      <div className={styles.tetrion}>
        <Playfield playfield={playfield} />
        <Tetromino tetromino={fallingPiece} />
      </div>
    )
  }
}

class App extends React.PureComponent {
  render () {
    const {bus, game} = this.props
    return (
      <div>
        <p>{game.toString()}</p>
        <Tetrion tetrion={game.tetrion} />
        <button className='f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer' onClick={() => bus.emit('tick')}>hello</button>
      </div>
    )
  }
}

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
