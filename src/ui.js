import { windowAt, toggleWindow } from './blueprint.js';
import { careerHudLine, careerScheduleStatusLine } from './careerSystem.js';
import { calendarHudLine } from './calendarSystem.js';
import { calendarCompactHudLine } from './calendarDisplay.js';
import { ACTIONS, DOG_SOCIAL_ACTIONS, DOUBLE_TAP_MS, NEEDS, SOCIAL_ACTIONS } from './config.js';
import { startObjectAction, startOffsite, startSocialAction, throwFetchBall } from './actions.js';
import { interruptBookIfNeeded } from './bookSystem.js';
import { lifeControlLabel, lifeQualityHudLine, toggleLifeControlMode } from './lifeQualitySystem.js';
import { placeBuildRequest } from './buildRequests.js';
import { startCookingFlow } from './cooking.js';
import { openDeviceHome } from './appMenu.js';
import { beginMoveObject, placeMoveObject } from './objectMove.js';
import { commandMove } from './movement.js';
import { navigateView } from './cameraNavigation.js';
import { clearRefreshState, loadGame, saveGame, slotSummary } from './saveSystem.js';
import { log, resumeEntity, selected, stopEntity } from './state.js';
import { floors, objectAt, objects } from './world.js';

const TRAVEL_ACTIONS = ['work', 'errand', 'mall', 'movies', 'date'];

export function createUi(state, surface, options = {}) {
  const menu = document.getElementById('interaction-menu');
  const selectedName = document.getElementById('selected-name');
  const currentAction = document.getElementById('current-action');
  const needs = document.getElementById('needs');
  const worldState = document.getElementById('world-state');
  const logEl = document.getElementById('log');
  const commandPanel = document.getElementById('command-panel');
  const calendarPill = document.getElementById('hud-calendar-pill');
  let lastTap = 0;

  const closeMenu = () => { menu.classList.add('hidden'); menu.innerHTML = ''; state.menu = null; };
  const openMenu = (x, y, title, items) => {
    menu.innerHTML = `<h3>${title}</h3>`;
    for (const item of items) {
      const b = document.createElement('button');
      b.textContent = item.label;
      b.onclick = () => { closeMenu(); item.run(); };
      menu.appendChild(b);
    }
    const maxX = (surface.clientWidth || 960) - 240;
    const maxY = (surface.clientHeight || 720) - 280;
    menu.style.left = `${Math.max(8, Math.min(x, maxX))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, maxY))}px`;
    menu.classList.remove('hidden');
  };
  const pt = event => {
    const r = surface.getBoundingClientRect();
    return { x: (event.clientX - r.left) * 960 / r.width, y: (event.clientY - r.top) * 720 / r.height, menuX: event.clientX - r.left, menuY: event.clientY - r.top };
  };
  const menuPoint = (x, y) => {
    const sx = (surface.clientWidth || 960) / 960;
    const sy = (surface.clientHeight || 720) / 720;
    return { x: x * sx, y: y * sy };
  };
  const entityAt = (x, y) => [...state.entities].reverse().find(e => !e.hidden && e.floor === state.floor && Math.hypot(e.x - x, e.y - y) < (e.type === 'dog' ? 34 : 30));
  const cell = actor => openDeviceHome(state, actor, openMenu);

  function guidedInterrupt(actor) {
    if (!actor) return;
    interruptBookIfNeeded(state, actor, 'interrupted by a player command');
    actor.path = [];
    actor.target = null;
    actor.pending = null;
    actor.queuedTask = null;
    actor.actionT = 0;
    actor.actionTotal = 0;
    actor.currentActionId = null;
    actor.stopped = false;
    actor.pose = 'stand';
    actor.blockedT = 0;
    actor.recoveryCount = 0;
    if (!actor.carrying || !String(actor.carrying).includes('luggage')) actor.carrying = null;
  }

  function guidedObject(actor, obj, actionId) {
    guidedInterrupt(actor);
    return startObjectAction(state, actor, obj, actionId);
  }

  function guidedSocial(actor, target, socialId) {
    guidedInterrupt(actor);
    return startSocialAction(state, actor, target, socialId);
  }

  function guidedCooking(actor) {
    guidedInterrupt(actor);
    state.cookingJob = null;
    return startCookingFlow(state, actor);
  }

  function guidedOffsite(actor, actionId, invitedIds = [], vehicleId = 'auto') {
    guidedInterrupt(actor);
    return startOffsite(state, actor, actionId, invitedIds, vehicleId);
  }

  function handleCanvasPoint(x, y, menuX = null, menuY = null) {
    if (state.suppressNextCanvasClick || state.cameraGestureActive) {
      state.suppressNextCanvasClick = false;
      return;
    }
    const menuPos = menuX == null || menuY == null ? menuPoint(x, y) : { x: menuX, y: menuY };
    if (x > 960 || y > 720) return closeMenu();
    if (state.buildPick && placeBuildRequest(state, selected(state), x, y)) return closeMenu();
    if (state.movePick && placeMoveObject(state, selected(state), x, y)) return closeMenu();
    const win = windowAt(x, y, state.floor);
    if (win) return openMenu(menuPos.x, menuPos.y, win.label, [{ label: state.objectState.openWindows?.[win.id] ? 'Close Window' : 'Open Window', run: () => toggleWindow(state, selected(state), win) }]);
    const ent = entityAt(x, y);
    if (state.assign && ent) {
      const obj = objects.find(o => o.id === state.assign.objectId);
      if (obj) guidedObject(ent, obj, state.assign.actionId);
      state.assign = null;
      return closeMenu();
    }
    if (ent) return openMenu(menuPos.x, menuPos.y, ent.name, ent.id === selected(state).id ? selfItems(ent) : socialItems(selected(state), ent));
    const obj = objectAt(x, y, state.floor);
    if (obj) return openMenu(menuPos.x, menuPos.y, obj.label, objectItems(selected(state), obj));
    if (throwFetchBall(state, x, y)) return closeMenu();
    if (!menu.classList.contains('hidden')) return closeMenu();
    const now = performance.now();
    const run = now - lastTap < DOUBLE_TAP_MS;
    lastTap = now;
    const actor = selected(state);
    guidedInterrupt(actor);
    commandMove(actor, x, y, run);
  }

  function clickCanvas(event) {
    const p = pt(event);
    handleCanvasPoint(p.x, p.y, p.menuX, p.menuY);
  }

  function jumpArea(floor, label = floors[floor]?.name || 'area') {
    navigateView(state, floor, label, 'hud-control');
    closeMenu();
  }

  function openCompoundMap() {
    openMenu(16, 74, 'House Map', [
      { label: 'Main House', run: () => jumpArea(0, 'Main House') },
      { label: 'Backyard North', run: () => jumpArea(4, 'Backyard North') },
      { label: 'Front Yard South', run: () => jumpArea(6, 'Front Yard South') },
      { label: 'Driveway West', run: () => jumpArea(7, 'Driveway West') },
      { label: 'Garage West', run: () => jumpArea(3, 'Garage West') },
      { label: 'Front Patio / Entry', run: () => jumpArea(0, 'Front Patio / Entry') },
      { label: 'Upstairs', run: () => jumpArea(1, 'Upstairs') },
      { label: 'Basement', run: () => jumpArea(2, 'Basement') }
    ]);
  }

  function changeVertical(delta) {
    if (delta > 0) {
      if (state.floor === 2) return jumpArea(0, 'Main House');
      if (state.floor === 0 || state.floor === 3 || state.floor === 4 || state.floor === 6 || state.floor === 7) return jumpArea(1, 'Upstairs');
      return jumpArea(1, 'Upstairs');
    }
    if (state.floor === 1) return jumpArea(0, 'Main House');
    if (state.floor === 0 || state.floor === 3 || state.floor === 4 || state.floor === 6 || state.floor === 7) return jumpArea(2, 'Basement');
    return jumpArea(2, 'Basement');
  }

  function refillDevMoney() {
    state.money = Math.max(state.money || 0, 50000);
    log(state, 'Developer test money refilled to $50000.');
  }

  function toggleLifeAuto() {
    const mode = toggleLifeControlMode(state);
    state.autonomyMode = mode === 'auto' ? 'free' : 'guided';
    log(state, `${lifeControlLabel(state)}. Autonomy: ${state.autonomyMode}.`);
  }

  function selfItems(actor) { return [
    { label: 'Cell', run: () => cell(actor) }, { label: 'Stop', run: () => stopEntity(actor) }, { label: 'Resume / Auto', run: () => resumeEntity(actor) },
    { label: 'Get food', run: () => guidedObject(actor, objects.find(o => o.id === 'fridge'), 'snack') }, { label: 'Cook meal', run: () => guidedCooking(actor) },
    { label: 'Shower', run: () => guidedObject(actor, objects.find(o => o.kind === 'shower' && o.floor === actor.floor) || objects.find(o => o.id === 'shower'), 'shower') }
  ]; }

  function socialItems(actor, target) {
    const list = target.type === 'dog' ? DOG_SOCIAL_ACTIONS : SOCIAL_ACTIONS;
    return [...list.map(([id, label]) => ({ label, run: () => guidedSocial(actor, target, id) })), { label: `Select ${target.name}`, run: () => { state.selectedId = target.id; log(state, `${target.name} selected.`); } }];
  }

  function objectItems(actor, obj) {
    const actions = ACTIONS[obj.kind] || [['use', 'Use']];
    const items = actions.map(([id, label]) => ({ label: `${actor.name}: ${label}`, run: () => useObject(actor, obj, id) }));
    if (obj.kind === 'bookshelf') items.push({ label: `${actor.name}: Pull Book / Read`, run: () => guidedObject(actor, obj, 'read') });
    if (obj.kind === 'desk' || obj.kind === 'stereo') items.push({ label: `${actor.name}: Open Cell`, run: () => cell(actor) });
    items.push({ label: 'Move', run: () => beginMoveObject(state, actor, obj) });
    items.push({ label: 'Assign this object...', run: () => { state.assign = { objectId: obj.id, actionId: actions[0][0] }; log(state, `Tap who should use ${obj.label}.`); } });
    return items;
  }

  function useObject(actor, obj, actionId) {
    if (actionId === 'meal') return guidedCooking(actor);
    if ((obj.kind === 'door' || obj.kind === 'car') && TRAVEL_ACTIONS.includes(actionId)) return guidedOffsite(actor, actionId, [], obj.kind === 'car' ? obj.id : 'auto');
    if (obj.kind === 'bike' && TRAVEL_ACTIONS.includes(actionId)) return guidedOffsite(actor, actionId, [], 'bike');
    if (obj.kind === 'motorbike' && TRAVEL_ACTIONS.includes(actionId)) return guidedOffsite(actor, actionId, [], 'motorbike');
    guidedObject(actor, obj, actionId);
  }
  function setFloor(floor) { jumpArea(floor, floors[floor]?.name || 'area'); }

  function bindButtons() {
    const areaButtons = [[0, 'Main'], [1, 'Upstairs'], [2, 'Basement'], [3, 'Garage West'], [4, 'Yard North'], [6, 'Front South']];
    for (const [i, label] of areaButtons) { const btn = document.getElementById(`floor-${i}`); if (btn) { btn.textContent = label; btn.onclick = () => setFloor(i); } }
    document.getElementById('speed-1').onclick = () => { state.speed = 1; };
    document.getElementById('speed-3').onclick = () => { state.speed = 3; };
    document.getElementById('pause').onclick = () => { state.paused = !state.paused; };
    document.getElementById('reset').onclick = () => { clearRefreshState(state); location.reload(); };
    commandPanel.innerHTML = '';
    const buttons = [['Map', () => openCompoundMap()], ['Up', () => changeVertical(1)], ['Down', () => changeVertical(-1)], ['Dev $', () => refillDevMoney()], ['Cell', () => cell(selected(state))], ['Save', () => saveGame(state, 1)], ['Load', () => loadGame(state, 1)], ['Stop', () => stopEntity(selected(state))], ['Resume', () => resumeEntity(selected(state))], ['Life Auto', () => toggleLifeAuto()]];
    for (const [label, run] of buttons) { const b = document.createElement('button'); b.textContent = label; b.onclick = run; commandPanel.appendChild(b); }
  }

  function renderHud() {
    const actor = selected(state);
    const compactDate = calendarCompactHudLine(state);
    if (calendarPill) calendarPill.textContent = compactDate;
    selectedName.textContent = actor.name;
    currentAction.textContent = actor.action || 'Idle';
    needs.innerHTML = NEEDS.map(([key, label]) => { const value = Math.round(actor.needs[key] ?? 0); return `<div class="need-row"><span>${label}</span><div class="need-bar"><div class="need-fill" style="width:${value}%"></div></div><span>${value}</span></div>`; }).join('');
    const music = state.music ? `<br>Music: ${state.music.genre}` : '';
    const build = state.buildPick ? `<br>Build: tap ${state.buildPick.label} spot` : '';
    const delivery = state.delivery ? `<br>Delivery: ${state.delivery.phase}` : '';
    const save = state.saveStatus?.message ? `<br>Save: ${state.saveStatus.message}` : `<br>Slot 1: ${slotSummary(1)}`;
    const trash = state.garbage ? `<br>Trash: ${Math.round(state.garbage.kitchen || 0)}%` : '';
    const career = actor.type === 'person' ? `<br>${careerHudLine(state, actor)}<br>${careerScheduleStatusLine(state, actor)}` : '';
    const life = actor.type === 'person' ? `<br>${lifeQualityHudLine(state, actor)}` : '';
    const calendar = calendarHudLine(state).replace(/^Calendar: /, 'Plans: ');
    worldState.innerHTML = `<strong>${compactDate}</strong><br>Money: $${Math.round(state.money ?? 0)}<br>${calendar}<br>Area: ${floors[state.floor]?.name || state.floor}<br>View hold: ${Math.ceil(state.viewHoldT || 0)}s<br>Speed: ${state.speed}x<br>Autonomy: ${state.autonomyMode}<br>${lifeControlLabel(state)}${career}${life}${music}${build}${delivery}${trash}${save}<br>Electric bill: $${Math.max(0, Math.round(state.bill))}`;
    logEl.innerHTML = state.notifications.map(item => `<li>${item}</li>`).join('');
  }

  if (!options.externalInput) surface.addEventListener('click', clickCanvas);
  document.addEventListener('click', e => { if (!menu.contains(e.target) && e.target !== surface) closeMenu(); });
  bindButtons();
  return { renderHud, closeMenu, handleCanvasPoint, openMenu };
}
