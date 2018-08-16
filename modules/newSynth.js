import Tone from 'tone';

const fmSynth = new Tone.FMSynth({
  "modulationIndex" : 1.22,
  "envelope" : {
    "attack" : 0.1,
    "decay" : 0.2
  },
  "modulation" : {
    "type" : "sine"
  },
  "modulationEnvelope" : {
    "attack" : 0.4,
    "decay" : 0.05
  }
}).toMaster();

export function playTestNote() {
  fmSynth.triggerAttackRelease(80, '32n', Tone.now(), 0.8);
}

export function playTestPattern() {
  Tone.Transport.cancel();
  const pattern = new Tone.Pattern((time, note) => {
    fmSynth.triggerAttackRelease(note, 0.25);
  }, ['c2', 'e2', 'g2', 'a2']);
  pattern.start();
  Tone.Transport.start();
}
