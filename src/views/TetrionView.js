import React from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'

import PlayfieldView from './PlayfieldView'
import TetrominoView from './TetrominoView'
import styles from '../../assets/stylesheets/styles.scss'

const Message = ({ text, ...props }) => (
  <Transition {...props} timeout={1000}>
    <div className={styles.message}>{text}</div>
  </Transition>
)

export default ({ message, tetrion: { playfield, fallingPiece, ghostPiece } }) =>
  <div className={styles.tetrion}>
    <PlayfieldView playfield={playfield} />
    {fallingPiece ? <TetrominoView falling tetromino={fallingPiece} /> : null}
    {ghostPiece ? <TetrominoView ghost tetromino={ghostPiece} /> : null}

    <TransitionGroup>
      {message ? <Message key={message.id} text={message.text} /> : null}
    </TransitionGroup>
  </div>
