import React from 'react'
import classnames from 'classnames'

import SocialView from './SocialView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus }) =>
  <div className={classnames(styles.modal, styles.row)}>
    <div className={classnames(styles.container, styles['align-self-center'])}>
      <h1>Game Over</h1>
      <footer>
        <button onClick={() => bus.value('restart')}>Play Again</button>
        <SocialView />
      </footer>
    </div>
  </div>
