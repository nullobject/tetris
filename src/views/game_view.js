import React from 'react'
import TetrionView from './tetrion_view'
import TetrominoView from './tetromino_view'
import styles from '../../assets/stylesheets/styles.scss'

const GITHUB_URL = 'https://github.com/nullobject/tetris'
const TWITTER_URL = 'https://twitter.com/intent/tweet?text=Wanna%20play%20some%20Tetris%3F&url=https%3A%2F%2Ftetris.joshbassett.info'

export default class GameView extends React.PureComponent {
  render () {
    const {bus, game} = this.props
    let message

    if (game.reward && game.reward.message) {
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

        <TetrionView message={message} tetrion={game.tetrion} />

        <aside className={styles.right}>
          <div className={styles.panel}>
            <h6>Next</h6>
            {game.tetrion.nextPiece ? <TetrominoView tetromino={game.tetrion.nextPiece} /> : null}
          </div>

          <nav>
            <a href='#' onClick={() => bus.emit('pause')}><span className={styles['icon-help']} /></a>
          </nav>
        </aside>

        <footer>
          <a href={TWITTER_URL} target='_blank'><span className={styles['icon-twitter']} /></a>
          <a href={GITHUB_URL} target='_blank'><span className={styles['icon-github']} /></a>
        </footer>
      </div>
    )
  }
}
