import Tone from 'tone';
import mapRange from './mapRange';

// create modules
const reverb = new Tone.Reverb(1.5);
const osc = new Tone.FatOscillator(440, 'sawtooth');
const env = new Tone.AmplitudeEnvelope();

// generate impulse response for verb, then connect modules
reverb.generate().then(() => {
  osc.start();
  osc.connect(env);
  env.connect(reverb);
  reverb.toMaster();
});


export function startNote() {
  env.triggerAttack('+0.05', 0.8);
}

export function endNote() {
  env.triggerRelease('+0.05');
}

export function changeParam(x, y, width, height) {
  const frequency = mapRange(x, 0, width, 80, 660);
  const detune = mapRange(y, 0, height, -100.0, 100.0);
  const spread = mapRange(y, 0, height, 0, 40);
  const phase = mapRange(x, 0, width, 0, 90.0);

  osc.frequency.value = frequency;
  osc.phase = phase;
  osc.detune.value = detune;
  osc.spread = spread;
}
