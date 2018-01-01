import Game from './game'
import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import log from './log'
import nanobus from 'nanobus'
import styles from './styles.scss'
import {Signal, keyboard, merge} from 'bulb'
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

class BlockView extends React.PureComponent {
  render () {
    const {x, y, color} = this.props.block
    const style = {bottom: y * BLOCK_SIZE, left: x * BLOCK_SIZE}
    return <li className={styles[color]} style={style} />
  }
}

class TetrominoView extends React.PureComponent {
  render () {
    const {shape, blocks} = this.props.tetromino
    const className = classnames(
      styles.tetromino,
      styles[`shape-${shape.toLowerCase()}`],
      {[styles.ghostPiece]: this.props.ghost}
    )
    return (
      <ul className={className}>
        {blocks.map(block => <BlockView key={block.id} block={block} />)}
      </ul>
    )
  }
}

class PlayfieldView extends React.PureComponent {
  render () {
    const {blocks} = this.props.playfield
    return (
      <ul className={styles.playfield}>
        {blocks.map(block => <BlockView key={block.id} block={block} />)}
      </ul>
    )
  }
}

class TetrionView extends React.PureComponent {
  render () {
    const {playfield, fallingPiece, ghostPiece} = this.props.tetrion
    return (
      <div className={styles.tetrion}>
        <PlayfieldView playfield={playfield} />
        {fallingPiece ? <TetrominoView falling tetromino={fallingPiece} /> : null}
        {ghostPiece ? <TetrominoView ghost tetromino={ghostPiece} /> : null}
      </div>
    )
  }
}

class GameView extends React.PureComponent {
  render () {
    const {game} = this.props
    return (
      <div className={styles.game}>
        <aside className={styles.left}>
          <div className={styles.panel}>
            HOLD
          </div>
          <dl className={styles.progress}>
            <dt>SCORE</dt>
            <dd>{game.progress.score}</dd>
            <dt>LINES</dt>
            <dd>{game.progress.lines}</dd>
            <dt>LEVEL</dt>
            <dd>{game.progress.level}</dd>
          </dl>
        </aside>
        <TetrionView tetrion={game.tetrion} />
        <aside className={styles.right}>
          <div className={styles.panel}>
            {game.tetrion.nextPiece ? <TetrominoView next tetromino={game.tetrion.nextPiece} /> : null}
            NEXT
          </div>
        </aside>
      </div>
    )
  }
}

const transformer = (state, event, emit) => {
  if (event === 'tick' && !state.paused) {
    // Get the next command.
    const command = state.commands.shift()
    const game = state.game.tick(CLOCK_PERIOD, command)

    // Emit the next game state.
    emit.next(game)

    state = {...state, game}
  } else if (event === 'pause') {
    log.info('pausing')
    const paused = state.paused
    state = {...state, paused: !paused}
  } else if (!elem(event, SYSTEM_EVENTS)) {
    state.commands.push(event)
  }

  return state
}

const commandSignal = keyboard
  .key(document)
  .stateMachine((_, key, emit) => {
    if (key.code === Z) {
      emit.next('rotateLeft')
    } else if (key.code === X) {
      emit.next('rotateRight')
    } else if (key.code === UP) {
      emit.next('rotateRight')
    } else if (key.code === DOWN) {
      emit.next('softDrop')
    } else if (key.code === LEFT) {
      emit.next('moveLeft')
    } else if (key.code === RIGHT) {
      emit.next('moveRight')
    } else if (key.code === ENTER) {
      emit.next('firmDrop')
    } else if (key.code === SPACE) {
      emit.next('hardDrop')
    }
  })

const bus = nanobus()
const busSignal = Signal.fromEvent('*', bus)
const clockSignal = Signal.periodic(CLOCK_PERIOD).always('tick')
const initialState = {game: new Game(), commands: [], paused: false}
const root = document.getElementById('root')

const subscription = merge(busSignal, clockSignal, commandSignal)
  .stateMachine(transformer, initialState)
  .subscribe(game => ReactDOM.render(<GameView game={game} bus={bus} />, root))

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscription.unsubscribe()
  })
}
