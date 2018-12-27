import 'normalize.css'
import React from 'react'

import GameOverView from './game_over_view'
import GameView from './game_view'
import HelpView from './help_view'

export default ({ bus, state: { game } }) =>
  <React.Fragment>
    <GameView bus={bus} game={game} />
    {game.paused ? <HelpView bus={bus} /> : null}
    {game.over ? <GameOverView bus={bus} /> : null}
  </React.Fragment>
