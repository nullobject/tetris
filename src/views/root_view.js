import GameView from './game_view'
import HelpView from './help_view'
import React from 'react'

export default class RootView extends React.PureComponent {
  render () {
    const {bus, state} = this.props

    return (
      <React.Fragment>
        <GameView bus={bus} game={state.game} />
        {state.paused ? <HelpView bus={bus} /> : null}
      </React.Fragment>
    )
  }
}
