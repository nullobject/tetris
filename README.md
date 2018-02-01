# Tetris

[![Build Status](https://travis-ci.org/nullobject/tetris.svg?branch=master)](https://travis-ci.org/nullobject/tetris)

This is an implementation of the popular game Tetris.

The goal of Tetris is to score as many points as possible by clearing
horizontal lines of blocks. The player must rotate, move, and drop the falling
tetriminos inside the playfield. Lines are cleared when they are filled with
blocks and have no empty spaces.

As lines are cleared, the level increases and tetriminos fall faster, making
the game progressively more challenging. If the blocks land above the top of
the playfield, then the game is over.

## Development

To start a development server:

    > make start

To run the tests:

    > make test

To deploy the app:

    > make deploy

## Licence

This implementation of Tetris is licensed under the MIT licence. See the
[LICENCE](https://github.com/nullobject/tetris/blob/master/LICENCE.md) file for
more details.
