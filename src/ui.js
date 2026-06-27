import { ACTIONS, DOG_SOCIAL_ACTIONS, DOUBLE_TAP_MS, NEEDS, SOCIAL_ACTIONS } from './config.js';
import { startObjectAction, startOffsite, startSocialAction, throwFetchBall } from './actions.js';
import { handleBuildRequest } from './buildRequests.js';
import { buyWorkoutGear, orderFood } from './economy.js';
import { beginMoveObject, placeMoveObject } from './objectMove.js';
import { commandMove } from './movement.js';
import { addRoutine, startSkill } from './training.js';
import { log, resumeEntity, selected, stopEntity } from './state.js';
import { objectAt, objects } from './world.js';
import { formatTime } from './rendering.js';

export function createUi(state, canvas) {
  const menu = document.getElementById('interaction-menu');
  const selectedName = document.getElementById('selected-name');
  const currentAction = document.getElementById('current-action');
  const needs = document.getElementById('needs');
  const worldState = document.getElementById('world-state');
  const logEl = document.getElementById('log');
  const commandPanel = document.getElementById('command-panel');
  let lastTap = 0;

  function toGamePoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) };
  }

  function closeMenu() { menu.classList.add('hidden'); menu.innerHTML = ''; state.menu = null; }

  function openMenu(x, y, title, items) {
    menu.innerHTML = `<h3>${title}</h3>`;
    for (const item of items) {
      const button = document.createElement('button');
      button.textContent = item.label;
      button.addEventListener('click', () => { closeMenu(); item.run(); });
      menu.appendChild(button);
    }
    menu.style.left = `${Math.min(x, canvas.clientWidth - 230)}px`;
    menu.style.top = `${Math.min(y, canvas.clientHeight - 250)}px`;
    menu.classList.remove('hidden');
  }

  function entityAt(x, y) {
    return [...state.entities].reverse().find(e => !e.hidden && e.floor === state.floor && Math.hypot(e.x - x, e.y - y) < (e.type === 'dog' ? 34 : 30));
  }

  function handleCanvasClick(event) {
    const p = toGamePoint(event);
    if (p.x > 960 || p.y > 720) { closeMenu(); return; }
    if (state.movePick && placeMoveObject(state, selected(state), p.x, p.y)) { closeMenu(); return; }

    const clickedEntity = entityAt(p.x, p.y);
    if (state.assign && clickedEntity) {
      const obj = objects.find(o => o.id === state.assign.objectId);
      if (obj) startObjectAction(state, clickedEntity, obj, state.assign.actionId);
      state.assign = null;
      closeMenu();
      return;
    }

    if (clickedEntity) {
      const actor = selected(state);
      const isSelf = clickedEntity.id === actor.id;
      const items = isSelf ? selfItems(actor) : socialItems(actor, clickedEntity);
      openMenu(event.offsetX, event.offsetY, clickedEntity.name, items);
      return;
    }

    const obj = objectAt(p.x, p.y, state.floor);
    if (obj) {
      const actor = selected(state);
      openMenu(event.offsetX, event.offsetY, obj.label, objectItems(actor, obj));
      return;
    }

    if (throwFetchBall(state, p.x, p.y)) { closeMenu(); return; }

    if (!menu.classList.contains('hidden')) { closeMenu(); return; }
    const now = performance.now();
    const run = now - lastTap < DOUBLE_TAP_MS;
    lastTap = now;
    commandMove(selected(state), p.x, p.y, run);
  }

  function selfItems(actor) {
    return [
      { label: 'Stop', run: () => stopEntity(actor) },
      { label: 'Resume / Auto', run: () => resumeEntity(actor) },
      { label: 'Send to couch', run: () => startObjectAction(state, actor, objects.find(o => o.id === 'couch'), 'relax') },
      { label: 'Get food', run: () => startObjectAction(state, actor, objects.find(o => o.id === 'fridge'), 'snack') },
      { label: 'Shower', run: () => startObjectAction(state, actor, objects.find(o => o.kind === 'shower' && o.floor === actor.floor) || objects.find(o => o.id === 'shower'), 'shower') },
      { label: 'Train strength', run: () => startSkill(state, actor, 'strength') },
      { label: 'Study intellect', run: () => startSkill(state, actor, 'intellect') }
    ];
  }

  function socialItems(actor, target) {
    const choices = target.type === 'dog' ? DOG_SOCIAL_ACTIONS : SOCIAL_ACTIONS;
    const items = choices.map(([id, label]) => ({ label, run: () => startSocialAction(state, actor, target, id) }));
    items.push({ label: `Select ${target.name}`, run: () => { state.selectedId = target.id; log(state, `${target.name} selected.`); } });
    return items;
  }

  function objectItems(actor, obj) {
    const actions = ACTIONS[obj.kind] || [['use', 'Use']];
    const items = actions.map(([id, label]) => ({ label: `${actor.name}: ${label}`, run: () => handleObjectUse(actor, obj, id) }));
    if (obj.kind === 'bookshelf') items.push({ label: `${actor.name}: Read / Study`, run: () => startSkill(state, actor, 'intellect') });
    items.push({ label: 'Move', run: () => beginMoveObject(state, actor, obj) });
    items.push({ label: 'Assign this object...', run: () => { state.assign = { objectId: obj.id, actionId: actions[0][0] }; log(state, `Tap who should use ${obj.label}.`); } });
    for (const e of state.entities.filter(e => !e.hidden && e.type !== 'dog')) {
      items.push({ label: `Ask ${e.name} to use it`, run: () => handleObjectUse(e, obj, actions[0][0]) });
    }
    return items;
  }

  function handleObjectUse(actor, obj, actionId) {
    if (obj.kind === 'door' && ['work', 'errand', 'mall', 'movies', 'date'].includes(actionId)) return startOffsite(state, actor, actionId);
    startObjectAction(state, actor, obj, actionId);
  }

  function cycleMode() {
    const modes = ['manual', 'guided', 'free'];
    state.autonomyMode = modes[(modes.indexOf(state.autonomyMode) + 1) % modes.length];
    log(state, `Autonomy: ${state.autonomyMode}.`);
  }

  function bindButtons() {
    document.getElementById('floor-0').onclick = () => { state.floor = 0; closeMenu(); };
    document.getElementById('floor-1').onclick = () => { state.floor = 1; closeMenu(); };
    document.getElementById('speed-1').onclick = () => { state.speed = 1; };
    document.getElementById('speed-3').onclick = () => { state.speed = 3; };
    document.getElementById('pause').onclick = () => { state.paused = !state.paused; };
    document.getElementById('reset').onclick = () => location.reload();
    commandPanel.innerHTML = '';
    const buttons = [
      ['Stop', () => stopEntity(selected(state))], ['Resume', () => resumeEntity(selected(state))],
      ['Phone: Food', () => orderFood(state, selected(state), false)], ['Phone: Workout', () => buyWorkoutGear(state, selected(state))],
      ['Build Request', () => handleBuildRequest(state, selected(state), prompt('What should they build or order?') || '')],
      ['Train Strength', () => startSkill(state, selected(state), 'strength')], ['Study', () => startSkill(state, selected(state), 'intellect')],
      ['Schedule Gym', () => addRoutine(state, selected(state), 'strength')], ['Auto Mode', cycleMode]
    ];
    for (const [label, run] of buttons) {
      const button = document.createElement('button'); button.textContent = label; button.onclick = run; commandPanel.appendChild(button);
    }
  }

  function renderHud() {
    const actor = selected(state);
    selectedName.textContent = actor.name;
    currentAction.textContent = actor.action || 'Idle';
    needs.innerHTML = NEEDS.map(([key, label]) => {
      const value = Math.round(actor.needs[key] ?? 0);
      return `<div class="need-row"><span>${label}</span><div class="need-bar"><div class="need-fill" style="width:${value}%"></div></div><span>${value}</span></div>`;
    }).join('');
    worldState.innerHTML = `Clock: ${formatTime(state.time)}<br>Floor: ${state.floor + 1}<br>Speed: ${state.speed}x<br>Money: $${Math.round(state.money ?? 0)}<br>Autonomy: ${state.autonomyMode}<br>Electric bill: $${Math.max(0, Math.round(state.bill))}`;
    logEl.innerHTML = state.notifications.map(item => `<li>${item}</li>`).join('');
  }

  canvas.addEventListener('click', handleCanvasClick);
  document.addEventListener('click', event => { if (!menu.contains(event.target) && event.target !== canvas) closeMenu(); });
  bindButtons();
  return { renderHud, closeMenu };
}
