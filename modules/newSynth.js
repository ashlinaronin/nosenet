import Tone from 'tone';

const metalSynth = new Tone.MetalSynth({
  frequency: 80,
  envelope:
    {
      attack: 0.001,
      decay:
        12.4,
      release:
        0.9
    }
  ,
  harmonicity: 2.1,
  modulationIndex:
    18,
  resonance:
    2000,
  octaves:
    3.5
}).toMaster();


export function startNote() {
  metalSynth.triggerAttack('+0.05', 0.8);
}

export function endNote() {
  metalSynth.triggerRelease('+0.05');
}

export function changeParam(x, y) {
  metalSynth.harmonicity = x;
  metalSynth.modulationIndex = y;
}
