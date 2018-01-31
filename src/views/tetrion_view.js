import PlayfieldView from './playfield_view'
import React from 'react'
import TetrominoView from './tetromino_view'
import styles from '../../assets/stylesheets/styles.scss'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

const Message = ({text, ...props}) => (
  <CSSTransition
    {...props}
    timeout={1000}
    classNames='fade'
  >
    <div className={styles.message}>{text}</div>
  </CSSTransition>
)

export default class TetrionView extends React.PureComponent {
  render () {
    const {message, tetrion} = this.props
    const {playfield, fallingPiece, ghostPiece} = tetrion

    return (
      <div className={styles.tetrion}>
        <PlayfieldView playfield={playfield} />
        {fallingPiece ? <TetrominoView falling tetromino={fallingPiece} /> : null}
        {ghostPiece ? <TetrominoView ghost tetromino={ghostPiece} /> : null}

        <TransitionGroup>
          {message ? <Message key={message.id} text={message.text} /> : null}
        </TransitionGroup>
      </div>
    )
  }
}
