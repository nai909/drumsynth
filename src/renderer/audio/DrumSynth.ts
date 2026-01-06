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
      // 808-style kick: deep sub bass with pitch sweep
      // decay controls length: low = tight punch, high = long 808 boom
      const kickDecay = Math.max(0.15, decay * 1.5);
      const pitchSweepTime = 0.04 + (snap * 0.03);

      // Main 808 body - pure sine sub bass
      const kick = new Tone.MembraneSynth({
        pitchDecay: pitchSweepTime,
        octaves: 4 + (tone * 2),
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: kickDecay,
          sustain: decay > 0.5 ? 0.1 : 0, // Long 808s have slight sustain
          release: Math.max(0.05, decay * 0.3),
        },
      });

      // Click/transient layer for attack
      const click = new Tone.MembraneSynth({
        pitchDecay: 0.02,
        octaves: 8,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.03 + (snap * 0.02),
          sustain: 0,
          release: 0.01,
        },
      });

      // Low pass filter to keep it subby
      const filter = new Tone.Filter({
        frequency: Math.max(60, Math.min(200, filterCutoff * 120 + 50)),
        type: 'lowpass',
        Q: Math.max(0.5, Math.min(4, 1 + filterResonance * 2)),
      });

      // Separate filter for click (allows more high end through)
      const clickFilter = new Tone.Filter({
        frequency: Math.max(500, Math.min(4000, filterCutoff * 2000 + 500)),
        type: 'lowpass',
        Q: 1,
      });

      // Warm saturation for that analog 808 character
      const distortion = new Tone.Distortion(Math.max(0.02, Math.min(0.5, 0.05 + drive * 0.4)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const merger = new Tone.Gain(0.9);

      kick.chain(filter, merger);
      click.chain(clickFilter, merger);
      merger.chain(distortion, panner, this.masterGain);

      // 808 kick pitch - around 45-60Hz base
      const basePitch = Tone.Frequency(48 + (tune * 20));
      const clickPitch = Tone.Frequency(150 + (tune * 30));

      kick.triggerAttackRelease(basePitch, kickDecay + 0.1, time, Math.max(0.4, Math.min(1, velocity)));
      click.triggerAttackRelease(clickPitch, 0.05, time, Math.max(0.2, Math.min(0.6, velocity * snap)));

      setTimeout(() => {
        kick.dispose();
        click.dispose();
        filter.dispose();
        clickFilter.dispose();
        distortion.dispose();
        panner.dispose();
        merger.dispose();
      }, Math.max(2000, kickDecay * 1000 + 500));
    } catch (error) {
      console.error('Kick error:', error);
    }
  }

  triggerSnare(time: number, velocity: number = 1, tune: number = 0, decay: number = 0.2, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      // 808-style snare: punchy body with tight noise
      const noiseDecay = Math.max(0.08, decay * 0.4);

      // Noise component - tight and snappy
      const noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.002,
          decay: noiseDecay,
          sustain: 0,
          release: 0.02,
        },
      });

      // 808 snare body - pitched membrane with fast pitch decay
      const body = new Tone.MembraneSynth({
        pitchDecay: 0.03 + (snap * 0.02),
        octaves: 2 + (tone * 2),
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: Math.max(0.06, decay * 0.25),
          sustain: 0,
          release: 0.02,
        },
      });

      // Bandpass filter for noise to get that 808 character
      const noiseFilter = new Tone.Filter({
        frequency: Math.max(2000, Math.min(8000, filterCutoff * 5000 + 2000)),
        type: 'bandpass',
        Q: Math.max(0.5, Math.min(3, 1 + filterResonance * 2)),
      });

      // Lowpass on body
      const bodyFilter = new Tone.Filter({
        frequency: Math.max(200, Math.min(4000, filterCutoff * 2000 + 500)),
        type: 'lowpass',
        Q: 1,
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(0.8, drive * 0.5)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const merger = new Tone.Gain(0.9);

      body.chain(bodyFilter, merger);
      noise.chain(noiseFilter, merger);
      merger.chain(distortion, panner, this.masterGain);

      // 808 snare pitch around 180-240Hz
      const pitch = Tone.Frequency(180 + (tune * 60));
      body.triggerAttackRelease(pitch, '32n', time, Math.max(0.3, Math.min(1, velocity)));
      noise.triggerAttackRelease(noiseDecay + 0.02, time, Math.max(0.2, Math.min(0.7, velocity * 0.6)));

      setTimeout(() => {
        noise.dispose();
        body.dispose();
        noiseFilter.dispose();
        bodyFilter.dispose();
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
      // Trap-style hi-hat: bright, crispy, tight
      const actualDecay = open ? Math.max(0.15, decay * 3) : Math.max(0.02, decay * 0.3);

      // Main noise component - bright white noise
      const noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.0005,
          decay: actualDecay,
          sustain: 0,
          release: 0.008,
        },
      });

      // High-pitched oscillators for metallic shimmer
      const osc1 = new Tone.Oscillator({
        frequency: 6000 * (1 + tune * 0.3),
        type: 'square',
      });

      const osc2 = new Tone.Oscillator({
        frequency: 7500 * (1 + tune * 0.3),
        type: 'square',
      });

      const osc3 = new Tone.Oscillator({
        frequency: 9000 * (1 + tune * 0.3),
        type: 'square',
      });

      const env = new Tone.AmplitudeEnvelope({
        attack: 0.0005,
        decay: actualDecay * 0.8,
        sustain: 0,
        release: 0.005,
      });

      // Highpass filter - very bright for trap sound
      const highpass = new Tone.Filter({
        frequency: Math.max(8000, Math.min(16000, filterCutoff * 6000 + 8000)),
        type: 'highpass',
        Q: Math.max(0.5, Math.min(3, 1 + filterResonance)),
      });

      // Slight bandpass for character
      const bandpass = new Tone.Filter({
        frequency: Math.max(10000, Math.min(18000, 12000 + (tone * 4000))),
        type: 'bandpass',
        Q: 0.8,
      });

      // Light saturation for that crispy trap sound
      const distortion = new Tone.Distortion(Math.max(0.05, Math.min(0.4, 0.1 + drive * 0.3)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const gain = new Tone.Gain(open ? 0.35 : 0.4);

      osc1.connect(env);
      osc2.connect(env);
      osc3.connect(env);
      noise.connect(gain);
      env.connect(gain);
      gain.chain(highpass, bandpass, distortion, panner, this.masterGain);

      osc1.start(time);
      osc2.start(time);
      osc3.start(time);
      env.triggerAttackRelease(actualDecay, time, Math.max(0.2, Math.min(1, velocity * 0.4)));
      noise.triggerAttackRelease(actualDecay, time, Math.max(0.3, Math.min(1, velocity)));

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        osc1.dispose();
        osc2.dispose();
        osc3.dispose();
        env.dispose();
        noise.dispose();
        highpass.dispose();
        bandpass.dispose();
        distortion.dispose();
        panner.dispose();
        gain.dispose();
      }, Math.max(300, actualDecay * 1000 + 100));
    } catch (error) {
      console.error('HiHat error:', error);
    }
  }

  triggerClap(time: number, velocity: number = 1, tune: number = 0, decay: number = 0.15, filterCutoff: number = 1, pan: number = 0, attack: number = 0.001, tone: number = 0.5, snap: number = 0.3, filterResonance: number = 0.2, drive: number = 0) {
    try {
      // 909-style clap: multiple layered noise bursts
      const burstCount = 4;
      const burstSpacing = 0.012; // ~12ms between each burst
      const tailDecay = Math.max(0.12, decay * 0.8);

      const disposables: any[] = [];

      // Bandpass filter for 909 character (centered around 1-2kHz)
      const filter = new Tone.Filter({
        frequency: Math.max(800, Math.min(3000, filterCutoff * 1500 + 1000 + (tune * 300))),
        type: 'bandpass',
        Q: Math.max(0.8, Math.min(4, 1.2 + filterResonance * 2)),
      });

      // Highpass to remove low end
      const highpass = new Tone.Filter({
        frequency: 400 + (tone * 200),
        type: 'highpass',
        Q: 0.5,
      });

      const distortion = new Tone.Distortion(Math.max(0, Math.min(0.6, drive * 0.4)));
      const panner = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
      const merger = new Tone.Gain(0.85);

      merger.chain(highpass, filter, distortion, panner, this.masterGain);
      disposables.push(filter, highpass, distortion, panner, merger);

      // Create multiple noise bursts for the classic 909 clap sound
      for (let i = 0; i < burstCount; i++) {
        const burst = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: {
            attack: 0.001,
            decay: 0.008 + (i * 0.002), // Each burst slightly longer
            sustain: 0,
            release: 0.005,
          },
        });
        burst.connect(merger);
        burst.triggerAttackRelease(0.01, time + (i * burstSpacing), Math.max(0.3, Math.min(1, velocity * (1 - i * 0.1))));
        disposables.push(burst);
      }

      // Reverb-like tail (final longer noise burst)
      const tail = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: tailDecay,
          sustain: 0,
          release: 0.05,
        },
      });
      tail.connect(merger);
      tail.triggerAttackRelease(tailDecay, time + (burstCount * burstSpacing), Math.max(0.15, Math.min(0.5, velocity * 0.4)));
      disposables.push(tail);

      setTimeout(() => {
        disposables.forEach(d => d.dispose());
      }, 1500);
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
