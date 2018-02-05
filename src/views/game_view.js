import React from 'react'
import TetrionView from './tetrion_view'
import TetrominoView from './tetromino_view'
import styles from '../../assets/stylesheets/styles.scss'

export default ({bus, game}) => {
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
          <a href='#' onClick={() => bus.emit('mute')}><span className={game.muted ? styles['icon-bell-slash'] : styles['icon-bell']} /></a>
        </nav>
      </aside>
    </div>
  )
}
