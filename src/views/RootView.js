import 'normalize.css'
import React from 'react'

import GameOverView from './GameOverView'
import GameView from './GameView'
import HelpView from './HelpView'

export default ({ bus, state: { game } }) =>
  <React.Fragment>
    <GameView bus={bus} game={game} />
    {game.paused ? <HelpView bus={bus} /> : null}
    {game.over ? <GameOverView bus={bus} /> : null}
  </React.Fragment>
