import { pay, orderFood, buyWorkoutGear } from './economy.js';
import { log, say, setMood } from './state.js';
import { objects, roomAt } from './world.js';

export const BUILD_PLANS = [
  { label: 'Bookshelf', kind: 'bookshelf', cost: 140, w: 78, h: 118, solid: true, words: ['bookshelf', 'book shelf', 'shelf', 'library'] },
  { label: 'Couch', kind: 'couch', cost: 320, w: 154, h: 62, solid: true, words: ['couch', 'sofa', 'loveseat'] },
  { label: 'Desk', kind: 'desk', cost: 260, w: 122, h: 66, solid: true, words: ['desk', 'computer desk', 'work desk', 'table'] },
  { label: 'TV', kind: 'tv', cost: 420, w: 92, h: 36, solid: true, words: ['tv', 'television', 'screen'] },
  { label: 'Stereo', kind: 'stereo', cost: 180, w: 58, h: 34, solid: true, words: ['stereo', 'speaker', 'speakers', 'sound system', 'music system'] },
  { label: 'Bed', kind: 'bed', cost: 520, w: 190, h: 112, solid: true, enterable: true, words: ['bed', 'mattress'] },
  { label: 'Dog Bowl', kind: 'dog_bowl', cost: 35, w: 36, h: 26, solid: false, words: ['dog bowl', 'pet bowl', 'bowl'] },
  { label: 'Workout Gear', kind: 'workout', cost: 220, w: 72, h: 42, solid: true, words: ['workout', 'weights', 'gym', 'exercise'] },
  { label: 'Pool Table', kind: 'pool_table', cost: 850, w: 250, h: 122, solid: true, words: ['pool table', 'billiards', 'pool'] },
  { label: 'Arcade Machine', kind: 'arcade', cost: 650, w: 54, h: 78, solid: true, words: ['arcade', 'arcade machine'] },
  { label: 'Console Setup', kind: 'game_console', cost: 500, w: 172, h: 58, solid: true, words: ['console', 'playstation', 'ps5', 'xbox', 'video game', 'gaming setup'] },
  { label: 'Dart Board', kind: 'dartboard', cost: 90, w: 34, h: 34, solid: false, words: ['dart', 'darts', 'dartboard', 'dart board'] },
  { label: 'Room Light', kind: 'light', cost: 80, w: 22, h: 22, solid: false, words: ['light', 'lamp', 'ceiling light'] },
  { label: 'Treadmill', kind: 'treadmill', cost: 750, w: 118, h: 58, solid: true, words: ['treadmill', 'running machine'] },
  { label: 'Weight Bench', kind: 'weight_bench', cost: 620, w: 122, h: 54, solid: true, words: ['weight bench', 'bench press', 'weights bench'] },
  { label: 'Heavy Bag', kind: 'heavy_bag', cost: 260, w: 42, h: 84, solid: true, words: ['heavy bag', 'punching bag', 'boxing bag'] },
  { label: 'Trash Can', kind: 'trash_can', cost: 55, w: 34, h: 42, solid: false, words: ['trash can', 'garbage can', 'bin', 'waste bin'] },
  { label: 'Kennel', kind: 'kennel', cost: 380, w: 112, h: 82, solid: true, words: ['kennel', 'dog house', 'doghouse'] }
];

export function buildPlanLabels() { return BUILD_PLANS.map(p => p.label); }

export function handleBuildRequest(state, actor, text) {
  const request = String(text || '').toLowerCase().trim();
  if (!request) { log(state, `Build options: ${buildPlanLabels().join(', ')}.`); say(actor, 'LIST'); return false; }
  if (request.includes('food') || request.includes('eat') || request.includes('delivery')) return orderFood(state, actor, false);
  if (request.includes('workout gear')) return buyWorkoutGear(state, actor);
  const plan = matchBuildPlan(request);
  if (plan) return requestPlacement(state, actor, plan);
  log(state, `No build plan for: ${text}. Try: ${buildPlanLabels().join(', ')}.`);
  say(actor, 'HUH?');
  return false;
}

function matchBuildPlan(request) { return BUILD_PLANS.find(plan => plan.words.some(word => request.includes(word))) || null; }

function requestPlacement(state, actor, plan) {
  state.buildPick = { ...plan };
  actor.action = `Planning ${plan.label}`;
  actor.actionT = 3;
  actor.actionTotal = 3;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'PLACE?');
  log(state, `Choose a floor, then tap where ${plan.label} should be delivered. Cost: $${plan.cost}.`);
  return true;
}

export function placeBuildRequest(state, actor, x, y) {
  const pick = state.buildPick;
  if (!pick) return false;
  const nx = Math.round(x - pick.w / 2);
  const ny = Math.round(y - pick.h / 2);
  const check = validateBuildPlacement(state, pick, nx, ny, state.floor);
  if (!check.ok) { log(state, check.reason); say(actor, 'NO'); return true; }
  if (!pay(state, pick.cost, `${pick.label} delivery`)) return true;
  state.appointments.push({ type: 'build', kind: pick.kind, label: pick.label, solid: pick.solid !== false, enterable: Boolean(pick.enterable), t: pick.installTime || 8, floor: state.floor, x: nx, y: ny, w: pick.w, h: pick.h, facing: pickFacing(pick, nx, ny, state.floor) });
  state.buildPick = null;
  say(actor, 'BOOKED');
  log(state, `${pick.label} delivery scheduled for Floor ${state.floor + 1}.`);
  return true;
}

function validateBuildPlacement(state, pick, x, y, floor) {
  if (x < 30 || y < 40 || x + pick.w > 930 || y + pick.h > 650) return { ok: false, reason: 'That spot is outside the usable apartment.' };
  const room = roomAt(x + pick.w / 2, y + pick.h / 2, floor);
  if (!room) return { ok: false, reason: 'Pick a valid room, not a wall gap.' };
  const rect = { x, y, w: pick.w, h: pick.h };
  if (floor === 0 && overlap(rect, { x: 34, y: 360, w: 110, h: 150 })) return { ok: false, reason: 'Cannot block the front door path.' };
  if ([0,1,2].includes(floor) && overlap(rect, { x: 730, y: 520, w: 190, h: 140 })) return { ok: false, reason: 'Cannot block the stairs path.' };
  for (const other of objects) {
    if (other.floor !== floor || !other.solid) continue;
    if (overlap(rect, other)) return { ok: false, reason: `Cannot overlap ${other.label}.` };
  }
  return { ok: true };
}

function pickFacing(pick, x, y, floor) {
  const room = roomAt(x + pick.w / 2, y + pick.h / 2, floor);
  if (!room) return 'south';
  const spaces = { north: y - room.y, south: room.y + room.h - (y + pick.h), west: x - room.x, east: room.x + room.w - (x + pick.w) };
  return Object.entries(spaces).sort((a, b) => b[1] - a[1])[0][0];
}

export function updateAppointments(state, dt) {
  for (const appt of state.appointments) appt.t -= dt;
  const ready = state.appointments.filter(a => a.t <= 0);
  state.appointments = state.appointments.filter(a => a.t > 0);
  for (const appt of ready) {
    if (appt.type === 'build' || appt.type === 'bookshelf') installBuild(state, appt);
    if (appt.type === 'renovation') finishRenovation(state, appt);
  }
}

function installBuild(state, appt) {
  const kind = appt.kind || 'bookshelf';
  const label = appt.label || 'Bookshelf';
  const w = appt.w || 78;
  const h = appt.h || 118;
  const count = objects.filter(o => o.kind === kind).length + 1;
  const id = `${kind}_${count}`;
  const room = roomAt(appt.x + w / 2, appt.y + h / 2, appt.floor);
  objects.push({ id, label: `${label} ${count}`, kind, floor: appt.floor, room: room?.id || 'living', x: appt.x, y: appt.y, w, h, solid: appt.solid !== false, enterable: Boolean(appt.enterable), facing: appt.facing || 'south' });
  state.objectState[kind] = true;
  log(state, `Delivery crew installed ${label} ${count}.`);
}

function finishRenovation(state, appt) {
  const obj = objects.find(o => o.id === appt.objectId);
  if (obj) { obj.x = appt.x; obj.y = appt.y; log(state, `Contractors moved ${obj.label}.`); }
}

function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
