import GameOverView from './game_over_view'
import PlayfieldView from './playfield_view'
import TetrominoView from './tetromino_view'
import React from 'react'
import styles from '../stylesheets/styles.scss'

export default class TetrionView extends React.PureComponent {
  render () {
    const {bus, gameOver, message, tetrion} = this.props
    const {playfield, fallingPiece, ghostPiece} = tetrion

    return (
      <div className={styles.tetrion}>
        <PlayfieldView playfield={playfield} />
        {fallingPiece ? <TetrominoView falling tetromino={fallingPiece} /> : null}
        {ghostPiece ? <TetrominoView ghost tetromino={ghostPiece} /> : null}
        {message ? <div className={styles.message}>{message}</div> : null}
        {gameOver ? <GameOverView bus={bus} /> : null}
      </div>
    )
  }
}
