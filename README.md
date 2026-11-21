# best-spot-the-difference-game-20261121-0451-bot

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qq7605769-a11y/best-spot-the-difference-game-20261121-0451-bot/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qq7605769-a11y/best-spot-the-difference-game-20261121-0451-bot/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lantern Hunt: a spot-the-difference game with three hand-drawn SVG scenes (Lantern Market, Harbour Dawn, Greenhouse), 7 hidden differences per scene, a countdown clock, hints, streak bonuses and synthesized sound effects — all static files, playable offline in a desktop browser.

## Run it

```sh
node serve.ts
```

Then open http://127.0.0.1:8080 — or open `game/index.html` directly in a desktop browser.

## How it plays

- Two near-identical pictures side by side; click a difference on either one and it is circled on both.
- 7 differences per scene, 3 scenes, 2:30 per scene. A wrong click costs 3 seconds; a hint costs 10 seconds and there are only 3 per scene.
- Finds in a row build a streak bonus; clearing a scene earns a time bonus and stars.
- Keyboard: `H` hint, `M` mute, `R` restart scene, `N` next scene, `Enter` start.

## Screenshots

`?shot=cover`, `?shot=play`, `?shot=scene3` and `?shot=win` stage the game into fixed mid-play states for screenshots.

---

<sub>Entered on [make.fun](https://make.fun/?ref=pbg0v3f8&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
