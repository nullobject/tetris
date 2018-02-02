import React from 'react'
import SocialView from './social_view'
import classnames from 'classnames'
import styles from '../../assets/stylesheets/styles.scss'

export default class GameOverView extends React.PureComponent {
  render () {
    const bus = this.props.bus

    return (
      <div className={classnames(styles.modal, styles.row)}>
        <div className={classnames(styles.container, styles.center, styles['align-self-center'])}>
          <h1>Game Over</h1>
          <footer>
            <button onClick={() => bus.emit('restart')}>Play Again</button>
            <SocialView />
          </footer>
        </div>
      </div>
    )
  }
}
