// Web Audio API chime synthesis for notification alerts (No external MP3 files needed)

class NotificationSoundService {
  private audioCtx: AudioContext | null = null;
  private isSoundEnabled: boolean = true;

  constructor() {
    try {
      const saved = localStorage.getItem('astrology_sound_alert_enabled');
      this.isSoundEnabled = saved !== null ? saved === 'true' : true;
    } catch {
      this.isSoundEnabled = true;
    }
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isSoundEnabled = enabled;
    try {
      localStorage.setItem('astrology_sound_alert_enabled', String(enabled));
    } catch (e) {
      console.error('Error saving sound setting', e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx && AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('AudioContext not supported or blocked', e);
      return null;
    }
  }

  // Play a pleasant double brass gong chime (ရွှေကြေးစည်သံ / မင်္ဂလာ ခေါင်းလောင်းသံ)
  public playChime(): void {
    if (!this.isSoundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: 528 Hz (Love / Healing frequency chime)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.8);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Note 2: 792 Hz harmonic overtone chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(792, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(784, now + 1.5);

      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.6);
    } catch (e) {
      console.warn('Could not play notification chime', e);
    }
  }

  // Play a urgent tri-tone chime for exact appointment time
  public playUrgentAlert(): void {
    if (!this.isSoundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.3, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.9);
      });
    } catch (e) {
      console.warn('Could not play urgent alert sound', e);
    }
  }
}

export const soundService = new NotificationSoundService();
