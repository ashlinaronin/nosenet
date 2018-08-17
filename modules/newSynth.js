import Tone from 'tone';
import mapRange from './mapRange';

// create modules
const reverb = new Tone.Reverb(1.5);
const synth = new Tone.DuoSynth({
  voice0: {
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 1.0,
      release: 0.8
    }
  },
  voice1: {
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 1.0,
      release: 0.8
    }
  }
});

// generate impulse response for verb, then connect modules
reverb.generate().then(() => {
  synth.connect(reverb);
  reverb.connect(Tone.Master);
});


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
