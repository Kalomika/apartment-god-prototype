import { archetypeList } from './archetypes.js';
import { installCameraAngleControls } from './cameraAngles.js';
import { COACH_COMMANDS, COACH_DROPS, ARENA_H, ARENA_W } from './config.js';
import { fighterRequest } from './requests.js';
import { beginBattle, createBattle, stageFor } from './state.js';
import { updateBattle, placeCoachDrop, suggestCommand, setCommanderEthos } from './systems.js';
import { createTopShot3D } from './three/topShot3D.js';

const canvas = document.getElementById('game');
const ui = {
  fighterA: document.getElementById('fighterA'),
  fighterB: document.getElementById('fighterB'),
  ethos: document.getElementById('commanderEthos'),
  start: document.getElementById('startMatch'),
  pause: document.getElementById('pauseMatch'),
  hud: document.getElementById('hud'),
  log: document.getElementById('log'),
  overlay: document.getElementById('overlay')
};

for (const fighter of archetypeList()) {
  ui.fighterA.append(new Option(fighter.name, fighter.id));
  ui.fighterB.append(new Option(fighter.name, fighter.id));
}

ui.fighterA.value = 'suit_operative';
ui.fighterB.value = 'survival_commando';
ui.ethos.value = 'ai';
ui.start.textContent = 'Begin Sortie';

const cameraHelp = 'Camera: 1 Top Down, 2 High, 3 Oblique, 4 Isometric, V cycles.';
let world3D = null;
let fallbackCtx = null;
ui.overlay.textContent = 'Desert industrial site loading.';
try {
  world3D = await createTopShot3D(canvas);
  installCameraAngleControls(world3D, ui.overlay);
  ui.overlay.textContent = `Desert industrial site loaded. ${cameraHelp}`;
} catch (error) {
  console.error('3D terrain failed to load, falling back to tactical map.', error);
  fallbackCtx = canvas.getContext('2d');
  ui.overlay.textContent = 'Desert industrial site loaded in fallback view.';
}

let state = createBattle(ui.fighterA.value, ui.fighterB.value);
let last = performance.now();
let lastTap = 0;
let overlayMode = 'system';

ui.start.addEventListener('click', () => {
  state = createBattle(ui.fighterA.value, ui.fighterB.value);
  beginBattle(state, ui.fighterA.value, ui.fighterB.value);
  setCommanderEthos(state, ui.ethos.value);
  overlayMode = 'system';
  ui.overlay.textContent = `Sortie started. ${cameraHelp}`;
  ui.start.textContent = 'Restart Sortie';
  ui.pause.textContent = 'Pause';
});

ui.ethos.addEventListener('change', () => setCommanderEthos(state, ui.ethos.value));
ui.pause.addEventListener('click', () => {
  state.paused = !state.paused;
  ui.pause.textContent = state.paused ? 'Resume' : 'Pause';
});

document.querySelectorAll('[data-drop]').forEach(button => {
  button.addEventListener('click', () => {
    if (state.matchState !== 'running') {
      overlayMode = 'manual';
      ui.overlay.textContent = 'Begin the sortie first. Drops unlock after landing.';
      return;
    }
    state.selectedDrop = button.dataset.drop;
    state.selectedCommand = null;
    overlayMode = 'manual';
    ui.overlay.textContent = `Click site to place ${COACH_DROPS[state.selectedDrop].label}`;
  });
});

document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => {
    if (state.matchState !== 'running') {
      overlayMode = 'manual';
      ui.overlay.textContent = 'Begin the sortie first. Commands unlock after landing.';
      return;
    }
    state.selectedCommand = button.dataset.command;
    state.selectedDrop = null;
    overlayMode = 'manual';
    ui.overlay.textContent = `Click site to suggest: ${COACH_COMMANDS[state.selectedCommand].label}`;
  });
});

window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() !== 'c' || !world3D) return;
  const visible = world3D.toggleCollisionDebug();
  overlayMode = 'manual';
  ui.overlay.textContent = visible ? 'Collision map visible.' : 'Collision map hidden.';
});

canvas.addEventListener('click', event => {
  if (state.matchState === 'finished') {
    overlayMode = 'manual';
    ui.overlay.textContent = `${state.result || 'Match finished.'} Press Restart Sortie for a rematch.`;
    return;
  }
  if (state.matchState === 'ready') {
    overlayMode = 'manual';
    ui.overlay.textContent = 'Site is quiet. Press Begin Sortie to bring fighters in.';
    return;
  }
  if (state.matchState === 'deploying') {
    overlayMode = 'manual';
    ui.overlay.textContent = 'Fighters are still entering the site.';
    return;
  }

  const point = arenaPoint(event);
  if (!point) return;
  const { x, y } = point;

  const now = performance.now();
  const urgent = now - lastTap < 290;
  lastTap = now;

  if (state.selectedDrop) {
    if (placeCoachDrop(state, state.selectedDrop, x, y)) {
      state.selectedDrop = null;
      overlayMode = 'manual';
      ui.overlay.textContent = '';
    }
    return;
  }

  const command = urgent ? 'move' : state.selectedCommand || 'move';
  if (suggestCommand(state, command, x, y, urgent)) {
    overlayMode = 'manual';
    ui.overlay.textContent = urgent ? 'Urgent run-there call sent.' : `${COACH_COMMANDS[command].label} suggestion sent.`;
    if (!urgent) state.selectedCommand = null;
  }
});

function arenaPoint(event) {
  if (world3D) return world3D.arenaPointFromPointer(event);
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * ARENA_W / rect.width,
    y: (event.clientY - rect.top) * ARENA_H / rect.height
  };
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateBattle(state, dt);
  if (world3D) world3D.update(dt, state);
  else drawFallbackTerrain(fallbackCtx, state);
  renderMatchOverlay();
  renderDomHud();
  requestAnimationFrame(frame);
}

function renderMatchOverlay() {
  if (state.matchState === 'ready') {
    overlayMode = 'system';
    ui.overlay.textContent = `Desert industrial site loaded. Choose fighters, then Begin Sortie. ${cameraHelp}`;
    ui.start.textContent = 'Begin Sortie';
    return;
  }
  if (state.matchState === 'deploying') {
    overlayMode = 'system';
    ui.overlay.textContent = 'Entry sequence in progress.';
    return;
  }
  if (state.matchState === 'running' && overlayMode === 'system') {
    ui.overlay.textContent = '';
    return;
  }
  if (state.matchState !== 'finished') return;
  ui.overlay.textContent = `${state.result || 'Match finished.'} Press Restart Sortie for a rematch.`;
  ui.start.textContent = 'Restart Sortie';
}

function renderDomHud() {
  const cards = state.fighters.map(f => {
    const stage = stageFor(f);
    const request = fighterRequest(state, f);
    const status = f.memory.command ? `Command: ${f.memory.command.type}` : `${f.intent} / ${f.pose}`;
    return `<article class="fighter-card"><h3><span>${escapeHtml(f.name)}</span><small>${escapeHtml(stage.label)}</small></h3>${requestHtml(request)}${bar('HP', f.hp)}${bar('Stamina', f.stamina)}${bar('Dodge', f.dodge)}${bar('Block', f.block)}<small>${escapeHtml(status)}</small></article>`;
  }).join('');
  const drops = Object.entries(state.dropsLeft).map(([id, left]) => `<small>${escapeHtml(COACH_DROPS[id].label)}: ${left}</small>`).join('<br>');
  ui.hud.innerHTML = `${cards}<article class="fighter-card"><h3>Commander</h3>${bar('Trust', state.trust)}<small>Ethos: ${escapeHtml(state.commanderEthos)}</small><br><small>${escapeHtml(state.result || state.matchState)}</small><br><small>Map: desert industrial test site</small><br><small>${cameraHelp}</small><br>${drops}</article><article class="fighter-card"><h3>Terrain</h3><small>Cover, shadows, pipes, tanks, raised catwalk, and separated collision volumes are live.</small></article>`;
  ui.log.innerHTML = state.log.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function requestHtml(request) {
  if (!request) return '';
  const color = escapeHtml(request.color || '#f0d36a');
  return `<div class="handler-request" style="--signal:${color};--accent:${color}">${portraitHtml(request)}<div class="request-copy"><strong>${escapeHtml(request.label)}</strong><span>${escapeHtml(request.detail)}</span></div></div>`;
}

function portraitHtml(request) {
  return `<div class="handler-portrait" aria-hidden="true"><div class="portrait-shoulders"></div><div class="portrait-neck"></div><div class="portrait-face"></div><div class="portrait-hair"></div><div class="portrait-eyes"></div><div class="portrait-hand portrait-left"></div><div class="portrait-hand portrait-right"></div><div class="portrait-signal">${escapeHtml(request.icon || '?')}</div></div>`;
}

function bar(label, value) {
  return `<div>${escapeHtml(label)}</div><div class="meter"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`;
}

function drawFallbackTerrain(ctx, fallbackState) {
  if (!ctx) return;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#a97843';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#6d533b';
  for (const box of fallbackState.arena.walls) {
    ctx.fillRect(box.x / ARENA_W * w, box.y / ARENA_H * h, box.w / ARENA_W * w, box.h / ARENA_H * h);
  }
  ctx.fillStyle = '#00000055';
  for (const shade of fallbackState.arena.shadows) {
    ctx.fillRect(shade.x / ARENA_W * w, shade.y / ARENA_H * h, shade.w / ARENA_W * w, shade.h / ARENA_H * h);
  }
  ctx.fillStyle = '#f0d36a';
  ctx.font = '900 24px system-ui';
  ctx.fillText('TOP SHOT', 24, 42);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

requestAnimationFrame(frame);
