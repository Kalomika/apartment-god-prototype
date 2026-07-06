import { windowAt, toggleWindow } from './blueprint.js';
import { ACTIONS, DOG_SOCIAL_ACTIONS, DOUBLE_TAP_MS, NEEDS, SOCIAL_ACTIONS } from './config.js';
import { startObjectAction, startOffsite, startSocialAction, throwFetchBall } from './actions.js';
import { placeBuildRequest } from './buildRequests.js';
import { startCookingFlow } from './cooking.js';
import { openDeviceHome } from './appMenu.js';
import { beginMoveObject, placeMoveObject } from './objectMove.js';
import { commandMove } from './movement.js';
import { loadGame, saveGame, slotSummary } from './saveSystem.js';
import { startBook } from './training.js';
import { log, resumeEntity, selected, stopEntity } from './state.js';
import { floors, objectAt, objects } from './world.js';
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

  const closeMenu = () => { menu.classList.add('hidden'); menu.innerHTML = ''; state.menu = null; };
  const openMenu = (x, y, title, items) => {
    menu.innerHTML = `<h3>${title}</h3>`;
    for (const item of items) { const b = document.createElement('button'); b.textContent = item.label; b.onclick = () => { closeMenu(); item.run(); }; menu.appendChild(b); }
    const w = Math.min(420, window.innerWidth - 24);
    const h = Math.min(window.innerHeight - 24, 620);
    const left = Math.max(12, Math.min(x, window.innerWidth - w - 12));
    const top = Math.max(12, Math.min(y, window.innerHeight - h - 12));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.maxHeight = `${window.innerWidth <= 760 ? window.innerHeight - 16 : h}px`;
    menu.classList.remove('hidden');
  };
  const pt = event => { const r = canvas.getBoundingClientRect(); return { x: (event.clientX - r.left) * canvas.width / r.width, y: (event.clientY - r.top) * canvas.height / r.height }; };
  const entityAt = (x, y) => [...state.entities].reverse().find(e => !e.hidden && e.floor === state.floor && Math.hypot(e.x - x, e.y - y) < (e.type === 'dog' ? 34 : 30));
  const cell = actor => openDeviceHome(state, actor, openMenu);

  function clickCanvas(event) {
    const p = pt(event);
    if (p.x > 960 || p.y > 720) return closeMenu();
    if (state.buildPick && placeBuildRequest(state, selected(state), p.x, p.y)) return closeMenu();
    if (state.movePick && placeMoveObject(state, selected(state), p.x, p.y)) return closeMenu();
    const win = windowAt(p.x, p.y, state.floor);
    if (win) return openMenu(event.clientX, event.clientY, win.label, [{ label: state.objectState.openWindows?.[win.id] ? 'Close Window' : 'Open Window', run: () => toggleWindow(state, selected(state), win) }]);
    const ent = entityAt(p.x, p.y);
    if (state.assign && ent) { const obj = objects.find(o => o.id === state.assign.objectId); if (obj) startObjectAction(state, ent, obj, state.assign.actionId); state.assign = null; return closeMenu(); }
    if (ent) return openMenu(event.clientX, event.clientY, ent.name, ent.id === selected(state).id ? selfItems(ent) : socialItems(selected(state), ent));
    const obj = objectAt(p.x, p.y, state.floor);
    if (obj) return openMenu(event.clientX, event.clientY, obj.label, objectItems(selected(state), obj));
    if (throwFetchBall(state, p.x, p.y)) return closeMenu();
    if (!menu.classList.contains('hidden')) return closeMenu();
    const now = performance.now(); const run = now - lastTap < DOUBLE_TAP_MS; lastTap = now; commandMove(selected(state), p.x, p.y, run);
  }

  function selfItems(actor) { return [
    { label: 'Cell', run: () => cell(actor) }, { label: 'Stop', run: () => stopEntity(actor) }, { label: 'Resume / Auto', run: () => resumeEntity(actor) },
    { label: 'Get food', run: () => startObjectAction(state, actor, objects.find(o => o.id === 'fridge'), 'snack') }, { label: 'Cook meal', run: () => startCookingFlow(state, actor) },
    { label: 'Shower', run: () => startObjectAction(state, actor, objects.find(o => o.kind === 'shower' && o.floor === actor.floor) || objects.find(o => o.id === 'shower'), 'shower') }
  ]; }

  function socialItems(actor, target) { const list = target.type === 'dog' ? DOG_SOCIAL_ACTIONS : SOCIAL_ACTIONS; return [...list.map(([id, label]) => ({ label, run: () => startSocialAction(state, actor, target, id) })), { label: `Select ${target.name}`, run: () => { state.selectedId = target.id; log(state, `${target.name} selected.`); } }]; }

  function objectItems(actor, obj) {
    const actions = ACTIONS[obj.kind] || [['use', 'Use']];
    const items = actions.map(([id, label]) => ({ label: `${actor.name}: ${label}`, run: () => useObject(actor, obj, id) }));
    if (obj.kind === 'bookshelf') items.push({ label: `${actor.name}: Pull Book / Read`, run: () => startBook(state, actor, obj) });
    if (obj.kind === 'desk' || obj.kind === 'stereo') items.push({ label: `${actor.name}: Open Cell`, run: () => cell(actor) });
    items.push({ label: 'Move', run: () => beginMoveObject(state, actor, obj) });
    items.push({ label: 'Assign this object...', run: () => { state.assign = { objectId: obj.id, actionId: actions[0][0] }; log(state, `Tap who should use ${obj.label}.`); } });
    return items;
  }

  function useObject(actor, obj, actionId) { if (actionId === 'meal') return startCookingFlow(state, actor); if ((obj.kind === 'door' || obj.kind === 'car') && ['work', 'errand', 'mall', 'movies', 'date'].includes(actionId)) return startOffsite(state, actor, actionId); startObjectAction(state, actor, obj, actionId); }
  function setFloor(floor) { state.floor = floor; state.viewHoldT = floor === 0 ? 0 : 18; closeMenu(); log(state, `Viewing ${floors[floor]?.name || 'floor'}.`); }

  function bindButtons() {
    for (let i = 0; i <= 4; i++) { const btn = document.getElementById(`floor-${i}`); if (btn) btn.onclick = () => setFloor(i); }
    document.getElementById('speed-1').onclick = () => { state.speed = 1; }; document.getElementById('speed-3').onclick = () => { state.speed = 3; };
    document.getElementById('pause').onclick = () => { state.paused = !state.paused; }; document.getElementById('reset').onclick = () => location.reload();
    commandPanel.innerHTML = '';
    const buttons = [['Cell', () => cell(selected(state))], ['Save', () => saveGame(state, 1)], ['Load', () => loadGame(state, 1)], ['Stop', () => stopEntity(selected(state))], ['Resume', () => resumeEntity(selected(state))], ['Auto Mode', () => { state.autonomyMode = state.autonomyMode === 'free' ? 'guided' : 'free'; log(state, `Autonomy: ${state.autonomyMode}.`); }]];
    for (const [label, run] of buttons) { const b = document.createElement('button'); b.textContent = label; b.onclick = run; commandPanel.appendChild(b); }
  }

  function renderHud() {
    const actor = selected(state); selectedName.textContent = actor.name; currentAction.textContent = actor.action || 'Idle';
    needs.innerHTML = NEEDS.map(([key, label]) => { const value = Math.round(actor.needs[key] ?? 0); return `<div class="need-row"><span>${label}</span><div class="need-bar"><div class="need-fill" style="width:${value}%"></div></div><span>${value}</span></div>`; }).join('');
    const music = state.music ? `<br>Music: ${state.music.genre}` : ''; const build = state.buildPick ? `<br>Build: tap ${state.buildPick.label} spot` : ''; const delivery = state.delivery ? `<br>Delivery: ${state.delivery.phase}` : ''; const save = state.saveStatus?.message ? `<br>Save: ${state.saveStatus.message}` : `<br>Slot 1: ${slotSummary(1)}`; const trash = state.garbage ? `<br>Trash: ${Math.round(state.garbage.kitchen || 0)}%` : '';
    worldState.innerHTML = `Clock: ${formatTime(state.time)}<br>Area: ${floors[state.floor]?.name || state.floor}<br>View hold: ${Math.ceil(state.viewHoldT || 0)}s<br>Speed: ${state.speed}x<br>Money: $${Math.round(state.money ?? 0)}<br>Autonomy: ${state.autonomyMode}${music}${build}${delivery}${trash}${save}<br>Electric bill: $${Math.max(0, Math.round(state.bill))}`;
    logEl.innerHTML = state.notifications.map(item => `<li>${item}</li>`).join('');
  }

  canvas.addEventListener('click', clickCanvas); document.addEventListener('click', e => { if (!menu.contains(e.target) && e.target !== canvas) closeMenu(); }); bindButtons(); return { renderHud, closeMenu };
}
