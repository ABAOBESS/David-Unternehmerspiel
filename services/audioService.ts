class AudioService {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  ensureAudio(volume: number = 0.6) {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = volume;
      this.masterGain.connect(this.audioCtx.destination);
    } else if (this.masterGain) {
        this.masterGain.gain.value = volume;
    }
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  playSiren(mode: 'twotone' | 'whoop' | 'beacon' | 'off', volume: number) {
    if (mode === 'off') return;
    this.ensureAudio(volume);
    
    if (mode === 'twotone') this.twoTone();
    else if (mode === 'whoop') this.whoop();
    else if (mode === 'beacon') this.beacon();
  }

  private twoTone() {
    if (!this.audioCtx || !this.masterGain) return;
    const part = 0.3;
    for (let i = 0; i < 6; i++) {
      const f = (i % 2 === 0) ? 700 : 1000;
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(this.masterGain);
      
      const t = this.audioCtx.currentTime + i * part;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.9, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + part - 0.02);
      
      osc.start(t);
      osc.stop(t + part);
    }
  }

  private whoop() {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.masterGain);
    
    g.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.9, this.audioCtx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.6);
    
    osc.frequency.exponentialRampToValueAtTime(1400, this.audioCtx.currentTime + 0.9);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.7);
  }

  private beacon() {
    if (!this.audioCtx || !this.masterGain) return;
    for (let i = 0; i < 3; i++) {
      const t = this.audioCtx.currentTime + i * 0.6;
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 900;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(this.masterGain);
      
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(1, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.45);
    }
  }

  playSquidCue(volume: number) {
    this.ensureAudio(volume);
    if (!this.audioCtx || !this.masterGain) return;
    
    const t0 = this.audioCtx.currentTime;
    const seq = [
      {f:440, dur:0.28}, // A4
      {f:349.23, dur:0.24}, // F4
      {f:293.66, dur:0.40}, // D4 (held)
    ];
    
    let t = t0;
    seq.forEach((n) => {
      const osc = this.audioCtx!.createOscillator();
      const g = this.audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = n.f;
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(this.masterGain!);
      
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.9, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + n.dur - 0.04);
      
      osc.start(t);
      osc.stop(t + n.dur);
      t += n.dur + 0.06;
    });
  }
}

export const audioService = new AudioService();
