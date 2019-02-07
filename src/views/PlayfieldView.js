import React from 'react'

import BlockView from './BlockView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ playfield: { blocks } }) =>
  <ul className={styles.playfield}>
    {blocks.map(block => <BlockView key={block.id} block={block} />)}
  </ul>
