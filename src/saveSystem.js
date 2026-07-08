import { log } from './state.js';
import { objects } from './world.js';

const PREFIX = 'apartment_god_slot_';
const AUTOSAVE_SLOT = 'autosave';
const TEST_AUTOSAVE_KEY = 'apartment_god_test_refresh_state_v3';
const RESET_GUARD_KEY = 'apartment_god_reset_guard_v1';
const SAVE_VERSION = 2;
const TEST_SAVE_VERSION = 3;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slotKey(slot = 1) {
  return `${PREFIX}${slot}`;
}

function scrubTransientState(saved) {
  saved.menu = null;
  saved.assign = null;
  saved.movePick = null;
  saved.buildPick = null;
  saved.partyPick = null;
  saved.paused = false;
  saved.autosaveT = 0;
  saved.testAutosaveT = 0;
  saved.saveStatus = saved.saveStatus || {};
  saved.cameraGestureActive = false;
  saved.suppressNextCanvasClick = false;
  saved.cameraTransition = null;
  return saved;
}

function cleanStateForSave(state) {
  return scrubTransientState(clone(state));
}

function cleanStateForRefreshSave(state) {
  const saved = scrubTransientState(clone(state));
  saved.saveStatus = null;
  return saved;
}

function restoreObjects(savedObjects) {
  if (!Array.isArray(savedObjects)) return;
  objects.length = 0;
  for (const obj of savedObjects) objects.push(obj);
}

function restoreWholeState(target, saved) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, saved);
  scrubTransientState(target);
  target.saveStatus ??= {};
}

function mergeRefreshState(target, saved) {
  const baseEntities = new Map((target.entities || []).map(entity => [entity.id, entity]));
  const restoredEntities = Array.isArray(saved.entities)
    ? saved.entities.map(entity => ({ ...(baseEntities.get(entity.id) || {}), ...entity }))
    : target.entities;

  Object.assign(target, {
    ...target,
    ...saved,
    roomLights: { ...(target.roomLights || {}), ...(saved.roomLights || {}) },
    objectState: { ...(target.objectState || {}), ...(saved.objectState || {}) },
    investments: { ...(target.investments || {}), ...(saved.investments || {}) },
    rewards: { ...(target.rewards || {}), ...(saved.rewards || {}) },
    secretLog: { ...(target.secretLog || {}), ...(saved.secretLog || {}) },
    careers: { ...(target.careers || {}), ...(saved.careers || {}) },
    garbage: { ...(target.garbage || {}), ...(saved.garbage || {}) },
    entities: restoredEntities
  });

  scrubTransientState(target);
  target.saveStatus = { message: 'Restored refresh state', slot: 'refresh', savedAt: null };
}

function readSlot(slot = 1) {
  const raw = localStorage.getItem(slotKey(slot));
  if (!raw) return null;
  return JSON.parse(raw);
}

function readRefreshSave() {
  const raw = localStorage.getItem(TEST_AUTOSAVE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function resetGuardActive() {
  return sessionStorage.getItem(RESET_GUARD_KEY) === '1';
}

function clearResetGuard() {
  sessionStorage.removeItem(RESET_GUARD_KEY);
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

export function saveRefreshState(state) {
  if (state?.resetting || resetGuardActive()) return false;
  try {
    const data = {
      version: TEST_SAVE_VERSION,
      savedAt: new Date().toISOString(),
      state: cleanStateForRefreshSave(state)
    };
    localStorage.setItem(TEST_AUTOSAVE_KEY, JSON.stringify(data));
    state.saveStatus = { message: 'Refresh state saved', slot: 'refresh', savedAt: data.savedAt };
    return true;
  } catch (error) {
    state.saveStatus = { message: 'Refresh save failed' };
    console.error(error);
    return false;
  }
}

export function loadRefreshState(state) {
  if (resetGuardActive()) {
    localStorage.removeItem(TEST_AUTOSAVE_KEY);
    clearResetGuard();
    state.saveStatus = { message: 'Reset fresh state loaded' };
    return false;
  }
  let data = null;
  try {
    data = readRefreshSave();
  } catch (error) {
    localStorage.removeItem(TEST_AUTOSAVE_KEY);
    state.saveStatus = { message: 'Refresh state corrupt' };
    console.error(error);
    return false;
  }
  if (!data?.state) return false;
  mergeRefreshState(state, data.state);
  state.saveStatus = { message: 'Restored refresh state', slot: 'refresh', savedAt: data.savedAt || null };
  log(state, 'Restored last refresh test state. Reset clears it and starts fresh.');
  return true;
}

export function clearRefreshState(state = null) {
  sessionStorage.setItem(RESET_GUARD_KEY, '1');
  localStorage.removeItem(TEST_AUTOSAVE_KEY);
  if (state) {
    state.resetting = true;
    state.saveStatus = { message: 'Refresh state cleared' };
    log(state, 'Refresh state cleared. Reloading fresh state.');
  }
}

export function updateRefreshAutosave(state, dt) {
  if (state?.resetting || resetGuardActive()) return;
  state.testAutosaveT = (state.testAutosaveT || 0) + dt;
  if (state.testAutosaveT < 2) return;
  state.testAutosaveT = 0;
  saveRefreshState(state);
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

  if (data.version >= 2 && data.state) {
    restoreObjects(data.objects);
    restoreWholeState(state, data.state);
  } else {
    restoreLegacyState(state, data);
  }

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

export function clearSaveSlot(state, slot = 1) {
  localStorage.removeItem(slotKey(slot));
  state.saveStatus = { message: `Cleared slot ${slot}` };
  log(state, `Cleared save slot ${slot}.`);
}
