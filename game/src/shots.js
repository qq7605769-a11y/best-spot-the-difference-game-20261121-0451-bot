// Screenshot scenes behind ?shot=cover|play|scene3|win. Each one sets the
// game to a fixed, real mid-play state — the same state a player reaches —
// and freezes the clock, so the frame is identical every time it is taken.
// No autopilot, no randomness: the found sets and timers are written out.

const SHOTS = {
  // Cover: Lantern Market, 3 found with rings on both panels, 4 still to go.
  cover: { scene: 0, found: [0, 2, 4], timeLeft: 107 },
  // Second shot: Harbour Dawn, 2 found, 5 to go.
  play: { scene: 1, found: [1, 4], timeLeft: 125 },
  // Third shot: Greenhouse, 4 found, 3 to go, clock nearly half gone.
  scene3: { scene: 2, found: [0, 2, 4, 6], timeLeft: 72 },
  // Fourth shot: Lantern Market finished — the win card over a full board.
  win: { scene: 0, found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 98 },
};

/**
 * Apply the named preset. `api` carries the main module's screen helpers
 * so this file never imports main.js.
 */
export function applyShot(name, state, api) {
  const preset = SHOTS[name];
  if (!preset) return false;
  state.sceneIndex = preset.scene;
  state.found = new Set(preset.found);
  state.timeLeft = preset.timeLeft;
  state.hintsLeft = name === 'win' ? 2 : 3;
  state.streak = preset.found.length;
  state.score = preset.found.length * 120;
  state.frozen = true;
  state.screen = 'play';
  api.showOnly('play-screen');
  api.renderPanels();
  if (name === 'win') {
    state.scenesCleared = 1;
    state.screen = 'sceneDone';
    document.getElementById('done-title').textContent = 'Lantern Market cleared!';
    document.getElementById('done-stars').textContent = '★★★';
    document.getElementById('done-detail').textContent = 'All 7 differences found · time bonus +490 · hints left 2';
    document.getElementById('next-btn').textContent = 'Next scene →';
    api.showOnly('scene-done-screen');
  }
  api.updateHud();
  return true;
}

/** Apply the ?shot= preset named in the URL, if any. */
export function stageShot(state, api) {
  const params = new URLSearchParams(window.location.search);
  return applyShot(params.get('shot'), state, api);
}
