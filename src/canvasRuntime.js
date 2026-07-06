import { createState } from './state.js';
import { draw } from './rendering.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { applyCurrentGameClonePatches } from './clonePatches.js';

export function bootCanvasGame(note = '') {
  applyCurrentGameClonePatches();
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = createState();
  const ui = createUi(state, canvas);
  if (note) console.warn('Apartment God using clone-first visual parity mode:', note);

  let last = performance.now();
  function frame(now) {
    const rawDt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const dt = state.paused ? 0 : rawDt * state.speed;

    if (dt > 0) {
      for (const entity of state.entities) {
        const arrived = updateMovement(state, entity, dt);
        if (arrived) resolveArrival(state, entity);
      }
      updateActions(state, dt);
      updateAutoHooks(state, dt);
      updateAutonomy(state, dt);
      state.time += dt * 0.6;
    }

    draw(ctx, state);
    ui.renderHud();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return { state, ui };
}
