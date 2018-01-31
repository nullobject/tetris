import Message from './message'

/**
 * Returns the points earned for clearing the given number of lines.
 */
function calculatePoints (n, tspin) {
  switch (n) {
    case 4: // tetris
      return 800
    case 3: // triple
      return tspin ? 1600 : 500
    case 2: // double
      return tspin ? 1200 : 300
    case 1: // single
      return tspin ? 800 : 100
    default:
      return tspin ? 400 : 0
  }
}

/**
 * Returns the message for the number of lines cleared.
 */
function calculateMessage (n, tspin) {
  if (tspin) {
    return new Message('tspin')
  } else if (n === 4) {
    return new Message('tetris')
  }
}

/**
 * Represents the reward earned when dropping the falling piece or clearing
 * lines.
 */
export default class Reward {
  /**
   * Rewards a soft drop.
   *
   * @param level The current level.
   * @returns A new reward.
   */
  static softDrop (level) {
    return new Reward(level, 0)
  }

  /**
   * Rewards a firm drop.
   *
   * @param dropped The number of rows the falling piece was dropped.
   * @param level The current level.
   * @returns A new reward.
   */
  static firmDrop (dropped, level) {
    return new Reward(dropped * level, 0)
  }

  /**
   * Rewards a hard drop.
   *
   * @param dropped The number of rows the falling piece was dropped.
   * @param cleared The number of lines cleared.
   * @param level The current level.
   * @param combo True if the combo bonus should be applied, false otherwise.
   * @returns A new reward.
   */
  static hardDrop (dropped, cleared, level, combo) {
    const multiplier = combo ? 1.5 : 1
    const points = ((dropped * 2) + calculatePoints(cleared, false)) * level * multiplier
    const message = calculateMessage(cleared, false)
    return new Reward(points, cleared, message)
  }

  /**
   * Rewards clearing the given number of lines.
   *
   * @param cleared The number of lines cleared.
   * @param level The current level.
   * @param tspin True if the last transform was a T-spin, false otherwise.
   * @param combo True if the combo bonus should be applied, false otherwise.
   * @returns A new reward.
   */
  static clearLines (cleared, level, tspin, combo) {
    const multiplier = combo ? 1.5 : 1
    const points = calculatePoints(cleared, tspin) * level * multiplier
    const message = calculateMessage(cleared, tspin)
    return new Reward(points, cleared, message)
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
