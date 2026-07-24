import { log } from './state.js';
import { objects } from './world.js';

const PREFIX = 'apartment_god_slot_';
const AUTOSAVE_SLOT = 'autosave';
const TEST_AUTOSAVE_KEY = 'apartment_god_test_refresh_state_v3';
const RESET_GUARD_KEY = 'apartment_god_reset_guard_v1';
const SAVE_VERSION = 3;
const TEST_SAVE_VERSION = 3;
const BLOCKED_MERGE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeDefaults(defaultValue, savedValue) {
  if (savedValue === undefined) return clone(defaultValue);
  if (!isPlainObject(defaultValue) || !isPlainObject(savedValue)) return clone(savedValue);
  const merged = clone(defaultValue) || {};
  for (const [key, value] of Object.entries(savedValue)) {
    if (BLOCKED_MERGE_KEYS.has(key)) continue;
    merged[key] = key in merged ? mergeDefaults(merged[key], value) : clone(value);
  }
  return merged;
}

function mergeEntities(defaultEntities, savedEntities) {
  if (!Array.isArray(savedEntities)) return clone(defaultEntities || []);
  const defaultsById = new Map((defaultEntities || []).map(entity => [entity.id, entity]));
  const merged = savedEntities.map(saved => {
    const defaults = defaultsById.get(saved?.id) || {};
    defaultsById.delete(saved?.id);
    return mergeDefaults(defaults, saved || {});
  });
  for (const defaults of defaultsById.values()) merged.push(clone(defaults));
  return merged;
}

export function mergeSavedStateForTest(defaultState, savedState) {
  const merged = mergeDefaults(defaultState || {}, savedState || {});
  merged.entities = mergeEntities(defaultState?.entities || [], savedState?.entities);
  return merged;
}

export function mergeSavedObjectsForTest(defaultObjects, savedObjects) {
  if (!Array.isArray(savedObjects)) return clone(defaultObjects || []);
  const savedById = new Map(savedObjects.filter(Boolean).map(object => [object.id, object]));
  const merged = (defaultObjects || []).map(defaultObject => {
    const saved = savedById.get(defaultObject.id);
    savedById.delete(defaultObject.id);
    return saved ? mergeDefaults(defaultObject, saved) : clone(defaultObject);
  });
  for (const saved of savedById.values()) merged.push(clone(saved));
  return merged;
}

function safeLocalGet(key) {
  try { return localStorage.getItem(key); }
  catch (error) { console.warn('[Apartment God] localStorage read blocked.', error); return null; }
}

function safeLocalSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (error) { console.warn('[Apartment God] localStorage write blocked.', error); return false; }
}

function safeLocalRemove(key) {
  try { localStorage.removeItem(key); return true; }
  catch (error) { console.warn('[Apartment God] localStorage remove blocked.', error); return false; }
}

function safeSessionGet(key) {
  try { return sessionStorage.getItem(key); }
  catch (error) { console.warn('[Apartment God] sessionStorage read blocked.', error); return null; }
}

function safeSessionSet(key, value) {
  try { sessionStorage.setItem(key, value); return true; }
  catch (error) { console.warn('[Apartment God] sessionStorage write blocked.', error); return false; }
}

function safeSessionRemove(key) {
  try { sessionStorage.removeItem(key); return true; }
  catch (error) { console.warn('[Apartment God] sessionStorage remove blocked.', error); return false; }
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
  saved.viewFocus = null;
  saved.resetting = false;
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
  const merged = mergeSavedObjectsForTest(objects, savedObjects);
  objects.splice(0, objects.length, ...merged);
}

function restoreWholeState(target, saved) {
  const merged = mergeSavedStateForTest(target, saved);
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, merged);
  scrubTransientState(target);
  target.saveStatus ??= {};
}

function mergeRefreshState(target, saved) {
  const merged = mergeSavedStateForTest(target, saved);
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, merged);
  scrubTransientState(target);
  target.saveStatus = { message: 'Restored refresh state', slot: 'refresh', savedAt: null };
}

function readSlot(slot = 1) {
  const raw = safeLocalGet(slotKey(slot));
  if (!raw) return null;
  return JSON.parse(raw);
}

function readRefreshSave() {
  const raw = safeLocalGet(TEST_AUTOSAVE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function resetGuardActive() {
  return safeSessionGet(RESET_GUARD_KEY) === '1';
}

function clearResetGuard() {
  safeSessionRemove(RESET_GUARD_KEY);
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
    if (!safeLocalSet(slotKey(slot), JSON.stringify(data))) throw new Error('storage write failed');
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
    if (!safeLocalSet(TEST_AUTOSAVE_KEY, JSON.stringify(data))) return false;
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
    safeLocalRemove(TEST_AUTOSAVE_KEY);
    clearResetGuard();
    state.saveStatus = { message: 'Reset fresh state loaded' };
    return false;
  }

  let data = null;
  try {
    data = readRefreshSave();
  } catch (error) {
    safeLocalRemove(TEST_AUTOSAVE_KEY);
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
  safeSessionSet(RESET_GUARD_KEY, '1');
  safeLocalRemove(TEST_AUTOSAVE_KEY);
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
  state.roomLights = { ...state.roomLights, ...(data.roomLights || {}) };
  state.objectState = { ...state.objectState, ...(data.objectState || {}) };
  state.routines = data.routines || [];
  state.appointments = data.appointments || [];
  state.requests = data.requests || [];
  for (const saved of data.entities || []) {
    const e = state.entities.find(x => x.id === saved.id);
    if (!e) continue;
    Object.assign(e, mergeDefaults(e, saved));
    e.path = [];
    e.target = null;
    e.pending = null;
    e.action = 'Loaded';
    e.actionT = 0;
    e.actionTotal = 0;
    e.currentActionId = null;
    e.activityObjectId = null;
    e.pose = 'stand';
    e.hidden = false;
  }
}

export function clearSaveSlot(state, slot = 1) {
  safeLocalRemove(slotKey(slot));
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
    return data.savedAt ? new Date(data.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved';
  } catch {
    return 'Corrupt';
  }
}
