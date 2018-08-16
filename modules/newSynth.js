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
    "attack" : 0.2,
    "decay" : 0.05
  }
}).toMaster();

export function playTestNote() {
  fmSynth.triggerAttackRelease(80, '32n', Tone.now(), 0.8);
}
