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
  metalSynth.triggerAttack(Tone.now(), 0.8);
}

export function endNote() {
  metalSynth.triggerRelease(Tone.now());
}

export function changeParam(event) {
  metalSynth.harmonicity = Number(event.target.value);
}
