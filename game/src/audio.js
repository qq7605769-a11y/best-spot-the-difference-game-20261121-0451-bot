// Tiny sound effects, synthesized with the Web Audio API: no audio files,
// no network, nothing to load. A pleasant two-note chime on a find, a soft
// buzz on a miss, a rising arpeggio on a win, a tick on a button press.

let ctx = null;
let muted = false;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, vol) {
  const ac = audio();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + at);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFound() {
  tone(660, 0, 0.18, 'sine', 0.22);
  tone(880, 0.09, 0.28, 'sine', 0.22);
}

export function playMiss() {
  tone(160, 0, 0.16, 'sawtooth', 0.08);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.15);
  tone(780, 0.08, 0.16, 'triangle', 0.15);
}

export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.22));
}

export function playClick() {
  tone(440, 0, 0.06, 'triangle', 0.1);
}

export function playLose() {
  tone(392, 0, 0.25, 'sine', 0.15);
  tone(311, 0.2, 0.4, 'sine', 0.15);
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}
