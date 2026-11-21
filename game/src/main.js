// Lantern Hunt — game logic. One state machine drives three scenes: the
// player hunts 7 differences per scene, against a clock, with 3 hints.
// Clicking a difference marks it on BOTH panels at once; a wrong click costs
// 3 seconds. Found differences, score, streak and hints all live here.

import { SCENES } from './scenes.js';
import { playFound, playMiss, playHint, playWin, playClick, playLose, setMuted, isMuted } from './audio.js';
import { stageShot, applyShot } from './shots.js';

const VIEW_W = 640;
const VIEW_H = 480;
const TIME_PER_SCENE = 150;
const MISS_COST = 3;
const HINT_COST = 10;

const $ = (id) => document.getElementById(id);

const state = {
  screen: 'title', // title | play | sceneDone | final | timeUp
  sceneIndex: 0,
  found: new Set(),
  score: 0,
  streak: 0,
  bestStreak: 0,
  hintsLeft: 3,
  timeLeft: TIME_PER_SCENE,
  timerId: null,
  frozen: false, // screenshots: the clock never moves
  totalFound: 0,
  scenesCleared: 0,
};

function scene() {
  return SCENES[state.sceneIndex];
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function renderPanels() {
  const sc = scene();
  $('svg-a').innerHTML = sc.build('a');
  $('svg-b').innerHTML = sc.build('b');
  document.querySelectorAll('.mark-layer').forEach((layer) => { layer.innerHTML = ''; });
  state.found.forEach((i) => drawMarker(i));
  $('scene-name').textContent = `${sc.name} · ${sc.tag}`;
  updateHud();
}

function drawMarker(i) {
  const d = scene().diffs[i];
  ['marks-a', 'marks-b'].forEach((layerId) => {
    const layer = $(layerId);
    const ring = document.createElement('div');
    ring.className = 'marker';
    ring.style.left = `${(d.x / VIEW_W) * 100}%`;
    ring.style.top = `${(d.y / VIEW_H) * 100}%`;
    ring.style.width = `${(d.r * 2 / VIEW_W) * 100}%`;
    ring.style.height = `${(d.r * 2 / VIEW_H) * 100}%`;
    ring.innerHTML = '<span class="tick">✓</span>';
    layer.appendChild(ring);
  });
}

function drawMiss(x, y, panel) {
  const layer = $(panel === 'a' ? 'marks-a' : 'marks-b');
  const mark = document.createElement('div');
  mark.className = 'missmark';
  mark.textContent = '✕';
  mark.style.left = `${(x / VIEW_W) * 100}%`;
  mark.style.top = `${(y / VIEW_H) * 100}%`;
  layer.appendChild(mark);
  setTimeout(() => mark.remove(), 700);
}

function updateHud() {
  const sc = scene();
  const left = sc.diffs.length - state.found.size;
  $('found-count').textContent = `${state.found.size} / ${sc.diffs.length}`;
  $('left-count').textContent = `${left} to go`;
  $('score').textContent = state.score;
  $('streak').textContent = `🔥 ${state.streak}`;
  $('timer').textContent = fmtTime(state.timeLeft);
  $('timer').classList.toggle('low', state.timeLeft <= 20);
  $('hint-btn').textContent = `💡 Hint (${state.hintsLeft})`;
  $('hint-btn').disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  $('mute-btn').textContent = isMuted() ? '🔇 Sound off' : '🔊 Sound on';
  document.querySelectorAll('.scene-dot').forEach((dot, i) => {
    dot.classList.toggle('done', i < state.scenesCleared);
    dot.classList.toggle('current', i === state.sceneIndex && state.screen === 'play');
  });
}

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1800);
}

function pointFromEvent(ev, panel) {
  const svg = panel.querySelector('svg');
  const rect = svg.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * VIEW_W,
    y: ((ev.clientY - rect.top) / rect.height) * VIEW_H,
  };
}

function onPanelClick(ev, which) {
  if (state.screen !== 'play') return;
  const panel = $(which === 'a' ? 'panel-a' : 'panel-b');
  const p = pointFromEvent(ev, panel);
  const sc = scene();
  for (let i = 0; i < sc.diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const d = sc.diffs[i];
    const dist = Math.hypot(p.x - d.x, p.y - d.y);
    if (dist <= d.r + 8) {
      state.found.add(i);
      state.totalFound += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const bonus = 100 + Math.min(state.streak - 1, 5) * 20 + Math.round(state.timeLeft / 10);
      state.score += bonus;
      drawMarker(i);
      playFound();
      toast(`Found: ${d.name}! +${bonus}`);
      updateHud();
      if (state.found.size === sc.diffs.length) sceneComplete();
      return;
    }
  }
  state.streak = 0;
  state.timeLeft = Math.max(0, state.timeLeft - MISS_COST);
  drawMiss(p.x, p.y, which);
  playMiss();
  toast(`Not there — ${MISS_COST}s penalty`);
  updateHud();
  if (state.timeLeft <= 0) timeUp();
}

function useHint() {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const sc = scene();
  const remaining = sc.diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_COST);
  playHint();
  ['marks-a', 'marks-b'].forEach((layerId) => {
    const layer = $(layerId);
    const d = sc.diffs[pick];
    const pulse = document.createElement('div');
    pulse.className = 'hint-pulse';
    pulse.style.left = `${(d.x / VIEW_W) * 100}%`;
    pulse.style.top = `${(d.y / VIEW_H) * 100}%`;
    pulse.style.width = `${(d.r * 2 / VIEW_W) * 100}%`;
    pulse.style.height = `${(d.r * 2 / VIEW_H) * 100}%`;
    layer.appendChild(pulse);
    setTimeout(() => pulse.remove(), 1600);
  });
  toast(`Hint: look near "${sc.diffs[pick].name}"… −${HINT_COST}s`);
  updateHud();
  if (state.timeLeft <= 0) timeUp();
}

function startTimer() {
  stopTimer();
  state.timerId = setInterval(() => {
    if (state.frozen || state.screen !== 'play') return;
    state.timeLeft -= 1;
    updateHud();
    if (state.timeLeft <= 0) timeUp();
  }, 1000);
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

function showOnly(id) {
  // The board (panels + HUD) is always visible underneath; the named overlay
  // card sits on top of it. 'play-screen' means no overlay at all.
  ['title-screen', 'scene-done-screen', 'final-screen', 'timeup-screen'].forEach((s) => {
    $(s).classList.toggle('hidden', s !== id);
  });
}

function startScene(index) {
  state.sceneIndex = index;
  state.found = new Set();
  state.streak = 0;
  state.hintsLeft = 3;
  state.timeLeft = TIME_PER_SCENE;
  state.screen = 'play';
  showOnly('play-screen');
  renderPanels();
  startTimer();
}

function sceneComplete() {
  stopTimer();
  state.scenesCleared = Math.max(state.scenesCleared, state.sceneIndex + 1);
  const timeBonus = Math.round(state.timeLeft) * 5;
  state.score += timeBonus;
  playWin();
  state.screen = 'sceneDone';
  const stars = state.hintsLeft === 3 ? 3 : state.hintsLeft === 2 ? 3 : state.hintsLeft === 1 ? 2 : 1;
  $('done-title').textContent = `${scene().name} cleared!`;
  $('done-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  $('done-detail').textContent = `All 7 differences found · time bonus +${timeBonus} · hints left ${state.hintsLeft}`;
  $('next-btn').textContent = state.sceneIndex + 1 < SCENES.length ? 'Next scene →' : 'See results →';
  showOnly('scene-done-screen');
  updateHud();
}

function timeUp() {
  stopTimer();
  playLose();
  state.screen = 'timeUp';
  $('timeup-detail').textContent = `You found ${state.found.size} of ${scene().diffs.length} in ${scene().name}.`;
  showOnly('timeup-screen');
}

function showFinal() {
  stopTimer();
  state.screen = 'final';
  const maxTotal = SCENES.length * 7;
  $('final-score').textContent = state.score;
  $('final-detail').textContent = `${state.totalFound} / ${maxTotal} differences found · best streak ${state.bestStreak} · ${state.scenesCleared} / ${SCENES.length} scenes cleared`;
  $('final-stars').textContent = '★'.repeat(state.scenesCleared) + '☆'.repeat(SCENES.length - state.scenesCleared);
  showOnly('final-screen');
}

function showTitle() {
  stopTimer();
  state.screen = 'title';
  state.sceneIndex = 0;
  state.score = 0;
  state.totalFound = 0;
  state.scenesCleared = 0;
  state.bestStreak = 0;
  $('title-total').textContent = `${SCENES.length} scenes · ${SCENES.length * 7} differences · 3 hints per scene`;
  showOnly('title-screen');
}

function wire() {
  $('panel-a').addEventListener('click', (ev) => onPanelClick(ev, 'a'));
  $('panel-b').addEventListener('click', (ev) => onPanelClick(ev, 'b'));
  $('hint-btn').addEventListener('click', () => { playClick(); useHint(); });
  $('mute-btn').addEventListener('click', () => { setMuted(!isMuted()); updateHud(); });
  $('start-btn').addEventListener('click', () => { playClick(); startScene(0); });
  $('next-btn').addEventListener('click', () => {
    playClick();
    if (state.sceneIndex + 1 < SCENES.length) startScene(state.sceneIndex + 1);
    else showFinal();
  });
  $('retry-btn').addEventListener('click', () => { playClick(); startScene(state.sceneIndex); });
  $('timeup-menu-btn').addEventListener('click', () => { playClick(); showTitle(); });
  $('again-btn').addEventListener('click', () => { playClick(); showTitle(); });
  document.querySelectorAll('.scene-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      if (state.screen !== 'play') return;
      playClick();
      startScene(Number(dot.dataset.scene));
    });
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'h' || ev.key === 'H') useHint();
    if (ev.key === 'm' || ev.key === 'M') { setMuted(!isMuted()); updateHud(); }
    if ((ev.key === 'n' || ev.key === 'N') && state.screen === 'sceneDone') $('next-btn').click();
    if ((ev.key === 'r' || ev.key === 'R') && (state.screen === 'play' || state.screen === 'timeUp')) startScene(state.sceneIndex);
    if (ev.key === 'Enter' && state.screen === 'title') startScene(0);
  });
}

wire();
showTitle();
renderPanels();
// Screenshot hook: a test driver can stage a fixed frame with
// window.__applyShot('cover' | 'play' | 'scene3' | 'win').
window.__applyShot = (name) => applyShot(name, state, { showOnly, renderPanels, updateHud });
stageShot(state, { showOnly, renderPanels, updateHud });
