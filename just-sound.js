import { startNote, endNote, changeParam } from './modules/newSynth';

document.getElementById('control--start').addEventListener('click', startNote);
document.getElementById('control--end').addEventListener('click', endNote);
document.getElementById('control--param').addEventListener('input', changeParam);