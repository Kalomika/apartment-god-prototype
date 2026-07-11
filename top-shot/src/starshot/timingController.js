export const TIMING_PROFILES = Object.freeze({
  REAL_TIME: 'real_time',
  SLOW_MO: 'slow_mo',
  IMPACT_PAUSE: 'impact_pause',
  CINEMATIC_SLOW: 'cinematic_slow'
});

const PROFILE_SCALE = Object.freeze({
  [TIMING_PROFILES.REAL_TIME]: 1,
  [TIMING_PROFILES.SLOW_MO]: 0.42,
  [TIMING_PROFILES.IMPACT_PAUSE]: 0,
  [TIMING_PROFILES.CINEMATIC_SLOW]: 0.22
});

const hasProfile = profile => Object.prototype.hasOwnProperty.call(PROFILE_SCALE, profile);
const safeSeconds = value => Number.isFinite(value) ? Math.max(0, value) : 0;

export function createStarshotTimingController() {
  let profile = TIMING_PROFILES.REAL_TIME;
  let remaining = 0;
  let requestedBy = null;
  let rawDt = 0;
  let scaledDt = 0;
  let lastProfile = TIMING_PROFILES.REAL_TIME;

  function update(dt) {
    rawDt = safeSeconds(dt);
    lastProfile = profile;
    if (remaining > 0) {
      remaining = Math.max(0, remaining - rawDt);
      if (remaining <= 0) {
        profile = TIMING_PROFILES.REAL_TIME;
        requestedBy = null;
      }
    }
    scaledDt = rawDt * (PROFILE_SCALE[profile] ?? 1);
    return snapshot();
  }

  function request(nextProfile, duration = 0.08, source = 'unknown') {
    if (!hasProfile(nextProfile)) return snapshot();
    profile = nextProfile;
    remaining = safeSeconds(duration);
    requestedBy = source || 'unknown';
    scaledDt = rawDt * (PROFILE_SCALE[profile] ?? 1);
    return snapshot();
  }

  function requestImpactPause(duration = 0.075, source = 'combat') {
    return request(TIMING_PROFILES.IMPACT_PAUSE, duration, source);
  }

  function requestSlowMo(duration = 0.35, source = 'system') {
    return request(TIMING_PROFILES.SLOW_MO, duration, source);
  }

  function requestCinematicSlow(duration = 0.55, source = 'system') {
    return request(TIMING_PROFILES.CINEMATIC_SLOW, duration, source);
  }

  function reset() {
    profile = TIMING_PROFILES.REAL_TIME;
    lastProfile = TIMING_PROFILES.REAL_TIME;
    remaining = 0;
    requestedBy = null;
    rawDt = 0;
    scaledDt = 0;
  }

  function snapshot() {
    return {
      profile,
      lastProfile,
      rawDt,
      scaledDt,
      scale: PROFILE_SCALE[profile] ?? 1,
      remaining,
      requestedBy,
      active: profile !== TIMING_PROFILES.REAL_TIME
    };
  }

  return { update, request, requestImpactPause, requestSlowMo, requestCinematicSlow, reset, snapshot };
}

export function ensureStarshotTimingController(target) {
  if (!target) return createStarshotTimingController();
  if (!target.starshotTiming) target.starshotTiming = createStarshotTimingController();
  return target.starshotTiming;
}
