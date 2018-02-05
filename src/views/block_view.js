import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

const BLOCK_SIZE = 23

export default ({block: {position, color}}) => {
    const style = {bottom: position.y * BLOCK_SIZE, left: position.x * BLOCK_SIZE}
    return <li className={styles[color]} style={style} />
}
