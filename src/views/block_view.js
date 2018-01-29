import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

const BLOCK_SIZE = 23

export default class BlockView extends React.PureComponent {
  render () {
    const {position, color} = this.props.block
    const style = {bottom: position.y * BLOCK_SIZE, left: position.x * BLOCK_SIZE}
    return <li className={styles[color]} style={style} />
  }
}
