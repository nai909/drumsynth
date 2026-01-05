import * as Tone from 'tone';
import { SynthEngine, DrumSynthParams } from '../types';

export class DrumSynth {
  private synths: Map<string, any> = new Map();
  private masterGain: Tone.Gain;
  private initialized: boolean = false;

  constructor() {
    this.masterGain = new Tone.Gain(0.8).toDestination();
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();
    this.initialized = true;
    console.log('Audio engine initialized');
  }

  triggerKick(time: number, velocity: number = 1, tune: number = 0, decay: number = 0.4, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const kick = new Tone.MembraneSynth({
        pitchDecay: Math.max(0.01, decay * 0.1),
        octaves: Math.max(1, 6 + (tone * 4)),
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.1, decay),
          sustain: 0,
          release: 0.01,
        },
      });

      const filter = new Tone.Filter({
        frequency: Math.max(100, Math.min(20000, filterCutoff * 8000 + 100)),
        type: 'lowpass',
        Q: Math.max(0, Math.min(20, filterResonance * 15)),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(1, drive)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));

      kick.chain(distortion, filter, panner, this.masterGain);

      const basePitch = Tone.Frequency('C1').transpose(tune * 24);
      kick.triggerAttackRelease(basePitch, '8n', time, Math.max(0, Math.min(1, velocity)));

      setTimeout(() => {
        kick.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
      }, 1500);
    } catch (error) {
      console.error('Kick error:', error);
    }
  }

  triggerSnare(time: number, velocity: number = 1, tune: number = 0, decay: number = 0.2, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const noise = new Tone.NoiseSynth({
        noise: { type: tone > 0.5 ? 'white' : 'pink' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.05, decay),
          sustain: 0,
          release: 0.01,
        },
      });

      const bodyOsc = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.05, decay * 0.3),
          sustain: 0,
          release: 0.01,
        },
      });

      const filter = new Tone.Filter({
        frequency: Math.max(100, Math.min(20000, filterCutoff * 8000 + 1000)),
        type: 'highpass',
        Q: Math.max(0, Math.min(20, filterResonance * 10)),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(1, drive)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const merger = new Tone.Gain(1);

      bodyOsc.connect(merger);
      noise.connect(merger);
      merger.chain(distortion, filter, panner, this.masterGain);

      const pitch = Tone.Frequency(200 + (tune * 100));
      bodyOsc.triggerAttackRelease(pitch, '16n', time, Math.max(0, Math.min(1, velocity * tone)));
      noise.triggerAttackRelease('16n', time, Math.max(0, Math.min(1, velocity)));

      setTimeout(() => {
        noise.dispose();
        bodyOsc.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
        merger.dispose();
      }, 1000);
    } catch (error) {
      console.error('Snare error:', error);
    }
  }

  triggerHiHat(time: number, velocity: number = 1, open: boolean = false, tune: number = 0, decay: number = 0.1, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const actualDecay = open ? Math.max(0.2, decay * 4) : Math.max(0.04, decay);

      // Use noise + oscillator mix for metallic hi-hat sound
      const noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: actualDecay,
          sustain: 0,
          release: 0.01,
        },
      });

      // Multiple oscillators for metallic character
      const osc1 = new Tone.Oscillator({
        frequency: 3140 * (1 + tune * 0.5),
        type: 'square',
      });

      const osc2 = new Tone.Oscillator({
        frequency: 4050 * (1 + tune * 0.5),
        type: 'square',
      });

      const env = new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: actualDecay,
        sustain: 0,
        release: 0.01,
      });

      const filter = new Tone.Filter({
        frequency: Math.max(7000, Math.min(20000, filterCutoff * 10000 + 7000)),
        type: 'highpass',
        Q: Math.max(1, Math.min(15, filterResonance * 10 + 1)),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(0.8, drive * 0.3)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const gain = new Tone.Gain(0.3);

      osc1.connect(env);
      osc2.connect(env);
      noise.connect(gain);
      env.connect(gain);
      gain.chain(distortion, filter, panner, this.masterGain);

      osc1.start(time);
      osc2.start(time);
      env.triggerAttackRelease(actualDecay, time, Math.max(0.1, Math.min(1, velocity * 0.5)));
      noise.triggerAttackRelease(actualDecay, time, Math.max(0.1, Math.min(1, velocity)));

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        osc1.dispose();
        osc2.dispose();
        env.dispose();
        noise.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
        gain.dispose();
      }, Math.max(500, actualDecay * 1000 + 100));
    } catch (error) {
      console.error('HiHat error:', error);
    }
  }

  triggerClap(time: number, velocity: number = 1, tune: number = 0, decay: number = 0.15, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const clap = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.05, decay),
          sustain: 0,
          release: 0.01,
        },
      });

      const filter = new Tone.Filter({
        frequency: Math.max(500, Math.min(20000, (filterCutoff * 6000 + 1000) * (1 + tune * 0.3))),
        type: 'bandpass',
        Q: Math.max(1, Math.min(20, (filterResonance * 10) + (tone * 3))),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(1, drive)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));

      clap.chain(distortion, filter, panner, this.masterGain);
      clap.triggerAttackRelease('16n', time, Math.max(0, Math.min(1, velocity)));

      setTimeout(() => {
        clap.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
      }, 1000);
    } catch (error) {
      console.error('Clap error:', error);
    }
  }

  triggerTom(time: number, velocity: number = 1, basePitch: string = 'G2', tune: number = 0, decay: number = 0.3, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const tom = new Tone.MembraneSynth({
        pitchDecay: Math.max(0.01, decay * 0.15),
        octaves: Math.max(1, 3 + (tone * 3)),
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.1, decay),
          sustain: 0,
          release: 0.01,
        },
      });

      const filter = new Tone.Filter({
        frequency: Math.max(100, Math.min(20000, filterCutoff * 6000 + 100)),
        type: 'lowpass',
        Q: Math.max(0, Math.min(20, filterResonance * 10)),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(1, drive)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));

      tom.chain(distortion, filter, panner, this.masterGain);

      const pitch = Tone.Frequency(basePitch).transpose(tune * 24);
      tom.triggerAttackRelease(pitch, '8n', time, Math.max(0, Math.min(1, velocity)));

      setTimeout(() => {
        tom.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
      }, 1500);
    } catch (error) {
      console.error('Tom error:', error);
    }
  }

  triggerFM(time: number, velocity: number = 1, basePitch: string = 'C3', tune: number = 0, decay: number = 0.2, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      const fm = new Tone.FMSynth({
        harmonicity: Math.max(0.5, 3 + (tone * 5)),
        modulationIndex: Math.max(1, 10 + (snap * 15)),
        envelope: {
          attack: 0.001,
          decay: Math.max(0.05, decay),
          sustain: 0,
          release: 0.01,
        },
        modulation: {
          type: 'square',
        },
        modulationEnvelope: {
          attack: 0.002,
          decay: Math.max(0.05, decay * 0.5),
          sustain: 0,
          release: 0.01,
        },
      });

      const filter = new Tone.Filter({
        frequency: Math.max(100, Math.min(20000, filterCutoff * 8000 + 100)),
        type: 'lowpass',
        Q: Math.max(0, Math.min(20, filterResonance * 15)),
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(1, drive)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));

      fm.chain(distortion, filter, panner, this.masterGain);

      const pitch = Tone.Frequency(basePitch).transpose(tune * 24);
      fm.triggerAttackRelease(pitch, '16n', time, Math.max(0, Math.min(1, velocity)));

      setTimeout(() => {
        fm.dispose();
        filter.dispose();
        distortion.dispose();
        panner.dispose();
      }, 1000);
    } catch (error) {
      console.error('FM error:', error);
    }
  }

  setMasterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }

  dispose() {
    this.synths.forEach(synth => synth.dispose());
    this.synths.clear();
    this.masterGain.dispose();
  }
}
