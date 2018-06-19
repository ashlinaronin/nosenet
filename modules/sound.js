import Tone from 'tone';

const noiseTypes = ['white', 'brown', 'pink'];
const fmSynth = new Tone.FMSynth({
  "modulationIndex" : 12.22,
  "envelope" : {
    "attack" : 0.01,
    "decay" : 0.2
  },
  "modulation" : {
    "type" : "square"
  },
  "modulationEnvelope" : {
    "attack" : 0.2,
    "decay" : 0.01
  }
}).toMaster();

export function playNote(x, y, width, height) {
  const volume = range(y, 0, height, 1.0, 0.0);
  const type = noiseTypes[Math.floor(range(x, 0, width, 0, 2))];
  const note = range(x, 0, width, 220, 440);

  fmSynth.triggerAttackRelease(note, '32n', Tone.now(), volume);
}

function range(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
