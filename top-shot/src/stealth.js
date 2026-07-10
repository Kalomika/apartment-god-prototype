import { blocked, coverPoint, inShadow, nearCover, solids } from './arena.js';
import { angleTo, clamp, dist, normalizeAngle, pointInRect } from './utils.js';

const PHASES = ['infiltration', 'suspicious', 'alert', 'evasion', 'recovery'];
const DEFAULT_AMBIENT_NOISE = 18;
const SIGHT_MEMORY_SECONDS = 5.5;
const HEARD_MEMORY_SECONDS = 4.5;

export function createStealthState() {
  return {
    phase: 'infiltration',
    previousPhase: 'infiltration',
    phaseT: 0,
    phaseChangedAt: 0,
    ambientNoise: DEFAULT_AMBIENT_NOISE,
    evidence: [],
    lastAlertAt: 0,
    lastKnownThreat: null
  };
}

export function freshAwareness() {
  return {
    suspicion: 0,
    stress: 0,
    phase: 'infiltration',
    lastKnownPosition: null,
    lastHeardPosition: null,
    lastEvidencePosition: null,
    lastConfirmedAt: -Infinity,
    lastHeardAt: -Infinity,
    lastEvidenceAt: -Infinity,
    searchRadius: 80,
    searchIndex: 0,
    currentSearchPoint: null,
    evidenceSeen: [],
    role: 'patrol',
    ambientNoise: DEFAULT_AMBIENT_NOISE
  };
}

export function ensureStealthState(state) {
  state.stealth ||= createStealthState();
  state.stealth.phase ||= 'infiltration';
  state.stealth.previousPhase ||= state.stealth.phase;
  state.stealth.ambientNoise = Number.isFinite(state.stealth.ambientNoise) ? state.stealth.ambientNoise : DEFAULT_AMBIENT_NOISE;
  state.stealth.evidence = Array.isArray(state.stealth.evidence) ? state.stealth.evidence : [];
  return state.stealth;
}

export function ensureAwareness(fighter) {
  fighter.awareness ||= freshAwareness();
  fighter.awareness.suspicion = clamp(Number(fighter.awareness.suspicion) || 0, 0, 100);
  fighter.awareness.stress = clamp(Number(fighter.awareness.stress) || 0, 0, 100);
  fighter.awareness.searchRadius = clamp(Number(fighter.awareness.searchRadius) || 80, 60, 280);
  fighter.awareness.evidenceSeen = Array.isArray(fighter.awareness.evidenceSeen) ? fighter.awareness.evidenceSeen : [];
  return fighter.awareness;
}

export function updateStealthSystem(state, dt) {
  if (!state || state.mode === 'cqc' || state.matchState !== 'running' || !Array.isArray(state.fighters)) return;
  const stealth = ensureStealthState(state);
  stealth.phaseT += dt;
  stealth.ambientNoise = ambientNoiseFor(state);
  stealth.evidence = collectEvidence(state);

  let maxSuspicion = 0;
  let maxStress = 0;
  let hardSight = false;
  let threatPoint = null;

  for (const watcher of state.fighters) {
    if (!activeFighter(watcher)) continue;
    const awareness = ensureAwareness(watcher);
    awareness.ambientNoise = stealth.ambientNoise;
    const targets = state.fighters.filter(target => target !== watcher && !target.extracted);
    let bestSignal = 0;

    for (const target of targets) {
      const visual = visualDetectionScore(state.arena, watcher, target);
      const sound = soundDetectionScore(watcher, target, stealth.ambientNoise);
      const evidence = evidenceDetectionScore(state, watcher);
      const signal = Math.max(visual, sound * 0.9, evidence * 0.8);
      bestSignal = Math.max(bestSignal, signal);

      if (visual >= 76) {
        hardSight = true;
        threatPoint = { x: target.x, y: target.y };
        awareness.lastKnownPosition = { x: target.x, y: target.y, t: state.clock, confidence: clamp(visual / 100, 0.35, 1) };
        awareness.lastConfirmedAt = state.clock;
        watcher.memory ||= {};
        watcher.memory.lastSeen = { x: target.x, y: target.y, t: state.clock };
      } else if (visual >= 34) {
        awareness.lastKnownPosition ||= { x: target.x, y: target.y, t: state.clock, confidence: 0.28 };
      }

      if (sound >= 42) {
        awareness.lastHeardPosition = { x: target.x, y: target.y, t: state.clock, confidence: clamp(sound / 100, 0.25, 1) };
        awareness.lastHeardAt = state.clock;
      }

      if (evidence >= 35) {
        const nearest = nearestEvidence(state, watcher);
        if (nearest) {
          awareness.lastEvidencePosition = { x: nearest.x, y: nearest.y, t: state.clock, confidence: clamp(evidence / 100, 0.2, 1), type: nearest.type };
          awareness.lastEvidenceAt = state.clock;
          if (!awareness.evidenceSeen.includes(nearest.id)) awareness.evidenceSeen.unshift(nearest.id);
          awareness.evidenceSeen = awareness.evidenceSeen.slice(0, 8);
        }
      }
    }

    applyAwarenessChange(state, watcher, bestSignal, dt);
    maxSuspicion = Math.max(maxSuspicion, awareness.suspicion);
    maxStress = Math.max(maxStress, awareness.stress);
  }

  const nextPhase = chooseGlobalPhase(stealth.phase, maxSuspicion, maxStress, hardSight, state.clock, stealth.lastAlertAt);
  if (hardSight) stealth.lastAlertAt = state.clock;
  if (threatPoint) stealth.lastKnownThreat = threatPoint;
  if (nextPhase !== stealth.phase) {
    stealth.previousPhase = stealth.phase;
    stealth.phase = nextPhase;
    stealth.phaseT = 0;
    stealth.phaseChangedAt = state.clock;
    pushStealthLog(state, nextPhase, maxSuspicion, hardSight);
  }
}

export function visualDetectionScore(arena, watcher, target) {
  if (!arena || !watcher || !target || target.extracted) return 0;
  const distance = dist(watcher, target);
  const sightRange = Math.max(160, (watcher.stats?.sight || 70) * 5.25);
  if (distance > sightRange) return 0;
  if (!clearLine(arena, watcher, target, target.prone ? 0 : 2)) return 0;

  const angleDelta = Math.abs(normalizeAngle(angleTo(watcher, target) - (watcher.facing || 0)));
  const closeRead = distance < 86;
  const cone = watcher.prone ? 0.7 : watcher.crouch ? 1.05 : 1.35;
  if (!closeRead && angleDelta > cone) return 0;

  const coneScore = closeRead ? 0.88 : clamp(1 - angleDelta / Math.max(0.1, cone), 0, 1);
  const distanceScore = clamp(1 - distance / sightRange, 0, 1);
  const movementNoise = clamp(((target.noise || 0) - 12) / 80, 0, 0.28);
  const posture = target.prone ? 0.38 : target.crouch ? 0.62 : 1;
  const shadow = target.shadowHidden || inShadow(arena, target) ? shadowModifier(target) : 1;
  const wounded = target.bleed?.rate > 0 || target.hp < 42 ? 0.12 : 0;
  const closeBonus = distance < 70 ? 22 : distance < 120 ? 8 : 0;
  return clamp(100 * distanceScore * coneScore * posture * shadow + movementNoise * 100 + wounded * 100 + closeBonus, 0, 100);
}

export function soundDetectionScore(listener, target, ambientNoise = DEFAULT_AMBIENT_NOISE) {
  if (!listener || !target || target.extracted) return 0;
  const noise = Math.max(0, target.noise || 0);
  if (noise <= 0) return 0;
  const maskedNoise = Math.max(0, noise - ambientNoise * 0.68);
  if (maskedNoise <= 1) return 0;
  const distance = dist(listener, target);
  const hearing = Math.max(45, listener.stats?.hearing || 70);
  const range = hearing * (maskedNoise + 18) * 0.19;
  if (distance > range) return 0;
  return clamp((1 - distance / Math.max(1, range)) * 100 * clamp(maskedNoise / 46, 0.25, 1.35), 0, 100);
}

export function stealthSearchPlan(state, f, enemy, visible, audible) {
  if (!state || state.mode === 'cqc' || !f || !enemy || visible) return null;
  const awareness = ensureAwareness(f);
  const lastKnownFresh = awareness.lastKnownPosition && state.clock - awareness.lastKnownPosition.t < SIGHT_MEMORY_SECONDS;
  const lastHeardFresh = awareness.lastHeardPosition && state.clock - awareness.lastHeardPosition.t < HEARD_MEMORY_SECONDS;
  const evidenceFresh = awareness.lastEvidencePosition && state.clock - awareness.lastEvidencePosition.t < HEARD_MEMORY_SECONDS;

  if (awareness.phase === 'alert' && lastKnownFresh) {
    return { intent: roleIntent(awareness.role, 'alert'), dest: nextSearchPoint(state, f, awareness.lastKnownPosition), hold: 0.62 };
  }
  if ((awareness.phase === 'evasion' || awareness.phase === 'suspicious') && (lastKnownFresh || lastHeardFresh || evidenceFresh)) {
    const origin = awareness.lastKnownPosition || awareness.lastHeardPosition || awareness.lastEvidencePosition;
    return { intent: roleIntent(awareness.role, awareness.phase), dest: nextSearchPoint(state, f, origin), hold: 0.85 };
  }
  if ((audible || awareness.suspicion > 20) && lastHeardFresh) {
    return { intent: 'investigate_noise', dest: nextSearchPoint(state, f, awareness.lastHeardPosition), hold: 0.9 };
  }
  if (awareness.suspicion > 14 && evidenceFresh) {
    return { intent: 'inspect_evidence', dest: nextSearchPoint(state, f, awareness.lastEvidencePosition), hold: 1.05 };
  }
  return null;
}

export function stealthDebugLine(state) {
  const stealth = state?.stealth || createStealthState();
  const phase = stealth.phase || 'infiltration';
  const ambient = Math.round(stealth.ambientNoise || DEFAULT_AMBIENT_NOISE);
  const suspicion = Math.round(Math.max(0, ...(state?.fighters || []).map(f => ensureAwareness(f).suspicion)));
  return `Stealth: ${phase}, suspicion ${suspicion}, ambient ${ambient}`;
}

function applyAwarenessChange(state, watcher, signal, dt) {
  const awareness = ensureAwareness(watcher);
  const beforePhase = awareness.phase;
  if (signal > 0) {
    const rise = signal >= 76 ? signal * 1.25 : signal >= 42 ? signal * 0.58 : signal * 0.2;
    awareness.suspicion = clamp(awareness.suspicion + rise * dt, 0, 100);
    awareness.stress = clamp(awareness.stress + Math.max(0, signal - 32) * 0.5 * dt, 0, 100);
    awareness.searchRadius = clamp(70 + awareness.suspicion * 1.9, 70, 280);
  } else {
    const decay = state.stealth?.phase === 'alert' || state.stealth?.phase === 'evasion' ? 2.2 : 4.0;
    awareness.suspicion = clamp(awareness.suspicion - decay * dt, 0, 100);
    awareness.stress = clamp(awareness.stress - 1.6 * dt, 0, 100);
  }

  awareness.phase = awareness.suspicion >= 86 ? 'alert'
    : awareness.suspicion >= 50 ? 'evasion'
    : awareness.suspicion >= 22 ? 'suspicious'
    : awareness.suspicion >= 10 ? 'recovery'
    : 'infiltration';
  awareness.role = roleFor(watcher, awareness);
  if (beforePhase !== awareness.phase) awareness.searchIndex = 0;
}

function chooseGlobalPhase(current, maxSuspicion, maxStress, hardSight, clock, lastAlertAt) {
  if (hardSight || maxSuspicion >= 88 || maxStress >= 82) return 'alert';
  if ((current === 'alert' || current === 'evasion') && clock - lastAlertAt < 5.5 && maxSuspicion >= 34) return 'evasion';
  if (maxSuspicion >= 32 || maxStress >= 30) return 'suspicious';
  if ((current === 'alert' || current === 'evasion' || current === 'suspicious') && maxSuspicion >= 10) return 'recovery';
  return 'infiltration';
}

function ambientNoiseFor(state) {
  const effectNoise = (state.effects || []).reduce((sum, e) => sum + effectNoiseValue(e), 0);
  const movementNoise = (state.fighters || []).reduce((sum, f) => sum + Math.max(0, f.noise || 0) * 0.08, 0);
  const terrainHum = 14;
  return clamp(terrainHum + movementNoise + effectNoise, 12, 88);
}

function effectNoiseValue(effect) {
  if (!effect) return 0;
  if (['explosion', 'grenade', 'shatter'].includes(effect.type)) return 46;
  if (['tracer', 'impact', 'impact_flash', 'landing_flash'].includes(effect.type)) return 18;
  if (['slash', 'block', 'parry', 'grapple'].includes(effect.type)) return 9;
  if (effect.type === 'command') return 4;
  return 0;
}

function collectEvidence(state) {
  const evidence = [];
  for (const f of state.fighters || []) {
    if (f.defeated || f.incapacitated || f.bleed?.rate > 0) {
      evidence.push({ id: `body:${f.id}`, type: f.defeated || f.incapacitated ? 'body' : 'blood', x: f.x, y: f.y, ownerTeam: f.team, weight: f.defeated || f.incapacitated ? 85 : 32, radius: f.defeated || f.incapacitated ? 250 : 145 });
    }
  }
  for (const p of state.projectiles || []) {
    if (p.stuck) evidence.push({ id: `projectile:${p.type}:${Math.round(p.x)}:${Math.round(p.y)}`, type: `${p.type}_stuck`, x: p.x, y: p.y, ownerTeam: p.team, weight: 24, radius: 145 });
  }
  for (const pick of state.pickups || []) {
    if (pick.used) evidence.push({ id: `pickup:${pick.type}:${Math.round(pick.x)}:${Math.round(pick.y)}`, type: `${pick.type}_used`, x: pick.x, y: pick.y, ownerTeam: pick.team, weight: 16, radius: 120 });
  }
  for (const e of state.effects || []) {
    const weight = effectEvidenceWeight(e);
    if (weight > 0) evidence.push({ id: `effect:${e.type}:${Math.round(e.x)}:${Math.round(e.y)}`, type: e.type, x: e.x, y: e.y, ownerTeam: e.team || 'unknown', weight, radius: weight * 4.2 });
  }
  return evidence.filter(e => Number.isFinite(e.x) && Number.isFinite(e.y)).slice(0, 24);
}

function effectEvidenceWeight(effect) {
  if (!effect) return 0;
  if (['explosion', 'grenade', 'shatter'].includes(effect.type)) return 55;
  if (['tracer', 'impact', 'impact_flash', 'landing_flash'].includes(effect.type)) return 24;
  if (['slash', 'block', 'parry', 'grapple', 'bleed'].includes(effect.type)) return 15;
  return 0;
}

function evidenceDetectionScore(state, watcher) {
  const evidence = nearestEvidence(state, watcher);
  if (!evidence) return 0;
  const d = dist(watcher, evidence);
  const range = evidence.radius || 140;
  if (d > range || !clearLine(state.arena, watcher, evidence, 0)) return 0;
  const facing = Math.abs(normalizeAngle(angleTo(watcher, evidence) - (watcher.facing || 0)));
  const cone = d < 70 ? 1 : clamp(1 - facing / 1.5, 0.15, 1);
  return clamp(evidence.weight * cone * (1 - d / range) * 1.65, 0, 100);
}

function nearestEvidence(state, watcher) {
  const visible = (state.stealth?.evidence || [])
    .filter(e => e.ownerTeam !== watcher.team)
    .filter(e => dist(watcher, e) <= (e.radius || 140))
    .filter(e => clearLine(state.arena, watcher, e, 0))
    .sort((a, b) => dist(watcher, a) - dist(watcher, b));
  return visible[0] || null;
}

function nextSearchPoint(state, f, origin) {
  const awareness = ensureAwareness(f);
  const center = clampPoint(origin || { x: f.x, y: f.y });
  const radius = clamp(awareness.searchRadius || 90, 60, 280);
  const cover = nearCover(state.arena, center);
  const coverDest = cover ? coverPoint(state.arena, cover, f, center, 38) : null;
  const shadows = (state.arena.shadows || []).map(zone => rectCenter(zone)).sort((a, b) => dist(center, a) - dist(center, b));
  const angleBase = (awareness.searchIndex % 8) * Math.PI * 0.25;
  const ring = [0, 0.75, -0.75, 1.45, -1.45, Math.PI].map(offset => clampPoint({ x: center.x + Math.cos(angleBase + offset) * radius, y: center.y + Math.sin(angleBase + offset) * radius }));
  const candidates = [center, coverDest, ...shadows.slice(0, 2), ...ring].filter(Boolean).filter(p => !blocked(state.arena, p, 18));
  awareness.searchIndex += 1;
  awareness.currentSearchPoint = candidates[awareness.searchIndex % Math.max(1, candidates.length)] || center;
  return awareness.currentSearchPoint;
}

function roleFor(f, awareness) {
  if (awareness.phase === 'alert') {
    if (['marine', 'survival_commando'].includes(f.archetypeId)) return 'blocker';
    if (['ninja', 'shadow_ninja', 'martial_artist'].includes(f.archetypeId)) return 'flanker';
    return 'overwatch';
  }
  if (awareness.phase === 'evasion') return ['ninja', 'shadow_ninja'].includes(f.archetypeId) ? 'flanker' : 'searcher';
  if (awareness.phase === 'suspicious') return 'investigator';
  return 'patrol';
}

function roleIntent(role, phase) {
  if (role === 'flanker') return `${phase}_flank_search`;
  if (role === 'blocker') return `${phase}_cutoff_lane`;
  if (role === 'overwatch') return `${phase}_hold_angle`;
  return `${phase}_search`;
}

function shadowModifier(target) {
  const noise = target.noise || 0;
  if (target.prone && noise < 18) return 0.34;
  if (target.crouch && noise < 24) return 0.46;
  if (noise > 48) return 0.8;
  return 0.58;
}

function clearLine(arena, a, b, pad = 2) {
  const steps = Math.max(2, Math.ceil(dist(a, b) / 12));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (solids(arena).some(box => pointInRect(p, box, pad))) return false;
  }
  return true;
}

function activeFighter(f) {
  return f && !f.extracted && !f.incapacitated && !f.extracting;
}

function rectCenter(rect) {
  return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

function clampPoint(p) {
  return { x: clamp(p.x, 72, 888), y: clamp(p.y, 72, 648) };
}

function pushStealthLog(state, phase, suspicion, hardSight) {
  const label = phase.replace(/_/g, ' ');
  const cause = hardSight ? 'confirmed sighting' : suspicion >= 32 ? 'suspicion build' : 'search cooling';
  state.log.unshift(`${state.clock.toFixed(1)}s Stealth phase: ${label} from ${cause}.`);
  state.log = state.log.slice(0, 10);
}
