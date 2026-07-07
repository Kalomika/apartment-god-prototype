import { handleBuildRequest } from './buildRequests.js';
import { startCookingFlow } from './cooking.js';
import { startOffsite } from './actions.js';
import { buyWorkoutGear, orderFood } from './economy.js';
import { callDogToYard } from './garbage.js';
import { genreList, startMusic } from './music.js';
import { addRequest, updateRequests } from './requests.js';
import { loadGame, saveGame, slotSummary } from './saveSystem.js';
import { startSharedObjectAction } from './sharedActions.js';
import { log, selected } from './state.js';

let built = false;
let open = false;
let tab = 'home';
let dirty = true;
let lastRequestTick = 0;
let els = {};
let pendingTrip = null;
let activeState = null;

export function syncPhoneUi(state) {
  activeState = state;
  if (!built) buildPhoneUi(state);
  if (performance.now() - lastRequestTick > 4000) {
    lastRequestTick = performance.now();
    updateRequests(state);
    if (open && tab === 'requests') dirty = true;
  }
  updatePhoneButton(state);
  if (open && dirty) renderPhone(state);
}

function buildPhoneUi(state) {
  built = true;
  const hud = document.getElementById('hud');
  const wrap = document.getElementById('game-wrap');

  const up = document.createElement('button');
  up.textContent = '↑ Floor';
  up.style.cssText = 'position:absolute;right:12px;top:12px;z-index:6;opacity:.82;padding:8px 10px;border-radius:999px;';
  up.onclick = event => { event.stopPropagation(); state.floor = state.floor === 0 ? 1 : 0; state.viewHoldT = state.buildPick ? 30 : 18; log(state, `Viewing ${floorName(state.floor)}.`); dirty = true; };
  wrap.appendChild(up);

  const down = document.createElement('button');
  down.textContent = '↓ Floor';
  down.style.cssText = 'position:absolute;right:12px;bottom:12px;z-index:6;opacity:.82;padding:8px 10px;border-radius:999px;';
  down.onclick = event => { event.stopPropagation(); state.floor = nextDownFloor(state.floor); state.viewHoldT = state.buildPick ? 30 : 18; log(state, `Viewing ${floorName(state.floor)}.`); dirty = true; };
  wrap.appendChild(down);

  const dock = document.createElement('section');
  dock.id = 'phone-dock';
  dock.style.cssText = 'position:sticky;top:0;z-index:9;margin-bottom:10px;background:rgba(8,10,15,.92);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:10px;backdrop-filter:blur(10px);';

  const button = document.createElement('button');
  button.style.cssText = 'width:100%;font-size:16px;padding:12px;border-radius:14px;';
  button.onclick = event => { event.stopPropagation(); open = !open; dirty = true; fitPhonePanel(); renderPhone(state); };

  const panel = document.createElement('div');
  panel.style.cssText = 'display:none;margin-top:10px;border-radius:18px;background:#10141d;border:2px solid #2d3545;padding:12px;min-height:0;max-height:44vh;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;';
  panel.onclick = event => event.stopPropagation();
  panel.onpointerdown = event => event.stopPropagation();

  dock.appendChild(button);
  dock.appendChild(panel);
  hud.prepend(dock);
  els = { button, panel, hud, wrap };
  window.addEventListener('resize', fitPhonePanel);
  updatePhoneButton(state);
}

function fitPhonePanel() {
  if (!els.panel) return;
  const hudTop = els.hud?.getBoundingClientRect().top ?? Math.round(window.innerHeight * 0.52);
  const available = Math.max(190, window.innerHeight - hudTop - 92);
  els.panel.style.maxHeight = `${available}px`;
}

function nextDownFloor(floor) {
  if (floor === 1) return 0;
  if (floor === 0) return 2;
  if (floor === 2) return 3;
  if (floor === 3) return 4;
  return 0;
}

function floorName(floor) {
  return ['main floor', 'upstairs', 'basement', 'garage', 'backyard'][floor] || 'house';
}

function updatePhoneButton(state) {
  if (!els.button) return;
  els.panel.style.display = open ? 'block' : 'none';
  if (open) fitPhonePanel();
  els.button.textContent = open ? 'Close Cell Phone' : `Cell Phone${state.requests?.some(r => !r.done) ? ' • Request' : ''}`;
}

function renderPhone(state) {
  if (!state || !els.panel) return;
  activeState = state;
  updatePhoneButton(state);
  if (!open) return;
  dirty = false;
  els.panel.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;position:sticky;top:0;background:#10141d;padding-bottom:8px;z-index:2;">
    ${phoneTab('home','Home')}${phoneTab('shop','Shop')}${phoneTab('contacts','Contacts')}${phoneTab('music','Music')}${phoneTab('activities','Acts')}${phoneTab('travel','Travel')}${phoneTab('requests','Requests')}${phoneTab('saves','Saves')}
  </div><div id="phone-screen"></div>`;
  els.panel.querySelectorAll('[data-tab]').forEach(b => b.onclick = event => { event.stopPropagation(); tab = b.dataset.tab; pendingTrip = null; dirty = true; renderPhone(state); els.panel.scrollTop = 0; });
  const screen = els.panel.querySelector('#phone-screen');
  if (tab === 'home') renderHome(screen, state);
  if (tab === 'shop') renderShop(screen, state);
  if (tab === 'contacts') renderContacts(screen, state);
  if (tab === 'music') renderMusic(screen, state);
  if (tab === 'activities') renderActivities(screen, state);
  if (tab === 'travel') renderTravel(screen, state);
  if (tab === 'requests') renderRequests(screen, state);
  if (tab === 'saves') renderSaves(screen, state);
  fitPhonePanel();
}

function phoneTab(id, label) {
  const active = tab === id ? 'background:#f1c66a;color:#111;' : '';
  return `<button data-tab="${id}" style="padding:8px;border-radius:10px;${active}">${label}</button>`;
}

function actionButton(label, fn) {
  const b = document.createElement('button');
  b.textContent = label;
  b.style.cssText = 'display:block;width:100%;margin:7px 0;padding:10px;border-radius:12px;text-align:left;white-space:normal;';
  b.onclick = event => { event.stopPropagation(); fn(); dirty = true; renderPhone(activeState); };
  return b;
}

function renderHome(screen, state) {
  const actor = selected(state);
  screen.innerHTML = `<h3 style="margin:0 0 8px;">${actor.name}'s phone</h3><p style="color:#b6c1d2;margin:0 0 10px;">Money: $${Math.round(state.money || 0)}<br>Autonomy: ${state.autonomyMode}<br>Open requests: ${(state.requests || []).filter(r => !r.done).length}<br>${state.garbage ? `Trash: ${Math.round(state.garbage.kitchen || 0)}%` : ''}</p>`;
}

function renderShop(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Shop / Build</h3><p style="color:#b6c1d2;">Choose an item, then tap placement in the house.</p>';
  const items = [
    ['Order food delivery, $18', () => orderFood(state, actor, false)], ['Buy workout gear, $220', () => buyWorkoutGear(state, actor)],
    ['Build bookshelf', () => handleBuildRequest(state, actor, 'bookshelf')], ['Build couch', () => handleBuildRequest(state, actor, 'couch')],
    ['Build desk', () => handleBuildRequest(state, actor, 'desk')], ['Build TV', () => handleBuildRequest(state, actor, 'tv')],
    ['Build stereo', () => handleBuildRequest(state, actor, 'stereo')], ['Build dog bowl', () => handleBuildRequest(state, actor, 'dog bowl')],
    ['Build pool table', () => handleBuildRequest(state, actor, 'pool table')], ['Build arcade machine', () => handleBuildRequest(state, actor, 'arcade')],
    ['Build console setup', () => handleBuildRequest(state, actor, 'console')], ['Build dart board', () => handleBuildRequest(state, actor, 'dart board')],
    ['Build treadmill', () => handleBuildRequest(state, actor, 'treadmill')], ['Build weight bench', () => handleBuildRequest(state, actor, 'weight bench')],
    ['Build trash can', () => handleBuildRequest(state, actor, 'trash can')], ['Custom build request', () => handleBuildRequest(state, actor, prompt('What do you want built or ordered?') || '')]
  ];
  for (const [label, fn] of items) screen.appendChild(actionButton(label, fn));
}

function renderContacts(screen, state) { screen.innerHTML = '<h3>Contacts</h3>'; for (const e of state.entities) screen.appendChild(actionButton(`${e.name} • select`, () => { state.selectedId = e.id; log(state, `${e.name} selected from contacts.`); })); }
function renderMusic(screen, state) { const actor = selected(state); screen.innerHTML = `<h3>Music</h3><p style="color:#b6c1d2;">Pretend music only. Genres: ${genreList()}</p>`; for (const g of ['rap','rock','classical','jazz','afrobeat','electronic','cyberpunk','ambient']) screen.appendChild(actionButton(`Play ${g}`, () => startMusic(state, actor, g))); }

function renderActivities(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Activities</h3>';
  const activities = [
    ['Cook for myself', () => startCookingFlow(state, actor, 'self')], ['Cook for the house', () => startCookingFlow(state, actor, 'house')],
    ['Watch TV together', () => startSharedObjectAction(state, actor, 'tv', 'watch_together')], ['Go to bed together', () => startSharedObjectAction(state, actor, 'bed', 'bed_together')],
    ['Practice pool', () => startSharedObjectAction(state, actor, 'pool_table', 'pool_solo')], ['Play pool together', () => startSharedObjectAction(state, actor, 'pool_table', 'pool_together')],
    ['Play arcade', () => startSharedObjectAction(state, actor, 'arcade_machine', 'arcade')], ['Play console', () => startSharedObjectAction(state, actor, 'game_console', 'console_game')],
    ['Throw darts', () => startSharedObjectAction(state, actor, 'dartboard', 'darts')], ['Run treadmill', () => startSharedObjectAction(state, actor, 'treadmill', 'treadmill')],
    ['Lift weights', () => startSharedObjectAction(state, actor, 'weight_bench', 'lift_weights')], ['Hit heavy bag', () => startSharedObjectAction(state, actor, 'heavy_bag', 'heavy_bag')],
    ['Swim', () => startSharedObjectAction(state, actor, 'swim_pool', 'swim')], ['Take trash out', () => startSharedObjectAction(state, actor, 'trash_kitchen', 'take_trash_out')],
    ['Call dog to backyard', () => callDogToYard(state, actor)]
  ];
  for (const [label, fn] of activities) screen.appendChild(actionButton(label, fn));
}

function renderTravel(screen, state) {
  const actor = selected(state);
  if (pendingTrip) return renderPartyPicker(screen, state, actor, pendingTrip);
  screen.innerHTML = '<h3>Travel / Go out</h3><p style="color:#b6c1d2;">Pick an outing, then choose who goes.</p>';
  for (const [label, id] of [['Work','work'], ['Quick errand','errand'], ['Mall trip','mall'], ['Movie theater','movies'], ['Date night','date']]) screen.appendChild(actionButton(label, () => { pendingTrip = { id, chosen: [] }; }));
}

function renderPartyPicker(screen, state, actor, trip) {
  const chosen = new Set(trip.chosen || []);
  screen.innerHTML = `<h3>${trip.id.replaceAll('_',' ')}</h3><p style="color:#b6c1d2;">Choose who goes. Press Done with no picks to go alone.</p>`;
  for (const e of state.entities.filter(e => e.id !== actor.id && !e.hidden)) {
    screen.appendChild(actionButton(`${chosen.has(e.id) ? '✓ ' : ''}Invite ${e.name}`, () => { if (chosen.has(e.id)) chosen.delete(e.id); else chosen.add(e.id); trip.chosen = [...chosen]; }));
  }
  screen.appendChild(actionButton('Invite all household', () => { trip.chosen = state.entities.filter(e => e.id !== actor.id && !e.hidden).map(e => e.id); }));
  screen.appendChild(actionButton('Done, start outing', () => { startOffsite(state, actor, trip.id, trip.chosen || []); pendingTrip = null; tab = 'home'; }));
  screen.appendChild(actionButton('Cancel', () => { pendingTrip = null; }));
}

function renderRequests(screen, state) { const actor = selected(state); screen.innerHTML = '<h3>Requests</h3>'; screen.appendChild(actionButton('Ask selected character what they want', () => addRequest(state, actor, `${actor.name} wants attention or a new activity.`, 'manual'))); const requests = state.requests || []; if (!requests.length) screen.insertAdjacentHTML('beforeend', '<p style="color:#b6c1d2;">No requests yet.</p>'); for (const r of requests) { const p = document.createElement('p'); p.style.cssText = 'padding:8px;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#f4f7fb;'; p.textContent = `${r.done ? 'Done' : 'Open'} • ${r.actorName}: ${r.text}`; screen.appendChild(p); } }
function renderSaves(screen, state) { screen.innerHTML = '<h3>Saves</h3>'; for (const slot of [1,2,3]) { screen.appendChild(actionButton(`Save Slot ${slot}: ${slotSummary(slot)}`, () => { saveGame(state, slot); log(state, `Saved slot ${slot}.`); })); screen.appendChild(actionButton(`Load Slot ${slot}`, () => { if (loadGame(state, slot)) log(state, `Loaded slot ${slot}.`); else log(state, `Slot ${slot} is empty.`); })); } }
