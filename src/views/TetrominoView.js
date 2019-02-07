import React from 'react'
import classnames from 'classnames'

import BlockView from './BlockView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ ghost, tetromino: { shape, blocks } }) => {
  const className = classnames(
    styles.tetromino,
    styles[`shape-${shape.toLowerCase()}`],
    { [styles.ghostPiece]: ghost }
  )

  return (
    <ul className={className}>
      {blocks.map(block => <BlockView key={block.id} block={block} />)}
    </ul>
  )
}
