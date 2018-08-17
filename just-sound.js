import { playTestPattern, stopSound, playSound } from './modules/newSynth';

document.getElementById('stop-sound').addEventListener('click', stopSound);
document.getElementById('play-sound').addEventListener('click', playSound);

playTestPattern();
