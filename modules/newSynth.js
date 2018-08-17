import Tone from 'tone';

const metalSynth = new Tone.MetalSynth({
  frequency: 80,
  envelope:
    {
      attack: 0.001,
      decay:
        1.4,
      release:
        0.9
    }
  ,
  harmonicity: 2.1,
  modulationIndex:
    18,
  resonance:
    150,
  octaves:
    3.5
}).toMaster();

const harmonicityPattern = new Tone.Pattern((time, harmonicity) => {
  metalSynth.harmonicity = harmonicity;
  metalSynth.triggerAttackRelease(0.25, time, 0.8);
}, [1, 2, 3, 4]);

export function playTestNote() {
  metalSynth.triggerAttackRelease(80, '32n', Tone.now(), 0.8);
}

export function playTestPattern() {
  Tone.Transport.cancel();
  harmonicityPattern.start();
  Tone.Transport.start();
}

export function stopSound() {
  Tone.Transport.stop();
}

export function playSound() {
  Tone.Transport.start();
}