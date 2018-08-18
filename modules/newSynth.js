import Tone from 'tone';
import mapRange from './mapRange';

// create modules
const reverb = new Tone.Reverb(1.5);
const osc = new Tone.OmniOscillator();
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
  // const harmonicity = mapRange(y, 0, height, 0.0, 2.0);
  // const volume = mapRange(y, 0, height, 1.0, 0.0);

  osc.frequency.value = frequency;
  // synth.harmonicity.value = harmonicity;
  // synth.volume.value = volume;
}
