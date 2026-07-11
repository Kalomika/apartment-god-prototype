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
  RENDER_STYLE_CHANGED: 'render_style_changed',
  LISTENER_ERROR: 'listener_error'
});

export function createStarshotEventBus({ maxHistory = 120 } = {}) {
  const listeners = new Map();
  const history = [];
  const historyLimit = Math.max(0, Math.floor(maxHistory || 0));

  function on(type, handler) {
    if (!type || typeof handler !== 'function') return () => {};
    const set = listeners.get(type) || new Set();
    set.add(handler);
    listeners.set(type, set);
    return () => off(type, handler);
  }

  function once(type, handler) {
    if (!type || typeof handler !== 'function') return () => {};
    const offOnce = on(type, event => {
      offOnce();
      handler(event);
    });
    return offOnce;
  }

  function off(type, handler) {
    const set = listeners.get(type);
    if (!set) return;
    set.delete(handler);
    if (!set.size) listeners.delete(type);
  }

  function emit(type, payload = {}) {
    if (!type) return null;
    const safePayload = payload && typeof payload === 'object' ? payload : { value: payload };
    const event = {
      type,
      payload: safePayload,
      t: Number.isFinite(safePayload.t) ? safePayload.t : 0,
      frame: Number.isFinite(safePayload.frame) ? safePayload.frame : null
    };
    pushHistory(event);
    dispatch(type, event);
    dispatch('*', event);
    return event;
  }

  function dispatch(type, event) {
    for (const handler of listeners.get(type) || []) {
      try {
        handler(event);
      } catch (error) {
        if (event.type === STARSHOT_EVENTS.LISTENER_ERROR) continue;
        pushHistory({
          type: STARSHOT_EVENTS.LISTENER_ERROR,
          payload: { sourceType: event.type, message: error?.message || String(error) },
          t: event.t,
          frame: event.frame
        });
      }
    }
  }

  function pushHistory(event) {
    if (!historyLimit) return;
    history.push(event);
    while (history.length > historyLimit) history.shift();
  }

  function recent(limit = 12) {
    const count = Math.max(0, Math.floor(limit || 0));
    if (!count) return [];
    return history.slice(Math.max(0, history.length - count));
  }

  function clearHistory() {
    history.length = 0;
  }

  function clear() {
    clearHistory();
    listeners.clear();
  }

  function listenerCount(type = null) {
    if (type) return listeners.get(type)?.size || 0;
    let total = 0;
    for (const set of listeners.values()) total += set.size;
    return total;
  }

  return { on, once, off, emit, recent, clearHistory, clear, listenerCount };
}

export function ensureStarshotEventBus(target) {
  if (!target) return createStarshotEventBus();
  if (!target.starshotEventBus) target.starshotEventBus = createStarshotEventBus();
  return target.starshotEventBus;
}
