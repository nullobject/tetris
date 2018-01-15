import 'normalize.css'
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
const C = 67
const X = 88
const Z = 90

const BLOCK_SIZE = 23
const SYSTEM_EVENTS = ['pause', 'tick']

class BlockView extends React.PureComponent {
  render () {
    const {position, color} = this.props.block
    const style = {bottom: position.y * BLOCK_SIZE, left: position.x * BLOCK_SIZE}
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
    const message = this.props.message

    return (
      <div className={styles.tetrion}>
        <PlayfieldView playfield={playfield} />
        {fallingPiece ? <TetrominoView falling tetromino={fallingPiece} /> : null}
        {ghostPiece ? <TetrominoView ghost tetromino={ghostPiece} /> : null}
        {message ? <div className={styles.message}>{message}</div> : null}
      </div>
    )
  }
}

class GameView extends React.PureComponent {
  render () {
    const {bus, game} = this.props
    let message

    if (game.isFinished) {
      message = 'Game Over'
    } else if (game.reward && game.reward.message) {
      message = game.reward.message
    }

    return (
      <div className={styles.game}>
        <aside className={styles.left}>
          <div className={styles.panel}>
            <h6>Hold</h6>
            {game.tetrion.holdPiece ? <TetrominoView tetromino={game.tetrion.holdPiece} /> : null}
          </div>
          <div className={styles.progress}>
            <h6>Score</h6>
            <p>{game.progress.score}</p>
            <h6>Lines</h6>
            <p>{game.progress.lines}</p>
            <h6>Level</h6>
            <p>{game.progress.level}</p>
          </div>
        </aside>
        <TetrionView tetrion={game.tetrion} message={message} />
        <aside className={styles.right}>
          <div className={styles.panel}>
            <h6>Next</h6>
            {game.tetrion.nextPiece ? <TetrominoView tetromino={game.tetrion.nextPiece} /> : null}
          </div>
          <nav>
            <a href='#' onClick={() => bus.emit('pause')}>Help</a>
          </nav>
        </aside>
      </div>
    )
  }
}

class HelpView extends React.PureComponent {
  render () {
    const {bus} = this.props

    return (
      <div className={styles.modal}>
        <h1>How to Play</h1>

        <p>The goal of Tetris is to score as many points as possible by
        clearing horizontal lines of blocks. The player must rotate, move, and
        drop the falling tetriminos inside the playfield. Lines are cleared when
        they are filled with blocks and have no empty spaces.</p>

        <p>As lines are cleared, the level increases and tetriminos fall
        faster, making the game progressively more challenging. If the blocks
        land above the top of the playfield, then the game is over.</p>

        <dl>
          <dt>LEFT</dt>
          <dd>Move the falling tetromino left.</dd>

          <dt>RIGHT</dt>
          <dd>Move the falling tetromino right.</dd>

          <dt>DOWN</dt>
          <dd>Move the falling tetromino down (soft drop).</dd>

          <dt>Z</dt>
          <dd>Rotate the falling tetromino left.</dd>

          <dt>X/UP</dt>
          <dd>Rotate the falling tetromino right.</dd>

          <dt>C</dt>
          <dd>Store the falling tetromino for later use.</dd>

          <dt>SPACE</dt>
          <dd>Drop the falling tetromino to the bottom of the playfield and lock it immediately (hard drop).</dd>

          <dt>RETURN</dt>
          <dd>Drop the falling tetromino to the bottom of the playfield, but don't lock it (firm drop).</dd>
        </dl>

        <h1>Credits</h1>

        <p>Copyright © 2018 Josh Bassett</p>

        <p className={styles.center}><button onClick={() => bus.emit('pause')}>Resume</button></p>
      </div>
    )
  }
}

class RootView extends React.PureComponent {
  render () {
    const {bus, state} = this.props

    return (
      <div className={styles.container}>
        <GameView bus={bus} game={state.game} />
        {state.paused ? <HelpView bus={bus} /> : null}
      </div>
    )
  }
}

function transformer (state, event) {
  if (event === 'tick' && !state.paused) {
    // Get the next command.
    const command = state.commands.shift()
    const game = state.game.tick(CLOCK_PERIOD, command)

    state = {...state, game}
  } else if (event === 'pause') {
    const paused = state.paused
    state = {...state, paused: !paused}
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
