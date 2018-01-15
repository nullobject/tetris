import React from 'react'
import styles from '../stylesheets/styles.scss'

export default class GameOverView extends React.PureComponent {
  render () {
    const bus = this.props.bus

    return (
      <div className={styles.overlay}>
        <p>Game Over</p>
        <button onClick={() => bus.emit('restart')}>Restart</button>
      </div>
    )
  }
}
