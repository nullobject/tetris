import 'tachyons'
import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import log from './log'
import nanobus from 'nanobus'
import styles from './styles.scss'
import {Signal, keyboard} from 'bulb'
import {elem} from 'fkit'

const CLOCK_PERIOD = 10

const ENTER = 13
const SPACE = 32
const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39
const X = 88
const Z = 90

const BLOCK_SIZE = 23
const SYSTEM_EVENTS = ['tick', 'pause']

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
    const className = classnames(styles.fallingPiece, {[styles.ghostPiece]: this.props.ghost})
    return (
      <ul className={className}>
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
    const {playfield, fallingPiece, ghostPiece} = this.props.tetrion
    return (
      <div className={styles.tetrion}>
        <Playfield playfield={playfield} />
        {fallingPiece ? <Tetromino tetromino={fallingPiece} /> : null}
        {ghostPiece ? <Tetromino ghost tetromino={ghostPiece} /> : null}
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
        <button className='f5 dim br-pill ph3 pv2 mb2 dib black bg-white bn pointer' onClick={() => bus.emit('pause')}>Pause</button>
      </div>
    )
  }
}

const transformer = (state, event, emit) => {
  if (event === 'tick' && !state.paused) {
    // Get the next intention.
    const intention = state.intentions.shift()
    const game = state.game.tick(CLOCK_PERIOD, intention)

    // Emit the next game state.
    emit.next(game)

    state = {...state, game}
  } else if (event === 'pause') {
    log.info('pausing')
    const paused = state.paused
    state = {...state, paused: !paused}
  } else if (!elem(event, SYSTEM_EVENTS)) {
    state.intentions.push(event)
  }

  return state
}

const intentionSignal = keyboard
  .keys(document)
  .stateMachine((_, keys, emit) => {
    if (keys.has(Z)) {
      emit.next('rotateLeft')
    } else if (keys.has(X)) {
      emit.next('rotateRight')
    } else if (keys.has(UP)) {
      emit.next('rotateRight')
    } else if (keys.has(DOWN)) {
      emit.next('softDrop')
    } else if (keys.has(LEFT)) {
      emit.next('moveLeft')
    } else if (keys.has(RIGHT)) {
      emit.next('moveRight')
    } else if (keys.has(ENTER)) {
      emit.next('firmDrop')
    } else if (keys.has(SPACE)) {
      emit.next('hardDrop')
    }
  })

const bus = nanobus()
const busSignal = Signal.fromEvent('*', bus)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const initialState = {game: new Game(), intentions: [], paused: false}
const root = document.getElementById('root')

const subscription = busSignal
  .merge(clockSignal, intentionSignal)
  .stateMachine(transformer, initialState)
  .subscribe(game => {
    ReactDOM.render(<App game={game} bus={bus} />, root)
  })

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscription.unsubscribe()
  })
}
