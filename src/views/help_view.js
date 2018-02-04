import React from 'react'
import SocialView from './social_view'
import styles from '../../assets/stylesheets/styles.scss'

export default class HelpView extends React.PureComponent {
  render () {
    const bus = this.props.bus

    return (
      <div className={styles.modal}>
        <div className={styles.container}>
          <h1>Tetris</h1>

          <h2>How to Play</h2>

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

            <dt>H</dt>
            <dd>Toggle the help screen.</dd>

            <dt>M</dt>
            <dd>Toggle the game audio.</dd>
          </dl>

          <h2>Credits</h2>

          <p>Made with love by <a href='https://joshbassett.info'>Josh Bassett</a>, 2018.</p>

          <p>Special thanks to <a href='https:/kouky.org'>Michael Koukoullis</a> for inspiring me to work on Tetris in the first place. This work is based on a project we started, but never finished.</p>

          <footer>
            <p><button onClick={() => bus.emit('pause')}>Resume</button></p>
            <SocialView />
          </footer>
        </div>
      </div>
    )
  }
}
