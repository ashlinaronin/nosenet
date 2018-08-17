import Tone from 'tone';
import mapRange from './mapRange';

const synth = new Tone.DuoSynth().toMaster();

export function startNote() {
  synth.triggerAttack(synth.frequency.value, '+0.05', 0.8);
}

export function endNote() {
  synth.triggerRelease('+0.05');
}

export function changeParam(x, y, width, height) {
  const frequency = mapRange(x, 0, width, 80, 660);
  const harmonicity = mapRange(y, 0, height, 0.0, 2.0);
  const volume = mapRange(y, 0, height, 1.0, 0.0);

  synth.frequency.value = frequency;
  synth.harmonicity.value = harmonicity;
  synth.volume.value = volume;
}
