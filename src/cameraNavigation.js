import { floors, roomAt } from './world.js';
import { log } from './state.js';

const MAIN_LEVEL_AREAS = new Set([0, 3, 4, 5, 6]);
const AREA_POSITIONS = {
  3: { x: -1, y: 0, label: 'Garage' },
  0: { x: 0, y: 0, label: 'Main House' },
  4: { x: 0, y: -1, label: 'Backyard' },
  6: { x: 0, y: 1, label: 'Front Yard' },
  5: { x: 1, y: 0, label: 'Secret Lab' }
};

const BLUEPRINT_FLOORS = [
  { id: 1, label: 'Upstairs', className: 'upstairs' },
  { id: 4, label: 'Backyard North', className: 'yard' },
  { id: 3, label: 'Garage West', className: 'garage' },
  { id: 0, label: 'Main House', className: 'main' },
  { id: 6, label: 'Front Yard South', className: 'front-yard' },
  { id: 2, label: 'Basement', className: 'basement' }
];

let built = false;
let gestureBuilt = false;
let openPanel = '';
let els = {};

export function navigateView(state, targetFloor, label = floors[targetFloor]?.name || 'Area', reason = 'manual') {
  if (targetFloor == null || !floors[targetFloor]) return false;
  if (reason === 'selected-character' || reason === 'auto-follow') state.followSelected = true;
  else if (!['floor-travel', 'system'].includes(reason)) state.followSelected = false;

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

export function jumpToEntity(state, entityId, reason = 'locator') {
  const entity = state.entities.find(e => e.id === entityId);
  if (!entity || entity.hidden) return false;
  navigateView(state, entity.floor, `${entity.name}'s area`, reason);
  if (entity.id === state.selectedId) state.followSelected = true;
  state.viewFocus = { entityId: entity.id, t: 2.6 };
  log(state, `Found ${entity.name}. Selection unchanged.`);
  return true;
}

export function jumpToSelectedCharacter(state) {
  const current = state.entities.find(e => e.id === state.selectedId && !e.hidden) || state.entities.find(e => !e.hidden && e.type === 'person');
  if (!current) return false;
  state.followSelected = true;
  return jumpToEntity(state, current.id, 'selected-character');
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
  tryAutoFollowSelected(state);
}

function tryAutoFollowSelected(state) {
  if (state.followSelected === false) return;
  if (state.cameraTransition || state.buildPick || state.movePick || state.assign) return;
  const current = state.entities.find(e => e.id === state.selectedId && !e.hidden);
  if (!current || current.floor === state.floor) return;
  navigateView(state, current.floor, `${current.name}'s area`, 'auto-follow');
}

export function installCameraSwipeNavigation(state, surface) {
  if (gestureBuilt || !surface) return;
  gestureBuilt = true;
  let start = null;
  let tracking = false;

  surface.addEventListener('pointerdown', event => {
    if (event.button != null && event.button !== 0) return;
    if (openPanel || state.buildPick || state.movePick || state.assign) return;
    start = { x: event.clientX, y: event.clientY, t: performance.now(), floor: state.floor };
    tracking = true;
  }, { passive: true });

  surface.addEventListener('pointermove', event => {
    if (!tracking || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 14) state.cameraGestureActive = true;
  }, { passive: true });

  surface.addEventListener('pointerup', event => {
    if (!tracking || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = performance.now() - start.t;
    tracking = false;
    const target = swipeTarget(start.floor, dx, dy, elapsed);
    start = null;
    if (!target) {
      setTimeout(() => { state.cameraGestureActive = false; }, 0);
      return;
    }
    state.cameraGestureActive = true;
    state.suppressNextCanvasClick = true;
    closePanel();
    navigateView(state, target.floor, target.label, 'swipe-pull');
    setTimeout(() => {
      state.suppressNextCanvasClick = false;
      state.cameraGestureActive = false;
    }, 180);
  }, { passive: true });

  surface.addEventListener('click', event => {
    if (!state.suppressNextCanvasClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.suppressNextCanvasClick = false;
  }, true);
}

export function syncCameraNavigationUi(state) {
  if (!built) buildCameraNavigationUi();
  updateButtons(state);
  if (openPanel === 'blueprint') renderBlueprintPanel(state);
  if (openPanel === 'locator') renderLocatorPanel(state);
}

function createTransition(from, to, label, reason) {
  const sameMainLevel = MAIN_LEVEL_AREAS.has(from) && MAIN_LEVEL_AREAS.has(to);
  const total = sameMainLevel ? 0.46 : 0.48;
  return { from, to, label, reason, type: sameMainLevel ? 'slide' : 'vertical', direction: sameMainLevel ? slideDirection(from, to) : verticalDirection(from, to), t: total, total };
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

function swipeTarget(floor, dx, dy, elapsed) {
  const distance = Math.hypot(dx, dy);
  if (distance < 52 || elapsed > 1400) return null;
  const horizontal = Math.abs(dx) > Math.abs(dy);

  if (floor === 0) {
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };
    if (!horizontal && dy < -42) return { floor: 6, label: 'Front Yard South' };
    if (horizontal && dx > 42) return { floor: 3, label: 'Garage West' };
    if (horizontal && dx < -42) return { floor: 5, label: 'Secret Lab East' };
  }

  if (floor === 4) {
    if (!horizontal && dy < -42) return { floor: 0, label: 'Main House' };
    if (horizontal && dx > 42) return { floor: 3, label: 'Garage West' };
  }

  if (floor === 3) {
    if (horizontal && dx < -42) return { floor: 0, label: 'Main House' };
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };
    if (!horizontal && dy < -42) return { floor: 6, label: 'Front Yard South' };
  }

  if (floor === 5) {
    if (horizontal && dx > 42) return { floor: 0, label: 'Main House' };
  }

  if (floor === 6) {
    if (!horizontal && dy > 42) return { floor: 0, label: 'Main House' };
    if (horizontal && dx > 42) return { floor: 3, label: 'Garage West' };
  }
  return null;
}

function buildCameraNavigationUi() {
  built = true;
  const wrap = document.getElementById('game-wrap');
  const controlBar = document.getElementById('game-control-bar') || wrap;
  const dock = document.createElement('section');
  dock.id = 'camera-nav-dock';
  dock.className = 'control-bar-group camera-control-group';

  const selectedButton = document.createElement('button');
  selectedButton.id = 'selected-character-button';
  selectedButton.className = 'camera-float-button control-bar-button icon-control-button';
  selectedButton.type = 'button';
  selectedButton.textContent = '★';
  selectedButton.title = 'Jump to selected character and resume follow';
  selectedButton.setAttribute('aria-label', 'Jump to selected character');
  selectedButton.onclick = event => { event.stopPropagation(); closePanel(); jumpToSelectedCharacter(getActiveState()); };

  const lab = document.createElement('button');
  lab.id = 'secret-lab-button';
  lab.className = 'camera-float-button control-bar-button icon-control-button';
  lab.type = 'button';
  lab.textContent = '⚗';
  lab.title = 'Secret Sprite Test Lab';
  lab.setAttribute('aria-label', 'Open secret sprite test lab');
  lab.onclick = event => { event.stopPropagation(); closePanel(); navigateView(getActiveState(), 5, 'Secret Lab East', 'secret-lab-button'); };

  const blueprint = document.createElement('button');
  blueprint.id = 'blueprint-float-button';
  blueprint.className = 'camera-float-button control-bar-button icon-control-button';
  blueprint.type = 'button';
  blueprint.textContent = '▦';
  blueprint.title = 'Whole house blueprint';
  blueprint.setAttribute('aria-label', 'Open whole house blueprint');
  blueprint.onclick = event => { event.stopPropagation(); togglePanel('blueprint'); };

  const locator = document.createElement('button');
  locator.id = 'locator-float-button';
  locator.className = 'camera-float-button control-bar-button icon-control-button';
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

  dock.appendChild(selectedButton);
  dock.appendChild(lab);
  dock.appendChild(blueprint);
  dock.appendChild(locator);
  controlBar.appendChild(dock);
  wrap.appendChild(panel);
  els = { dock, selectedButton, lab, blueprint, locator, panel, state: null };
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !dock.contains(event.target)) closePanel();
  });
}

function getActiveState() {
  return els.state;
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
  els.state = state;
  if (!els.blueprint || !els.locator || !els.lab || !els.selectedButton) return;
  const selected = state.entities.find(e => e.id === state.selectedId && !e.hidden);
  els.selectedButton.classList.toggle('disabled', !selected);
  els.selectedButton.title = selected ? `Jump to ${selected.name} and resume follow` : 'No selected character visible';
  els.lab.classList.toggle('disabled', false);
  els.lab.title = state.floor === 5 ? 'Secret Lab East, swipe right to return' : 'Secret Sprite Test Lab';
  els.blueprint.classList.toggle('disabled', false);
  els.blueprint.title = 'Whole house blueprint view';
  els.locator.classList.toggle('disabled', !state.entities.some(e => !e.hidden));
}

function renderBlueprintPanel(state) {
  const panel = els.panel;
  if (!panel) return;
  panel.classList.remove('hidden');
  panel.classList.add('blueprint-fullscreen');
  const cards = BLUEPRINT_FLOORS.map(item => floorCard(state, item)).join('');
  panel.innerHTML = `<div class="blueprint-mode"><div class="blueprint-mode-header"><div><div class="blueprint-title">Whole House Blueprint</div><p class="blueprint-note">North is up. South is the front yard and road. West is the garage. East is the secret lab. Tap any region or person marker. The blueprint closes and the camera moves there.</p></div><button class="blueprint-close" type="button">×</button></div><div class="blueprint-compound-map">${cards}</div></div>`;
  panel.querySelector('.blueprint-close').onclick = event => { event.stopPropagation(); closePanel(); };
  panel.querySelectorAll('[data-blueprint-floor]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      const target = Number(button.dataset.blueprintFloor);
      navigateView(state, target, button.dataset.label || floors[target]?.name || 'Area', 'blueprint');
      closePanel();
    };
  });
  panel.querySelectorAll('[data-entity]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      jumpToEntity(state, button.dataset.entity);
      closePanel();
    };
  });
}

function floorCard(state, item) {
  const floor = floors[item.id];
  if (!floor) return '';
  const active = state.floor === item.id ? ' active' : '';
  const roomButtons = floor.rooms.map(room => roomButton(state, item, room)).join('');
  const people = state.entities.filter(e => !e.hidden && e.floor === item.id && !e.labOnly);
  const markers = people.map(entity => entityMarker(state, entity)).join('');
  return `<section class="blueprint-floor-card ${item.className}${active}" data-blueprint-floor="${item.id}" data-label="${item.label}"><header><strong>${item.label}</strong><small>${people.length} here</small></header><div class="blueprint-mini-floor">${roomButtons}${markers}</div></section>`;
}

function roomButton(state, item, room) {
  const floor = floors[item.id];
  const w = miniFloorWidth(floor);
  const h = miniFloorHeight(floor);
  const style = `left:${(room.x / w) * 100}%;top:${(room.y / h) * 100}%;width:${(room.w / w) * 100}%;height:${(room.h / h) * 100}%;`;
  return `<button class="blueprint-room" style="${style}" data-blueprint-floor="${item.id}" data-label="${room.name}" title="${room.name}"><span>${room.name}</span></button>`;
}

function entityMarker(state, entity) {
  const floor = floors[entity.floor];
  const w = miniFloorWidth(floor);
  const h = miniFloorHeight(floor);
  const room = roomAt(entity.x, entity.y, entity.floor);
  const label = `${entity.name}${room ? `, ${room.name}` : ''}`;
  const selected = state.selectedId === entity.id ? ' selected' : '';
  return `<button class="blueprint-person${selected}" style="left:${(entity.x / w) * 100}%;top:${(entity.y / h) * 100}%;" data-entity="${entity.id}" title="${label}">${headIcon(entity)}</button>`;
}

function miniFloorWidth(floor) {
  return Math.max(960, ...floor.rooms.map(room => room.x + room.w));
}

function miniFloorHeight(floor) {
  return Math.max(720, ...floor.rooms.map(room => room.y + room.h));
}

function renderLocatorPanel(state) {
  const panel = els.panel;
  if (!panel) return;
  panel.classList.remove('blueprint-fullscreen');
  panel.classList.remove('hidden');
  const visible = state.entities.filter(e => !e.hidden);
  const buttons = visible.map(entity => `<button class="locator-row" data-entity="${entity.id}"><span class="locator-head">${headIcon(entity)}</span><span><strong>${entity.name}</strong><small>${floors[entity.floor]?.name || 'area'} • ${entity.action || 'Idle'}</small></span></button>`).join('');
  panel.innerHTML = `<div class="blueprint-card"><div class="blueprint-title">Find Household</div><div class="locator-list">${buttons || '<p class="blueprint-note">No visible household members.</p>'}</div><p class="blueprint-note">This moves the camera only. It does not change who is selected. Tap ★ for the selected character.</p></div>`;
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
  if (entity.id === 'lab_test_subject') return '🧪';
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
  ctx.fillStyle = `rgba(9,12,18,${0.18 * (1 - progress)})`;
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
  ctx.fillText(`Moving ${tr.direction} to ${tr.label}`, playW / 2, 66);
  ctx.textAlign = 'left';
}
