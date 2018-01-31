import BlockView from './block_view'
import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

export default class PlayfieldView extends React.PureComponent {
  render () {
    const {blocks} = this.props.playfield

    return (
      <ul className={styles.playfield}>
        <TransitionGroup>
          {blocks.map(block => (
            <CSSTransition key={block.id} timeout={1000} classNames={{exit: styles['fade-exit'], exitActive: styles['fade-exit-active']}}>
              <BlockView block={block} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    )
  }
}
