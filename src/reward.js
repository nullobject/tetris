/**
 * Returns the points earned for clearing the given number of lines.
 */
function calculatePoints (n, tspin, kick) {
  switch (n) {
    case 4: // tetris
      return 800
    case 3: // triple
      return tspin ? 1600 : 500
    case 2: // double
      return tspin ? 1200 : 300
    case 1: // single
      if (tspin && !kick) {
        return 800
      } else if (tspin) {
        return 200
      } else {
        return 100
      }
    default:
      if (tspin && !kick) {
        return 400
      } else if (tspin) {
        return 100
      } else {
        return 0
      }
  }
}

/**
 * Returns the message for the number of lines cleared.
 */
function calculateMessage (n, tspin, kick) {
  if (tspin) {
    return 'tspin'
  } else if (n === 4) {
    return 'tetris'
  }
}

/**
 * Represents the reward earned when dropping the falling piece or clearing
 * lines.
 *
 * This is based on the Tetris DS scoring system. See
 * http://harddrop.com/wiki/Tetris_DS for details.
 */
export default class Reward {
  /**
   * Rewards a soft drop.
   *
   * @returns A new reward.
   */
  static softDrop () {
    return new Reward(1, 0)
  }

  /**
   * Rewards a firm drop.
   *
   * @param n The number of rows the falling piece was dropped.
   * @returns A new reward.
   */
  static firmDrop (n) {
    return new Reward(n, 0)
  }

  /**
   * Rewards a hard drop.
   *
   * @param n The number of rows the falling piece was dropped.
   * @param m The number of lines cleared.
   * @returns A new reward.
   */
  static hardDrop (n, cleared) {
    const points = (n * 2) + calculatePoints(cleared, false, false)
    const message = calculateMessage(cleared, false, false)
    return new Reward(points, cleared, message)
  }

  /**
   * Rewards clearing the given number of lines.
   *
   * @param n The number of lines cleared.
   * @returns A new reward.
   */
  static clearLines (n, tspin = false, kick = false) {
    const points = calculatePoints(n, tspin, kick)
    const message = calculateMessage(n, tspin, kick)
    return new Reward(points, n, message)
  }

  constructor (points, lines, message = null) {
    this.points = points
    this.lines = lines
    this.message = message
  }

  toString () {
    return `Reward (points: ${this.points}, lines: ${this.lines}, message: ${this.message}`
  }
}
