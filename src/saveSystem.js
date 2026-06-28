const PREFIX = 'apartment_god_slot_';

export function saveGame(state, slot = 1) {
  const data = {
    time: state.time,
    money: state.money,
    bill: state.bill,
    floor: state.floor,
    selectedId: state.selectedId,
    autonomyMode: state.autonomyMode,
    roomLights: state.roomLights,
    objectState: state.objectState,
    routines: state.routines,
    appointments: state.appointments,
    requests: state.requests || [],
    entities: state.entities.map(e => ({
      id: e.id, floor: e.floor, x: e.x, y: e.y, needs: e.needs, skills: e.skills, skillCaps: e.skillCaps, traits: e.traits
    }))
  };
  localStorage.setItem(`${PREFIX}${slot}`, JSON.stringify(data));
  return true;
}

export function loadGame(state, slot = 1) {
  const raw = localStorage.getItem(`${PREFIX}${slot}`);
  if (!raw) return false;
  const data = JSON.parse(raw);
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
    e.floor = saved.floor; e.x = saved.x; e.y = saved.y;
    e.needs = saved.needs || e.needs;
    e.skills = saved.skills || e.skills;
    e.skillCaps = saved.skillCaps || e.skillCaps;
    e.traits = saved.traits || e.traits;
    e.path = []; e.target = null; e.action = 'Loaded'; e.actionT = 0; e.pose = 'stand'; e.hidden = false;
  }
  return true;
}

export function slotSummary(slot = 1) {
  const raw = localStorage.getItem(`${PREFIX}${slot}`);
  if (!raw) return 'Empty';
  try {
    const data = JSON.parse(raw);
    return `Day time ${Math.round((data.time || 0) / 60)}h, $${Math.round(data.money || 0)}`;
  } catch {
    return 'Corrupt';
  }
}
