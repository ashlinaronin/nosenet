import Tone from 'tone';

const fmSynth = new Tone.FMSynth({
  "modulationIndex" : 14.22,
  "envelope" : {
    "attack" : 0.01,
    "decay" : 0.2
  },
  "modulation" : {
    "type" : "sine"
  },
  "modulationEnvelope" : {
    "attack" : 0.3,
    "decay" : 0.05
  }
}).toMaster();

export function playNote(x, y, width, height) {
  const volume = range(y, 0, height, 1.0, 0.0);
  const note = range(x, 0, width, 80, 660);
  const harmonicity = range(y, 0, height, 0.0, 2.0);

  fmSynth.harmonicity.value = harmonicity;
  fmSynth.triggerAttackRelease(note, '32n', Tone.now(), volume);
}

function range(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
