import SRS from './srs'
import {copy, empty, head, keys, sample, tail} from 'fkit'

/**
 * Returns an array of all the shapes randomly shuffled.
 */
function refill () {
  return sample(7, keys(SRS))
}

export default class Bag {
  constructor () {
    this.shapes = refill()
  }

  /**
   * Removes the next shape from the bag. If the bag is empty, then it is
   * refilled.
   *
   * @returns An object containing the shape and the new bag state.
   */
  shift () {
    const shape = head(this.shapes)
    let shapes = tail(this.shapes)

    if (empty(shapes)) {
      shapes = refill()
    }

    return {bag: copy(this, {shapes}), shape}
  }
}
