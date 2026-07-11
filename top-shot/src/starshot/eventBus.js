export const STARSHOT_EVENTS = Object.freeze({
  ACTOR_SPAWNED: 'actor_spawned',
  ACTOR_REMOVED: 'actor_removed',
  MOTION_STARTED: 'motion_started',
  MOTION_STOPPED: 'motion_stopped',
  ANIMATION_STATE_CHANGED: 'animation_state_changed',
  ATTACK_STARTED: 'attack_started',
  HIT_FRAME_OPENED: 'hit_frame_opened',
  HIT_FRAME_CLOSED: 'hit_frame_closed',
  ATTACK_CONNECTED: 'attack_connected',
  COUNTER_WINDOW_OPENED: 'counter_window_opened',
  COUNTER_WINDOW_CLOSED: 'counter_window_closed',
  IMPACT_PAUSE_REQUESTED: 'impact_pause_requested',
  IMPACT_PAUSE_STARTED: 'impact_pause_started',
  IMPACT_PAUSE_ENDED: 'impact_pause_ended',
  AI_STATE_CHANGED: 'ai_state_changed',
  COVER_ENTERED: 'cover_entered',
  COVER_LEFT: 'cover_left',
  ARENA_ZONE_ENTERED: 'arena_zone_entered',
  ARENA_ZONE_LEFT: 'arena_zone_left',
  PROFILE_POWER_SCALE_CHANGED: 'profile_power_scale_changed',
  RENDER_STYLE_CHANGED: 'render_style_changed'
});

export function createStarshotEventBus({ maxHistory = 120 } = {}) {
  const listeners = new Map();
  const history = [];

  function on(type, handler) {
    if (!type || typeof handler !== 'function') return () => {};
    const set = listeners.get(type) || new Set();
    set.add(handler);
    listeners.set(type, set);
    return () => off(type, handler);
  }

  function off(type, handler) {
    const set = listeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (!set.size) listeners.delete(type);
  }

  function emit(type, payload = {}) {
    if (!type) return null;
    const event = {
      type,
      payload,
      t: Number.isFinite(payload.t) ? payload.t : 0,
      frame: Number.isFinite(payload.frame) ? payload.frame : null
    };
    history.push(event);
    while (history.length > maxHistory) history.shift();
    for (const handler of listeners.get(type) || []) handler(event);
    for (const handler of listeners.get('*') || []) handler(event);
    return event;
  }

  function recent(limit = 12) {
    return history.slice(Math.max(0, history.length - limit));
  }

  function clear() {
    history.length = 0;
    listeners.clear();
  }

  return { on, off, emit, recent, clear };
}

export function ensureStarshotEventBus(target) {
  if (!target) return createStarshotEventBus();
  if (!target.starshotEventBus) target.starshotEventBus = createStarshotEventBus();
  return target.starshotEventBus;
}
