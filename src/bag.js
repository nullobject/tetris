import SRS from './srs'
import {copy, empty, head, keys, shuffle, tail} from 'fkit'

/**
 * Returns an array of all the shapes randomly shuffled.
 */
function refill () {
  return shuffle(keys(SRS))
}

export default class Bag {
  constructor () {
    this.shapes = refill()
  }

  /**
   * Returns the next shape in the bag.
   */
  get next () {
    return head(this.shapes)
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
