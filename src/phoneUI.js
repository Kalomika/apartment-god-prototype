import { handleBuildRequest } from './buildRequests.js';
import { startCookingFlow } from './cooking.js';
import { startOffsite } from './actions.js';
import { buyWorkoutGear, orderFood } from './economy.js';
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

export function syncPhoneUi(state) {
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
  up.onclick = event => { event.stopPropagation(); state.floor = 1; state.viewHoldT = state.buildPick ? 30 : 18; log(state, state.buildPick ? 'Tap upstairs placement spot.' : 'Viewing upstairs.'); dirty = true; };
  wrap.appendChild(up);

  const down = document.createElement('button');
  down.textContent = '↓ Floor';
  down.style.cssText = 'position:absolute;right:12px;bottom:12px;z-index:6;opacity:.82;padding:8px 10px;border-radius:999px;';
  down.onclick = event => { event.stopPropagation(); state.floor = 0; state.viewHoldT = state.buildPick ? 30 : 0; log(state, state.buildPick ? 'Tap downstairs placement spot.' : 'Viewing downstairs.'); dirty = true; };
  wrap.appendChild(down);

  const dock = document.createElement('section');
  dock.id = 'phone-dock';
  dock.style.cssText = 'position:sticky;top:0;z-index:9;margin-bottom:10px;background:rgba(8,10,15,.92);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:10px;backdrop-filter:blur(10px);';

  const button = document.createElement('button');
  button.style.cssText = 'width:100%;font-size:16px;padding:12px;border-radius:14px;';
  button.onclick = event => { event.stopPropagation(); open = !open; dirty = true; renderPhone(state); };

  const panel = document.createElement('div');
  panel.style.cssText = 'display:none;margin-top:10px;border-radius:18px;background:#10141d;border:2px solid #2d3545;padding:12px;min-height:280px;';
  panel.onclick = event => event.stopPropagation();

  dock.appendChild(button);
  dock.appendChild(panel);
  hud.prepend(dock);
  els = { button, panel };
  updatePhoneButton(state);
}

function updatePhoneButton(state) {
  if (!els.button) return;
  els.panel.style.display = open ? 'block' : 'none';
  els.button.textContent = open ? 'Close Cell Phone' : `Cell Phone${state.requests?.some(r => !r.done) ? ' • Request' : ''}`;
}

function renderPhone(state) {
  if (!els.panel) return;
  updatePhoneButton(state);
  if (!open) return;
  dirty = false;
  els.panel.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;">
    ${phoneTab('home','Home')}${phoneTab('shop','Shop')}${phoneTab('contacts','Contacts')}${phoneTab('music','Music')}${phoneTab('activities','Acts')}${phoneTab('requests','Requests')}${phoneTab('saves','Saves')}
  </div><div id="phone-screen"></div>`;
  els.panel.querySelectorAll('[data-tab]').forEach(b => b.onclick = event => { event.stopPropagation(); tab = b.dataset.tab; dirty = true; renderPhone(state); });
  const screen = els.panel.querySelector('#phone-screen');
  if (tab === 'home') renderHome(screen, state);
  if (tab === 'shop') renderShop(screen, state);
  if (tab === 'contacts') renderContacts(screen, state);
  if (tab === 'music') renderMusic(screen, state);
  if (tab === 'activities') renderActivities(screen, state);
  if (tab === 'requests') renderRequests(screen, state);
  if (tab === 'saves') renderSaves(screen, state);
}

function phoneTab(id, label) {
  const active = tab === id ? 'background:#f1c66a;color:#111;' : '';
  return `<button data-tab="${id}" style="padding:8px;border-radius:10px;${active}">${label}</button>`;
}

function actionButton(label, fn) {
  const b = document.createElement('button');
  b.textContent = label;
  b.style.cssText = 'display:block;width:100%;margin:7px 0;padding:10px;border-radius:12px;text-align:left;';
  b.onclick = event => { event.stopPropagation(); fn(); dirty = true; };
  return b;
}

function renderHome(screen, state) {
  const actor = selected(state);
  screen.innerHTML = `<h3 style="margin:0 0 8px;">${actor.name}'s phone</h3><p style="color:#b6c1d2;margin:0 0 10px;">Money: $${Math.round(state.money || 0)}<br>Autonomy: ${state.autonomyMode}<br>Open requests: ${(state.requests || []).filter(r => !r.done).length}</p>`;
}

function renderShop(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Shop</h3>';
  screen.appendChild(actionButton('Order food delivery, $18', () => orderFood(state, actor, false)));
  screen.appendChild(actionButton('Buy workout gear, $220', () => buyWorkoutGear(state, actor)));
  screen.appendChild(actionButton('Build request: bookshelf', () => handleBuildRequest(state, actor, 'bookshelf')));
  screen.appendChild(actionButton('Custom build request', () => handleBuildRequest(state, actor, prompt('What do you want built or ordered?') || '')));
}

function renderContacts(screen, state) {
  screen.innerHTML = '<h3>Contacts</h3>';
  for (const e of state.entities) screen.appendChild(actionButton(`${e.name} • select`, () => { state.selectedId = e.id; log(state, `${e.name} selected from contacts.`); }));
}

function renderMusic(screen, state) {
  const actor = selected(state);
  screen.innerHTML = `<h3>Music</h3><p style="color:#b6c1d2;">Pretend music only. Genres: ${genreList()}</p>`;
  for (const g of ['rap','rock','classical','jazz','afrobeat','electronic']) screen.appendChild(actionButton(`Play ${g}`, () => startMusic(state, actor, g)));
}

function renderActivities(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Activities</h3>';
  screen.appendChild(actionButton('Cook for myself', () => startCookingFlow(state, actor, 'self')));
  screen.appendChild(actionButton('Cook for the house', () => startCookingFlow(state, actor, 'house')));
  screen.appendChild(actionButton('Watch TV together', () => startSharedObjectAction(state, actor, 'tv', 'watch_together')));
  screen.appendChild(actionButton('Go to bed together', () => startSharedObjectAction(state, actor, 'bed', 'bed_together')));
  screen.appendChild(actionButton('Private moment upstairs', () => startSharedObjectAction(state, actor, 'bed', 'intimacy')));
  screen.appendChild(actionButton('Movie theater, together', () => startOffsite(state, actor, 'date')));
}

function renderRequests(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Requests</h3>';
  screen.appendChild(actionButton('Ask selected character what they want', () => addRequest(state, actor, `${actor.name} wants attention or a new activity.`, 'manual')));
  const requests = state.requests || [];
  if (!requests.length) screen.insertAdjacentHTML('beforeend', '<p style="color:#b6c1d2;">No requests yet.</p>');
  for (const r of requests) {
    const p = document.createElement('p');
    p.style.cssText = 'padding:8px;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#f4f7fb;';
    p.textContent = `${r.done ? 'Done' : 'Open'} • ${r.actorName}: ${r.text}`;
    screen.appendChild(p);
  }
}

function renderSaves(screen, state) {
  screen.innerHTML = '<h3>Saves</h3>';
  for (const slot of [1,2,3]) {
    screen.appendChild(actionButton(`Save Slot ${slot}: ${slotSummary(slot)}`, () => { saveGame(state, slot); log(state, `Saved slot ${slot}.`); }));
    screen.appendChild(actionButton(`Load Slot ${slot}`, () => { if (loadGame(state, slot)) log(state, `Loaded slot ${slot}.`); else log(state, `Slot ${slot} is empty.`); }));
  }
}
