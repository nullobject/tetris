import BlockView from './block_view'
import React from 'react'
import styles from '../stylesheets/styles.scss'

export default class PlayfieldView extends React.PureComponent {
  render () {
    const {blocks} = this.props.playfield
    return (
      <ul className={styles.playfield}>
        {blocks.map(block => <BlockView key={block.id} block={block} />)}
      </ul>
    )
  }
}
