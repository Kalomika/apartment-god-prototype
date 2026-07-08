import { handleBuildRequest } from './buildRequests.js';
import { startCookingFlow } from './cooking.js';
import { startOffsite } from './actions.js';
import { buyWorkoutGear, orderFood } from './economy.js';
import { callDogToYard } from './garbage.js';
import { buyInvestment, INVESTMENTS, investmentSummary } from './investmentSystem.js';
import { genreList, startMusic } from './music.js';
import { addRequest, updateRequests } from './requests.js';
import { loadGame, saveGame, slotSummary } from './saveSystem.js';
import { startSharedObjectAction } from './sharedActions.js';
import { guidedInterrupt } from './guidedControl.js';
import { log, selected } from './state.js';
import { DAILY_DESTINATIONS, isDestinationOpen, VACATION_DESTINATIONS } from './travelLocations.js';
import { navigateView } from './cameraNavigation.js';

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
  const wrap = document.getElementById('game-wrap');
  const controlBar = document.getElementById('game-control-bar') || wrap;

  const verticalDock = document.createElement('section');
  verticalDock.id = 'vertical-nav-dock';
  verticalDock.setAttribute('aria-label', 'Vertical floor controls');

  const up = document.createElement('button');
  up.textContent = '↑ Up';
  up.className = 'vertical-screen-button';
  up.type = 'button';
  up.onclick = event => {
    event.stopPropagation();
    navigateView(state, upTarget(state.floor), floorName(upTarget(state.floor)), 'vertical-button');
    dirty = true;
  };

  const down = document.createElement('button');
  down.textContent = '↓ Down';
  down.className = 'vertical-screen-button';
  down.type = 'button';
  down.onclick = event => {
    event.stopPropagation();
    navigateView(state, downTarget(state.floor), floorName(downTarget(state.floor)), 'vertical-button');
    dirty = true;
  };

  verticalDock.appendChild(up);
  verticalDock.appendChild(down);
  wrap.appendChild(verticalDock);

  const dock = document.createElement('section');
  dock.id = 'phone-dock';
  dock.className = 'control-bar-group phone-control-group';

  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Cell Phone');
  button.className = 'phone-float-button control-bar-button icon-control-button';
  button.type = 'button';
  button.onclick = event => {
    event.stopPropagation();
    open = !open;
    dirty = true;
    fitPhonePanel();
    renderPhone(state);
  };

  const panel = document.createElement('div');
  panel.id = 'phone-panel';
  panel.className = 'phone-panel';
  panel.onclick = event => event.stopPropagation();
  panel.onpointerdown = event => event.stopPropagation();

  dock.appendChild(button);
  controlBar.appendChild(dock);
  document.body.appendChild(panel);

  els = { button, panel, up, down, dock, verticalDock };
  window.addEventListener('resize', fitPhonePanel);
  updatePhoneButton(state);
}

function fitPhonePanel() {
  if (!els.panel) return;
  const max = Math.max(260, window.innerHeight - 120);
  els.panel.style.maxHeight = `${Math.min(max, Math.round(window.innerHeight * 0.74))}px`;
}

function upTarget(floor) {
  if (floor === 2) return 0;
  if (floor === 0 || floor === 3 || floor === 4) return 1;
  return 1;
}

function downTarget(floor) {
  if (floor === 1) return 0;
  if (floor === 0 || floor === 3 || floor === 4) return 2;
  return 2;
}

function floorName(floor) {
  return ['Main House', 'Upstairs', 'Basement', 'Garage Area', 'Backyard Area'][floor] || 'House';
}

function updatePhoneButton(state) {
  if (!els.button || !els.panel) return;
  els.panel.style.display = open ? 'block' : 'none';
  if (open) fitPhonePanel();
  const hasRequest = state.requests?.some(r => !r.done);
  els.button.textContent = hasRequest && !open ? '📱•' : '📱';
  els.button.title = open ? 'Close Cell Phone' : 'Open Cell Phone';
}

function renderPhone(state) {
  if (!state || !els.panel) return;
  activeState = state;
  updatePhoneButton(state);
  if (!open) return;

  dirty = false;
  els.panel.innerHTML = `
    <button id="phone-close" class="phone-close">Close Cell Phone</button>
    <div class="phone-tabs">
      ${phoneTab('home', 'Home')}
      ${phoneTab('shop', 'Shop')}
      ${phoneTab('contacts', 'Contacts')}
      ${phoneTab('music', 'Music')}
      ${phoneTab('activities', 'Acts')}
      ${phoneTab('travel', 'Travel')}
      ${phoneTab('invest', 'Invest')}
      ${phoneTab('requests', 'Requests')}
      ${phoneTab('saves', 'Saves')}
    </div>
    <div id="phone-screen" class="phone-screen"></div>
  `;

  els.panel.querySelector('#phone-close').onclick = event => {
    event.stopPropagation();
    open = false;
    updatePhoneButton(state);
  };

  els.panel.querySelectorAll('[data-tab]').forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      tab = button.dataset.tab;
      pendingTrip = null;
      dirty = true;
      renderPhone(state);
      els.panel.scrollTop = 0;
    };
  });

  const screen = els.panel.querySelector('#phone-screen');
  if (tab === 'home') renderHome(screen, state);
  if (tab === 'shop') renderShop(screen, state);
  if (tab === 'contacts') renderContacts(screen, state);
  if (tab === 'music') renderMusic(screen, state);
  if (tab === 'activities') renderActivities(screen, state);
  if (tab === 'travel') renderTravel(screen, state);
  if (tab === 'invest') renderInvest(screen, state);
  if (tab === 'requests') renderRequests(screen, state);
  if (tab === 'saves') renderSaves(screen, state);
  fitPhonePanel();
}

function phoneTab(id, label) {
  const active = tab === id ? ' active' : '';
  return `<button data-tab="${id}" class="phone-tab${active}">${label}</button>`;
}

function actionButton(label, fn) {
  const button = document.createElement('button');
  button.textContent = label;
  button.className = 'phone-action-button';
  button.onclick = event => {
    event.stopPropagation();
    fn();
    dirty = true;
    renderPhone(activeState);
  };
  return button;
}

function guidedPhoneAction(state, actor, fn) {
  guidedInterrupt(state, actor);
  return fn();
}

function renderHome(screen, state) {
  const actor = selected(state);
  screen.innerHTML = `
    <h3>${actor.name}'s phone</h3>
    <p class="phone-muted">
      Money: $${Math.round(state.money || 0)}<br>
      Autonomy: ${state.autonomyMode}<br>
      Open requests: ${(state.requests || []).filter(r => !r.done).length}<br>
      Free vacation tickets: ${state.rewards?.freeTickets?.vacation_any || 0}<br>
      ${state.garbage ? `Trash: ${Math.round(state.garbage.kitchen || 0)}%` : ''}
    </p>
  `;
}

function renderShop(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Shop / Build</h3><p class="phone-muted">Choose an item, then tap placement in the house.</p>';
  const items = [
    ['Order food delivery, $18', () => guidedPhoneAction(state, actor, () => orderFood(state, actor, false))],
    ['Buy workout gear, $220', () => buyWorkoutGear(state, actor)],
    ['Build bookshelf', () => handleBuildRequest(state, actor, 'bookshelf')],
    ['Build couch', () => handleBuildRequest(state, actor, 'couch')],
    ['Build desk', () => handleBuildRequest(state, actor, 'desk')],
    ['Build TV', () => handleBuildRequest(state, actor, 'tv')],
    ['Build stereo', () => handleBuildRequest(state, actor, 'stereo')],
    ['Build dog bowl', () => handleBuildRequest(state, actor, 'dog bowl')],
    ['Build pool table', () => handleBuildRequest(state, actor, 'pool table')],
    ['Build arcade machine', () => handleBuildRequest(state, actor, 'arcade')],
    ['Build console setup', () => handleBuildRequest(state, actor, 'console')],
    ['Build dart board', () => handleBuildRequest(state, actor, 'dart board')],
    ['Build treadmill', () => handleBuildRequest(state, actor, 'treadmill')],
    ['Build weight bench', () => handleBuildRequest(state, actor, 'weight bench')],
    ['Build trash can', () => handleBuildRequest(state, actor, 'trash can')],
    ['Custom build request', () => handleBuildRequest(state, actor, prompt('What do you want built or ordered?') || '')]
  ];
  appendActions(screen, items);
}

function renderContacts(screen, state) {
  screen.innerHTML = '<h3>Contacts</h3>';
  for (const entity of state.entities) {
    screen.appendChild(actionButton(`${entity.name} • select`, () => {
      state.selectedId = entity.id;
      log(state, `${entity.name} selected from contacts.`);
    }));
  }
}

function renderMusic(screen, state) {
  const actor = selected(state);
  screen.innerHTML = `<h3>Music</h3><p class="phone-muted">Pretend music only. Genres: ${genreList()}</p>`;
  for (const genre of ['rap', 'rock', 'classical', 'jazz', 'afrobeat', 'electronic', 'cyberpunk', 'ambient']) {
    screen.appendChild(actionButton(`Play ${genre}`, () => guidedPhoneAction(state, actor, () => startMusic(state, actor, genre))));
  }
}

function renderActivities(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Activities</h3>';
  appendActions(screen, [
    ['Cook for myself', () => guidedPhoneAction(state, actor, () => startCookingFlow(state, actor, 'self'))],
    ['Cook for the house', () => guidedPhoneAction(state, actor, () => startCookingFlow(state, actor, 'house'))],
    ['Watch TV together', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'tv', 'watch_together'))],
    ['Go to bed together', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'bed', 'bed_together'))],
    ['Practice pool', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'pool_table', 'pool_solo'))],
    ['Play pool together', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'pool_table', 'pool_together'))],
    ['Play arcade', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'arcade_machine', 'arcade'))],
    ['Play console', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'game_console', 'console_game'))],
    ['Throw darts', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'dartboard', 'darts'))],
    ['Run treadmill', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'treadmill', 'treadmill'))],
    ['Lift weights', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'weight_bench', 'lift_weights'))],
    ['Hit heavy bag', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'heavy_bag', 'heavy_bag'))],
    ['Swim', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'swim_pool', 'swim'))],
    ['Take trash out', () => guidedPhoneAction(state, actor, () => startSharedObjectAction(state, actor, 'trash_kitchen', 'take_trash_out'))],
    ['Call dog to backyard', () => guidedPhoneAction(state, actor, () => callDogToYard(state, actor))]
  ]);
}

function renderTravel(screen, state) {
  const actor = selected(state);
  if (pendingTrip) return renderPartyPicker(screen, state, actor, pendingTrip);

  screen.innerHTML = '<h3>Travel / Go out</h3><p class="phone-muted">Pick an outing, then choose who goes.</p><h4>Daily</h4>';
  for (const item of DAILY_DESTINATIONS) screen.appendChild(destinationButton(state, item));
  screen.insertAdjacentHTML('beforeend', '<h4>Vacations</h4>');
  for (const item of VACATION_DESTINATIONS) screen.appendChild(destinationButton(state, item));
}

function destinationButton(state, item) {
  const openNow = isDestinationOpen(state, item);
  const pass = item.id.startsWith('vacation_') && state.rewards?.freeTickets?.vacation_any;
  const cost = pass ? 'free ticket' : `$${item.cost || 0}`;
  const closed = openNow ? '' : ' CLOSED NOW';
  return actionButton(`${item.label} • ${cost}${closed}`, () => {
    pendingTrip = { id: item.id, chosen: [] };
  });
}

function renderPartyPicker(screen, state, actor, trip) {
  const chosen = new Set(trip.chosen || []);
  screen.innerHTML = `<h3>${trip.id.replaceAll('_', ' ')}</h3><p class="phone-muted">Choose who goes. Press Done with no picks to go alone.</p>`;

  for (const entity of state.entities.filter(e => e.id !== actor.id && !e.hidden)) {
    screen.appendChild(actionButton(`${chosen.has(entity.id) ? '✓ ' : ''}Invite ${entity.name}`, () => {
      if (chosen.has(entity.id)) chosen.delete(entity.id);
      else chosen.add(entity.id);
      trip.chosen = [...chosen];
    }));
  }

  screen.appendChild(actionButton('Invite all household', () => {
    trip.chosen = state.entities.filter(e => e.id !== actor.id && !e.hidden).map(e => e.id);
  }));
  screen.appendChild(actionButton('Done, start outing', () => {
    guidedPhoneAction(state, actor, () => startOffsite(state, actor, trip.id, trip.chosen || []));
    pendingTrip = null;
    tab = 'home';
  }));
  screen.appendChild(actionButton('Cancel', () => { pendingTrip = null; }));
}

function renderInvest(screen, state) {
  screen.innerHTML = `<h3>Investments</h3><p class="phone-muted">${investmentSummary(state)}</p>`;
  for (const item of INVESTMENTS) {
    screen.appendChild(actionButton(`Buy ${item.label} • $${item.buyIn}`, () => buyInvestment(state, item.id)));
  }
}

function renderRequests(screen, state) {
  const actor = selected(state);
  screen.innerHTML = '<h3>Requests</h3>';
  screen.appendChild(actionButton('Ask selected character what they want', () => {
    addRequest(state, actor, `${actor.name} wants attention or a new activity.`, 'manual');
  }));

  const requests = state.requests || [];
  if (!requests.length) screen.insertAdjacentHTML('beforeend', '<p class="phone-muted">No requests yet.</p>');

  for (const request of requests) {
    const p = document.createElement('p');
    p.className = 'phone-request-card';
    p.textContent = `${request.done ? 'Done' : 'Open'} • ${request.actorName}: ${request.text}`;
    screen.appendChild(p);
  }
}

function renderSaves(screen, state) {
  screen.innerHTML = '<h3>Saves</h3>';
  for (const slot of [1, 2, 3]) {
    screen.appendChild(actionButton(`Save Slot ${slot}: ${slotSummary(slot)}`, () => {
      saveGame(state, slot);
      log(state, `Saved slot ${slot}.`);
    }));
    screen.appendChild(actionButton(`Load Slot ${slot}`, () => {
      if (loadGame(state, slot)) log(state, `Loaded slot ${slot}.`);
      else log(state, `Slot ${slot} is empty.`);
    }));
  }
}

function appendActions(screen, items) {
  for (const [label, fn] of items) screen.appendChild(actionButton(label, fn));
}
