import { floors } from './world.js';
import { log } from './state.js';

const MAIN_LEVEL_AREAS = new Set([0, 3, 4]);
const AREA_POSITIONS = {
  3: { x: -1, y: 0, label: 'Garage' },
  0: { x: 0, y: 0, label: 'Main House' },
  4: { x: 0, y: -1, label: 'Backyard' }
};

let built = false;
let openPanel = '';
let els = {};

export function navigateView(state, targetFloor, label = floors[targetFloor]?.name || 'Area', reason = 'manual') {
  if (targetFloor == null || !floors[targetFloor]) return false;
  const from = state.floor;
  if (from === targetFloor) {
    state.viewHoldT = state.buildPick ? 30 : 14;
    log(state, `Viewing ${label}.`);
    return true;
  }
  state.cameraTransition = createTransition(from, targetFloor, label, reason);
  state.floor = targetFloor;
  state.viewHoldT = state.buildPick ? 30 : 14;
  log(state, `Camera moved to ${label}.`);
  return true;
}

export function jumpToEntity(state, entityId) {
  const entity = state.entities.find(e => e.id === entityId);
  if (!entity || entity.hidden) return false;
  navigateView(state, entity.floor, `${entity.name}'s area`, 'locator');
  state.viewFocus = { entityId: entity.id, t: 2.6 };
  log(state, `Found ${entity.name}. Selection unchanged.`);
  return true;
}

export function updateCameraTransition(state, dt) {
  if (state.cameraTransition) {
    state.cameraTransition.t = Math.max(0, state.cameraTransition.t - dt);
    if (state.cameraTransition.t <= 0) state.cameraTransition = null;
  }
  if (state.viewFocus) {
    state.viewFocus.t = Math.max(0, state.viewFocus.t - dt);
    if (state.viewFocus.t <= 0) state.viewFocus = null;
  }
}

export function syncCameraNavigationUi(state) {
  if (!built) buildCameraNavigationUi();
  updateButtons(state);
  if (openPanel === 'blueprint') renderBlueprintPanel(state);
  if (openPanel === 'locator') renderLocatorPanel(state);
}

function createTransition(from, to, label, reason) {
  const sameMainLevel = MAIN_LEVEL_AREAS.has(from) && MAIN_LEVEL_AREAS.has(to);
  const total = sameMainLevel ? 0.42 : 0.48;
  return {
    from,
    to,
    label,
    reason,
    type: sameMainLevel ? 'slide' : 'vertical',
    direction: sameMainLevel ? slideDirection(from, to) : verticalDirection(from, to),
    t: total,
    total
  };
}

function slideDirection(from, to) {
  const a = AREA_POSITIONS[from] || AREA_POSITIONS[0];
  const b = AREA_POSITIONS[to] || AREA_POSITIONS[0];
  return { x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) };
}

function verticalDirection(from, to) {
  if (from === 2 && to === 0) return 'up';
  if (from === 0 && to === 1) return 'up';
  if (from === 1 && to === 0) return 'down';
  if (from === 0 && to === 2) return 'down';
  return to > from ? 'up' : 'down';
}

function buildCameraNavigationUi() {
  built = true;
  const wrap = document.getElementById('game-wrap');
  const dock = document.createElement('section');
  dock.id = 'camera-nav-dock';

  const blueprint = document.createElement('button');
  blueprint.id = 'blueprint-float-button';
  blueprint.className = 'camera-float-button';
  blueprint.type = 'button';
  blueprint.textContent = '▦';
  blueprint.title = 'Blueprint view';
  blueprint.setAttribute('aria-label', 'Open blueprint navigation');
  blueprint.onclick = event => { event.stopPropagation(); togglePanel('blueprint'); };

  const locator = document.createElement('button');
  locator.id = 'locator-float-button';
  locator.className = 'camera-float-button';
  locator.type = 'button';
  locator.textContent = '◎';
  locator.title = 'Find household member';
  locator.setAttribute('aria-label', 'Find household member');
  locator.onclick = event => { event.stopPropagation(); togglePanel('locator'); };

  const panel = document.createElement('div');
  panel.id = 'camera-nav-panel';
  panel.className = 'camera-nav-panel hidden';
  panel.onclick = event => event.stopPropagation();
  panel.onpointerdown = event => event.stopPropagation();

  dock.appendChild(blueprint);
  dock.appendChild(locator);
  wrap.appendChild(dock);
  wrap.appendChild(panel);
  els = { dock, blueprint, locator, panel };
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !dock.contains(event.target)) closePanel();
  });
}

function togglePanel(name) {
  openPanel = openPanel === name ? '' : name;
  if (!openPanel) closePanel();
}

function closePanel() {
  openPanel = '';
  if (els.panel) els.panel.classList.add('hidden');
}

function updateButtons(state) {
  if (!els.blueprint || !els.locator) return;
  const hasBlueprint = MAIN_LEVEL_AREAS.has(state.floor);
  els.blueprint.classList.toggle('disabled', !hasBlueprint);
  els.blueprint.title = hasBlueprint ? 'Blueprint view' : 'No attached same level areas here yet';
  els.locator.classList.toggle('disabled', !state.entities.some(e => !e.hidden));
}

function renderBlueprintPanel(state) {
  const panel = els.panel;
  if (!panel) return;
  panel.classList.remove('hidden');
  const hasBlueprint = MAIN_LEVEL_AREAS.has(state.floor);
  if (!hasBlueprint) {
    panel.innerHTML = `<div class="blueprint-card"><div class="blueprint-title">Blueprint unavailable</div><p class="blueprint-note">This level has no attached same level areas yet. Use Up or Down for vertical floors.</p></div>`;
    return;
  }
  const current = state.floor;
  panel.innerHTML = `<div class="blueprint-card"><div class="blueprint-title">Main Level Blueprint</div><div class="blueprint-grid">
    ${blueprintCell(state, 4, 'yard', 'Backyard')}
    <div class="blueprint-cell blueprint-void"></div>
    ${blueprintCell(state, 3, 'garage', 'Garage')}
    ${blueprintCell(state, 0, 'main', 'Main House')}
  </div><p class="blueprint-note">Tap an area to move the camera view. Characters do not move unless you command them.</p></div>`;
  panel.querySelectorAll('[data-floor]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      const target = Number(button.dataset.floor);
      navigateView(state, target, button.dataset.label, 'blueprint');
      closePanel();
    };
  });
  const active = panel.querySelector(`[data-floor="${current}"]`);
  if (active) active.classList.add('active');
}

function blueprintCell(state, floor, className, label) {
  const active = state.floor === floor ? ' active' : '';
  return `<button class="blueprint-cell ${className}${active}" data-floor="${floor}" data-label="${label}"><span>${label}</span><small>${AREA_POSITIONS[floor]?.label || floors[floor]?.name || ''}</small></button>`;
}

function renderLocatorPanel(state) {
  const panel = els.panel;
  if (!panel) return;
  panel.classList.remove('hidden');
  const visible = state.entities.filter(e => !e.hidden);
  const buttons = visible.map(entity => `<button class="locator-row" data-entity="${entity.id}"><span class="locator-head">${headIcon(entity)}</span><span><strong>${entity.name}</strong><small>${floors[entity.floor]?.name || 'area'} • ${entity.action || 'Idle'}</small></span></button>`).join('');
  panel.innerHTML = `<div class="blueprint-card"><div class="blueprint-title">Find Household</div><div class="locator-list">${buttons || '<p class="blueprint-note">No visible household members.</p>'}</div><p class="blueprint-note">This moves the camera only. It does not change who is selected.</p></div>`;
  panel.querySelectorAll('[data-entity]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      jumpToEntity(state, button.dataset.entity);
      closePanel();
    };
  });
}

function headIcon(entity) {
  if (entity.type === 'dog') return '🐕';
  const name = String(entity.name || '').toLowerCase();
  if (name.includes('girl') || name.includes('woman') || name.includes('wife') || name.includes('girlfriend')) return '👩';
  return '👤';
}

export function drawCameraTransition(ctx, state, playW, playH) {
  const tr = state.cameraTransition;
  if (!tr) return;
  const progress = 1 - Math.max(0, Math.min(1, tr.t / tr.total));
  ctx.save();
  if (tr.type === 'slide') drawSlideTransition(ctx, tr, progress, playW, playH);
  else drawVerticalTransition(ctx, tr, progress, playW, playH);
  ctx.restore();
}

function drawSlideTransition(ctx, tr, progress, playW, playH) {
  const dx = (tr.direction?.x || 0) * (1 - progress) * 90;
  const dy = (tr.direction?.y || 0) * (1 - progress) * 90;
  ctx.fillStyle = `rgba(9,12,18,${0.22 * (1 - progress)})`;
  ctx.fillRect(0, 0, playW, playH);
  ctx.strokeStyle = `rgba(116,230,255,${0.55 * (1 - progress)})`;
  ctx.lineWidth = 5;
  ctx.strokeRect(18 + dx, 18 + dy, playW - 36, playH - 36);
  ctx.fillStyle = `rgba(241,198,106,${0.90 * (1 - progress)})`;
  ctx.font = '900 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`Sliding to ${tr.label}`, playW / 2 + dx * .2, 66 + dy * .2);
  ctx.textAlign = 'left';
}

function drawVerticalTransition(ctx, tr, progress, playW, playH) {
  const entering = tr.direction === 'up' ? 1 : -1;
  const scale = tr.direction === 'up' ? 1.12 - progress * .12 : 0.92 + progress * .08;
  const alpha = Math.max(0, 1 - progress);
  ctx.fillStyle = `rgba(8,10,15,${0.28 * alpha})`;
  ctx.fillRect(0, 0, playW, playH);
  ctx.save();
  ctx.translate(playW / 2, playH / 2 + entering * (1 - progress) * 28);
  ctx.scale(scale, scale);
  ctx.strokeStyle = `rgba(241,198,106,${0.75 * alpha})`;
  ctx.lineWidth = 5;
  ctx.strokeRect(-playW * .36, -playH * .28, playW * .72, playH * .56);
  ctx.restore();
  ctx.fillStyle = `rgba(248,251,255,${0.92 * alpha})`;
  ctx.font = '900 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`Moving ${tr.direction} to ${tr.label}`, playW / 2, 68);
  ctx.textAlign = 'left';
}
