import sounds from '../sounds.mp3'
import {Howl} from 'howler'
import {sprite} from '../sounds.json'

const sound = new Howl({src: [sounds], sprite})

export function play (id) {
  sound.play(id)
}
