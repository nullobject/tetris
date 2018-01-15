import PlayfieldView from './playfield_view'
import TetrominoView from './tetromino_view'
import React from 'react'
import styles from '../stylesheets/styles.scss'

export default class TetrionView extends React.PureComponent {
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
