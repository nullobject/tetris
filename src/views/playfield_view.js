import BlockView from './block_view'
import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

export default ({playfield: {blocks}}) =>
      <ul className={styles.playfield}>
        {blocks.map(block => <BlockView key={block.id} block={block} />)}
      </ul>
