import type { GameSettings, WeatherPreset } from '../types/game';

/**
 * 100% Procedural Web Audio API Sound Engine for Lakeland Rush.
 * Handles mobile browser audio unlock, surface-dependent footsteps,
 * combo-scaled pickups, rail grind texture, collision thuds,
 * weather/lake ambience, and dynamic British folk-synth pulse music.
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;

  private windSource: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private lakeGain: GainNode | null = null;
  private lakeSource: AudioBufferSourceNode | null = null;
  private shoreFactor=0;
  private lastAmbienceUpdate=-1;
  private grindGain: GainNode | null = null;
  private grindOsc: OscillatorNode | null = null;

  private musicTimer: number | null = null;
  private musicStep = 0;
  private isPlaying = false;
  private currentSpeed = 10;
  private currentWeather: WeatherPreset = 'clear';
  private unlocked = false;

  private settings: Pick<
    GameSettings,
    'masterVolume' | 'musicVolume' | 'sfxVolume' | 'ambienceVolume' | 'muted'
  > = {
    masterVolume: 0.75,
    musicVolume: 0.55,
    sfxVolume: 0.8,
    ambienceVolume: 0.6,
    muted: false,
  };

  public unlock(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.ambienceGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.ambienceGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyVolumes();
      this.initAmbience();
      this.initGrindLoop();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.unlocked = true;
  }

  public updateSettings(
    next: Pick<
      GameSettings,
      'masterVolume' | 'musicVolume' | 'sfxVolume' | 'ambienceVolume' | 'muted'
    >,
  ): void {
    this.settings = { ...next };
    this.applyVolumes();
  }

  public setWeather(weather: WeatherPreset): void {
    this.currentWeather = weather;
    if (!this.windFilter || !this.ctx) return;
    const freq =
      weather === 'rain' ? 1400 : weather === 'mist' ? 520 : weather === 'night' ? 420 : 750;
    this.windFilter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.4);
  }

  public setGameplayState(active: boolean, speedMps: number, isGrinding: boolean): void {
    this.isPlaying = active;
    this.currentSpeed = speedMps;

    if (this.grindGain && this.ctx) {
      const target = active && isGrinding ? 0.14 : 0;
      this.grindGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.04);
      if (this.grindOsc) {
        this.grindOsc.frequency.setTargetAtTime(
          160 + speedMps * 7,
          this.ctx.currentTime,
          0.06,
        );
      }
    }

    this.updateAmbience(active,speedMps);

    if (active && this.unlocked && this.musicTimer === null) {
      this.startMusicLoop();
    } else if (!active && this.musicTimer !== null) {
      this.stopMusicLoop();
    }
  }

  private applyVolumes(): void {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain || !this.ambienceGain) {
      return;
    }
    const now = this.ctx.currentTime;
    const m = this.settings.muted ? 0 : this.settings.masterVolume;
    this.masterGain.gain.setTargetAtTime(m, now, 0.03);
    this.musicGain.gain.setTargetAtTime(this.settings.musicVolume * 0.45, now, 0.03);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume * 0.7, now, 0.03);
    this.ambienceGain.gain.setTargetAtTime(this.settings.ambienceVolume * 0.09, now, 0.03);
  }

  private createNoiseBuffer(durationSec: number): AudioBuffer | null {
    if (!this.ctx) return null;
    const len = Math.floor(this.ctx.sampleRate * durationSec);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = last * 2.8 + white * 0.25;
    }
    return buf;
  }

  public setShoreFactor(value:number):void {this.shoreFactor=Math.max(0,Math.min(1,value));}
  private updateAmbience(active:boolean,speed:number):void{
    if(!this.ctx||!this.windGain||!this.lakeGain)return;
    const now=this.ctx.currentTime;
    if(!active){this.windGain.gain.setTargetAtTime(0,now,.15);this.lakeGain.gain.setTargetAtTime(0,now,.15);return;}
    if(now-this.lastAmbienceUpdate<.2)return;
    this.lastAmbienceUpdate=now;
    const gust=Math.pow(Math.max(0,Math.sin(now*.61)+.22*Math.sin(now*1.31)),2),rain=this.currentWeather==='rain';
    this.windGain.gain.setTargetAtTime((rain?.16:.055)+gust*(rain?.12:.065)+Math.min(.055,speed*.004),now,.3);
    this.lakeGain.gain.setTargetAtTime(this.shoreFactor*(.035+.13*Math.pow(.5+.5*Math.sin(now*1.35),3)),now,.22);
    this.windFilter?.frequency.setTargetAtTime(rain?490:250+gust*85,now,.4);
  }
  private initAmbience(): void {
    if (!this.ctx || !this.ambienceGain) return;
    const buf = this.createNoiseBuffer(12.0);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type='lowpass';filter.frequency.value=280;filter.Q.value=.45;
    const gain=this.ctx.createGain();gain.gain.value=0;
    src.connect(filter);filter.connect(gain);gain.connect(this.ambienceGain);this.windGain=gain;
    const lake=this.ctx.createBufferSource();lake.buffer=buf;lake.loop=true;
    const waterFilter=this.ctx.createBiquadFilter();waterFilter.type='lowpass';waterFilter.frequency.value=410;waterFilter.Q.value=.4;
    const waterGain=this.ctx.createGain();waterGain.gain.value=0;
    lake.connect(waterFilter);waterFilter.connect(waterGain);waterGain.connect(this.ambienceGain);lake.start(0,4);this.lakeGain=waterGain;this.lakeSource=lake;
    src.start();
    this.windSource = src;
    this.windFilter = filter;
  }

  private initGrindLoop(): void {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 210;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 950;
    filter.Q.value = 3.2;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    this.grindOsc = osc;
    this.grindGain = gain;
  }

  private startMusicLoop(): void {
    if (this.musicTimer !== null) return;
    // Dorian D pentatonic / Lakeland driving pulse (132 BPM -> ~113ms 16th steps)
    const bassNotes = [73.42, 73.42, 87.31, 98.0, 110.0, 98.0, 87.31, 65.41]; // D2 F2 G2 A2 C2
    const leadScale = [293.66, 329.63, 349.23, 392.0, 440.0, 523.25, 587.33];

    const stepTick = () => {
      if (!this.isPlaying || !this.ctx || !this.musicGain || this.ctx.state !== 'running') {
        return;
      }
      const now = this.ctx.currentTime;
      const step = this.musicStep % 16;

      // Kick on 0, 4, 8, 12
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(118, now);
        kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.11);
        kickGain.gain.setValueAtTime(0.32, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.15);
      }

      // Driving off-beat synth bass
      if (step % 2 === 0) {
        const bFreq = bassNotes[Math.floor(this.musicStep / 2) % bassNotes.length];
        const osc = this.ctx.createOscillator();
        const flt = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bFreq, now);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(360 + this.currentSpeed * 14, now);
        g.gain.setValueAtTime(0.18, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(flt);
        flt.connect(g);
        g.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.17);
      }

      // Airy arpeggio chime at higher speeds
      if (this.currentSpeed > 13 && (step % 4 === 2 || step === 7 || step === 15)) {
        const idx = (this.musicStep * 3 + step) % leadScale.length;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(leadScale[idx], now);
        g.gain.setValueAtTime(0.075, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(g);
        g.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.23);
      }

      this.musicStep++;
    };

    this.musicTimer = window.setInterval(stepTick, 115);
  }

  private stopMusicLoop(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public playFootstep(surface: 'road' | 'grass' | 'wood' | 'water'): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const jitter = 0.92 + Math.random() * 0.16;

    if (surface === 'wood') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.06);
      g.gain.setValueAtTime(0.16, now);
    } else if (surface === 'grass') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.05);
      g.gain.setValueAtTime(0.1, now);
    } else if (surface === 'water') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);
      g.gain.setValueAtTime(0.18, now);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(185 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);
      g.gain.setValueAtTime(0.13, now);
    }

    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playJump(): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
    g.gain.setValueAtTime(0.22, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playSlide(): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.2);
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playPickup(combo: number): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const pitchBoost = Math.pow(1.06, Math.min(10, combo - 1));
    const freqs = [523.25 * pitchBoost, 659.25 * pitchBoost, 783.99 * pitchBoost];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.035;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.19);
    });
  }

  public playVault(): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playCollision(water = false): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = water ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(water ? 240 : 130, now);
    osc.frequency.exponentialRampToValueAtTime(water ? 75 : 38, now + 0.28);
    g.gain.setValueAtTime(0.35, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  public playUiClick(): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  public playFinishFanfare(victory: boolean): void {
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const notes = victory ? [523.25, 659.25, 783.99, 1046.5] : [349.23, 311.13, 261.63];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + i * 0.09;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.24, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.44);
    });
  }

  public dispose(): void {
    this.stopMusicLoop();
    try {
      this.windSource?.stop();
      this.lakeSource?.stop();
      this.grindOsc?.stop();
      void this.ctx?.close();
    } catch {
      // ignore cleanup errors
    }
  }
}
