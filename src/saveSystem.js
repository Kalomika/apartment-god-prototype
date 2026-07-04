import { log } from './state.js';
import { objects } from './world.js';

const PREFIX = 'apartment_god_slot_';
const AUTOSAVE_SLOT = 'autosave';
const SAVE_VERSION = 2;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slotKey(slot = 1) {
  return `${PREFIX}${slot}`;
}

function cleanStateForSave(state) {
  const saved = clone(state);
  saved.menu = null;
  saved.assign = null;
  saved.movePick = null;
  saved.buildPick = null;
  saved.phone = null;
  saved.paused = false;
  saved.autosaveT = 0;
  saved.saveStatus = saved.saveStatus || {};
  return saved;
}

function restoreObjects(savedObjects) {
  if (!Array.isArray(savedObjects)) return false;
  objects.length = 0;
  for (const obj of savedObjects) objects.push(obj);
  return true;
}

function restoreWholeState(target, saved) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, saved);
  target.menu = null;
  target.assign = null;
  target.movePick = null;
  target.buildPick = null;
  target.phone = null;
  target.paused = false;
  target.autosaveT = 0;
  target.saveStatus ??= {};
}

function readSlot(slot = 1) {
  const raw = localStorage.getItem(slotKey(slot));
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveGame(state, slot = 1) {
  try {
    const data = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      slot,
      state: cleanStateForSave(state),
      objects: clone(objects)
    };
    localStorage.setItem(slotKey(slot), JSON.stringify(data));
    state.saveStatus = { message: slot === AUTOSAVE_SLOT ? 'Autosaved' : `Saved slot ${slot}`, slot, savedAt: data.savedAt };
    if (slot !== AUTOSAVE_SLOT) log(state, `Saved game to slot ${slot}.`);
    return true;
  } catch (error) {
    state.saveStatus = { message: 'Save failed' };
    log(state, 'Save failed. Browser storage may be blocked or full.');
    console.error(error);
    return false;
  }
}

export function loadGame(state, slot = 1) {
  let data = null;
  try {
    data = readSlot(slot) || readSlot(AUTOSAVE_SLOT);
  } catch (error) {
    log(state, 'Save file is corrupt.');
    console.error(error);
    return false;
  }
  if (!data) {
    state.saveStatus = { message: 'No save found' };
    log(state, `No save found in slot ${slot}.`);
    return false;
  }

  let restoredObjects = false;
  if (data.version >= 2 && data.state) {
    restoredObjects = restoreObjects(data.objects);
    restoreWholeState(state, data.state);
  } else {
    restoreLegacyState(state, data);
  }

  recoverMissingSavedObjects(state, restoredObjects);
  state.saveStatus = { message: `Loaded slot ${data.slot || slot}`, slot: data.slot || slot, savedAt: data.savedAt || null };
  log(state, `Loaded saved game from slot ${data.slot || slot}.`);
  return true;
}

function restoreLegacyState(state, data) {
  state.time = data.time ?? state.time;
  state.money = data.money ?? state.money;
  state.bill = data.bill ?? state.bill;
  state.floor = data.floor ?? state.floor;
  state.selectedId = data.selectedId ?? state.selectedId;
  state.autonomyMode = data.autonomyMode ?? state.autonomyMode;
  state.roomLights = data.roomLights || state.roomLights;
  state.objectState = { ...state.objectState, ...(data.objectState || {}) };
  state.routines = data.routines || [];
  state.appointments = data.appointments || [];
  state.requests = data.requests || [];
  for (const saved of data.entities || []) {
    const e = state.entities.find(x => x.id === saved.id);
    if (!e) continue;
    e.floor = saved.floor;
    e.x = saved.x;
    e.y = saved.y;
    e.needs = saved.needs || e.needs;
    e.skills = saved.skills || e.skills;
    e.skillCaps = saved.skillCaps || e.skillCaps;
    e.traits = saved.traits || e.traits;
    e.path = [];
    e.target = null;
    e.action = 'Loaded';
    e.actionT = 0;
    e.pose = 'stand';
    e.hidden = false;
  }
}

function recoverMissingSavedObjects(state, restoredObjects) {
  state.objectState ??= {};
  const needsBookshelf = state.objectState.bookshelf || state.objectState.library;
  const hasBookshelf = objects.some(o => o.kind === 'bookshelf');
  if (!needsBookshelf || hasBookshelf) return;

  objects.push({
    id: 'bookshelf_recovered_1',
    label: 'Recovered Bookshelf',
    kind: 'bookshelf',
    floor: 0,
    room: 'living',
    x: 352,
    y: 174,
    w: 78,
    h: 118,
    solid: true,
    facing: 'west'
  });
  state.objectState.bookshelf = true;
  log(state, restoredObjects ? 'Recovered missing bookshelf from saved library flag.' : 'Recovered bookshelf from older save data.');
}

export function clearSaveSlot(state, slot = 1) {
  localStorage.removeItem(slotKey(slot));
  state.saveStatus = { message: `Cleared slot ${slot}` };
  log(state, `Cleared save slot ${slot}.`);
}

export function updateAutosave(state, dt) {
  state.autosaveT = (state.autosaveT || 0) + dt;
  if (state.autosaveT < 30) return;
  state.autosaveT = 0;
  saveGame(state, AUTOSAVE_SLOT);
}

export function slotSummary(slot = 1) {
  try {
    const data = readSlot(slot);
    if (!data) return 'Empty';
    if (data.version >= 2) {
      const time = data.state?.time ?? 0;
      const money = data.state?.money ?? 0;
      const savedAt = data.savedAt ? new Date(data.savedAt).toLocaleTimeString() : 'saved';
      const built = Array.isArray(data.objects) ? data.objects.filter(o => o.kind === 'bookshelf' || o.id?.includes('bookshelf')).length : 0;
      const builtText = built ? `, ${built} shelf` : '';
      return `${Math.round(time / 60)}h, $${Math.round(money)}, ${savedAt}${builtText}`;
    }
    return `Day time ${Math.round((data.time || 0) / 60)}h, $${Math.round(data.money || 0)}`;
  } catch {
    return 'Corrupt';
  }
}
