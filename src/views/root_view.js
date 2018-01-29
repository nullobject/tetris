import 'normalize.css'
import GameView from './game_view'
import GameOverView from './game_over_view'
import HelpView from './help_view'
import React from 'react'

export default class RootView extends React.PureComponent {
  render () {
    const {bus, state: {game, paused}} = this.props

    return (
      <React.Fragment>
        <GameView bus={bus} game={game} />
        {paused ? <HelpView bus={bus} /> : null}
        {game.isFinished ? <GameOverView bus={bus} /> : null}
      </React.Fragment>
    )
  }
}
