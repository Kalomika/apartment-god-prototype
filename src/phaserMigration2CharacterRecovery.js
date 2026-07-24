import { setBaseActorVisualVisible } from './phaserCharacterAnimationSystem.js';
import { commandMove } from './movement.js';

const GAME_SCENE_KEY = 'ApartmentGodNativeScene';
const HUMAN_SPEED = 92;
const DOG_SPEED = 120;
const STALE_IDLE_ACTION = /^(?:recovered|runtime recovered|walking|running|going to\b|waking up|blocked|no route\b|pool:|pool practice|pool match)/i;

export function defaultActorSpeedForTest(entity) {
  return entity?.type === 'dog' ? DOG_SPEED : HUMAN_SPEED;
}

export function hasActivePoolChoreographyForTest(entity) {
  const action = `${entity?.action || ''} ${entity?.pose || ''}`.toLowerCase();
  return Number(entity?.actionT || 0) > 0 && action.includes('pool');
}

export function shouldPreferBaseActorVisualForTest(entity) {
  if (!entity || entity.hidden) return false;
  const hasPath = Array.isArray(entity.path) && entity.path.length > 0;
  const movingVelocity = Math.hypot(Number(entity.vx || 0), Number(entity.vy || 0)) > .08;
  const activeTimedActivity = Number(entity.actionT || 0) > 0;
  return hasPath || movingVelocity || !activeTimedActivity;
}

export function prepareActorForManualRecoveryForTest(entity) {
  if (!entity) return entity;
  entity.poolRoute = null;
  entity.poolShotCooldown = 0;
  entity.actionT = 0;
  entity.actionTotal = 0;
  entity.currentActionId = null;
  entity.activityObjectId = null;
  entity.stopped = false;
  entity.manualStop = false;
  entity.vx = 0;
  entity.vy = 0;
  if (entity.carrying === 'cue_stick') entity.carrying = null;
  entity.action = 'Idle';
  entity.pose = 'stand';
  return normalizeP2ActorMotionForTest(entity);
}

export function normalizeP2ActorMotionForTest(entity) {
  if (!entity) return entity;

  entity.path = Array.isArray(entity.path)
    ? entity.path.filter(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))
    : [];
  entity.x = Number.isFinite(entity.x) ? entity.x : 120;
  entity.y = Number.isFinite(entity.y) ? entity.y : 120;
  entity.vx = Number.isFinite(entity.vx) ? entity.vx : 0;
  entity.vy = Number.isFinite(entity.vy) ? entity.vy : 0;
  entity.actionT = Number.isFinite(entity.actionT) ? Math.max(0, entity.actionT) : 0;
  entity.actionTotal = Number.isFinite(entity.actionTotal) ? Math.max(0, entity.actionTotal) : 0;
  entity.speed = Number.isFinite(entity.speed) && entity.speed > 0
    ? entity.speed
    : defaultActorSpeedForTest(entity);

  const activePool = hasActivePoolChoreographyForTest(entity);
  if (!activePool) {
    entity.poolRoute = null;
    if (entity.carrying === 'cue_stick') entity.carrying = null;
    if (String(entity.currentActionId || '').toLowerCase().includes('pool')) entity.currentActionId = null;
  } else {
    const poolPoints = entity.poolRoute?.points;
    if (entity.poolRoute && !Array.isArray(poolPoints)) entity.poolRoute = null;
  }

  const hasDestination = entity.path.length > 0 || Boolean(entity.target || entity.pending);
  if (!entity.labOnly && hasDestination && entity.stopped) {
    entity.stopped = false;
    entity.manualStop = false;
  } else if (entity.stopped && !entity.labOnly && entity.manualStop !== true) {
    entity.stopped = false;
  }

  if (!hasDestination && !activePool && entity.actionT <= 0 && !entity.hidden) {
    const action = String(entity.action || '');
    if (STALE_IDLE_ACTION.test(action)) {
      entity.action = 'Idle';
      entity.pose = 'stand';
      entity.currentActionId = null;
      entity.activityObjectId = null;
      entity.blockedT = 0;
      entity.recoveryCount = 0;
      entity.vx = 0;
      entity.vy = 0;
      entity.idleT = Math.max(0, Number(entity.idleT || 0));
    }
  }

  return entity;
}

export function installPhaserMigration2CharacterRecovery(game) {
  if (!game || game.__pm2CharacterRecoveryInstalled) return game;
  game.__pm2CharacterRecoveryInstalled = true;

  const waitForScene = window.setInterval(() => {
    const scene = game.scene?.getScene?.(GAME_SCENE_KEY);
    if (!scene?.events || !scene?.state) return;
    window.clearInterval(waitForScene);
    installSceneRecovery(scene);
  }, 40);

  window.setTimeout(() => window.clearInterval(waitForScene), 15000);
  return game;
}

function installSceneRecovery(scene) {
  if (scene.__pm2CharacterRecoveryInstalled) return;
  scene.__pm2CharacterRecoveryInstalled = true;
  scene.__pm2RecoveryPreupdateTicks = 0;
  scene.__pm2RecoveryPostupdateTicks = 0;

  const normalize = () => {
    scene.__pm2RecoveryPreupdateTicks += 1;
    for (const entity of scene.state?.entities || []) normalizeP2ActorMotionForTest(entity);
    exposeRecoveryDiagnostics(scene);
  };

  const repairSpriteVisibility = () => {
    scene.__pm2RecoveryPostupdateTicks += 1;
    for (const entity of scene.state?.entities || []) {
      if (!shouldPreferBaseActorVisualForTest(entity)) continue;
      const activityRecord = scene.referenceCompletion?.activitySprites?.get?.(entity.id);
      activityRecord?.sprite?.setVisible?.(false);
      setBaseActorVisualVisible(scene, entity.id, true);
      entity.pm2ReferenceActivityActive = false;
    }
  };

  scene.events.on('preupdate', normalize);
  scene.events.on('postupdate', repairSpriteVisibility);
  scene.events.once('shutdown', () => {
    scene.events.off('preupdate', normalize);
    scene.events.off('postupdate', repairSpriteVisibility);
    removeRecoveryGlobals();
  });
  scene.events.once('destroy', () => {
    scene.events.off('preupdate', normalize);
    scene.events.off('postupdate', repairSpriteVisibility);
    removeRecoveryGlobals();
  });

  if (typeof window !== 'undefined') {
    window.__APARTMENT_GOD_P2_RECOVER__ = () => forceRecoverPlayableActors(scene);
    window.__APARTMENT_GOD_P2_TEST_MOVE__ = () => testMoveSelectedActor(scene);
    window.__APARTMENT_GOD_P2_RUNTIME_STATUS__ = () => runtimeStatus(scene);
  }

  exposeRecoveryDiagnostics(scene);
}

function runtimeStatus(scene) {
  const scenePaused = Boolean(scene?.scene?.isPaused?.() || scene?.sys?.isPaused?.());
  const runtimeFailed = Boolean(scene?.runtimeFailed);
  const runtimeError = String(scene?.registry?.get?.('apartmentGodRuntimeError') || '');
  return {
    sceneAvailable: Boolean(scene?.state),
    scenePaused,
    runtimeFailed,
    runtimeError,
    statePaused: Boolean(scene?.state?.paused),
    preupdateTicks: Number(scene?.__pm2RecoveryPreupdateTicks || 0),
    postupdateTicks: Number(scene?.__pm2RecoveryPostupdateTicks || 0),
    gameLoopRunning: Boolean(scene?.game?.loop?.running)
  };
}

function forceRecoverPlayableActors(scene) {
  if (!scene?.state) return { ok: false, reason: 'scene_unavailable', status: runtimeStatus(scene), actors: [] };
  const before = runtimeStatus(scene);
  if (before.runtimeFailed) return { ok: false, reason: 'runtime_failed', status: before, actors: [] };
  if (before.scenePaused) scene.scene?.resume?.();
  scene.state.paused = false;
  for (const entity of scene.state.entities || []) {
    if (!entity || entity.hidden || entity.labOnly) continue;
    prepareActorForManualRecoveryForTest(entity);
    entity.path = [];
    entity.target = null;
    entity.pending = null;
    entity.idleT = 0;
  }
  scene.state.saveStatus = { message: 'Character movement recovery applied' };
  exposeRecoveryDiagnostics(scene);
  return { ok: true, status: runtimeStatus(scene), actors: window.__APARTMENT_GOD_P2_ACTORS__ || [] };
}

function testMoveSelectedActor(scene) {
  if (!scene?.state) return { ok: false, reason: 'scene_unavailable', status: runtimeStatus(scene) };
  const recovery = forceRecoverPlayableActors(scene);
  if (!recovery.ok) return recovery;
  const state = scene.state;
  const actor = state.entities?.find(entity => entity.id === state.selectedId && !entity.hidden && !entity.labOnly)
    || state.entities?.find(entity => !entity.hidden && !entity.labOnly && entity.type === 'person');
  if (!actor) return { ok: false, reason: 'actor_unavailable', status: runtimeStatus(scene) };

  const start = { x: actor.x, y: actor.y };
  const offsets = [[96, 0], [-96, 0], [0, 96], [0, -96], [64, 64], [-64, 64]];
  for (const [dx, dy] of offsets) {
    commandMove(actor, start.x + dx, start.y + dy, false);
    if (actor.path?.length) {
      state.floor = actor.floor;
      state.selectedId = actor.id;
      state.saveStatus = { message: `Movement test routed ${actor.name}` };
      exposeRecoveryDiagnostics(scene);
      return { ok: true, actorId: actor.id, start, pathLength: actor.path.length, status: runtimeStatus(scene) };
    }
  }

  state.saveStatus = { message: `Movement test could not route ${actor.name}` };
  exposeRecoveryDiagnostics(scene);
  return { ok: false, reason: 'no_route', actorId: actor.id, start, status: runtimeStatus(scene) };
}

function removeRecoveryGlobals() {
  if (typeof window === 'undefined') return;
  delete window.__APARTMENT_GOD_P2_RECOVER__;
  delete window.__APARTMENT_GOD_P2_TEST_MOVE__;
  delete window.__APARTMENT_GOD_P2_RUNTIME_STATUS__;
}

function exposeRecoveryDiagnostics(scene) {
  if (typeof window === 'undefined') return;
  const actors = (scene.state?.entities || []).map(entity => ({
    id: entity.id,
    x: entity.x,
    y: entity.y,
    speed: entity.speed,
    stopped: Boolean(entity.stopped),
    manualStop: Boolean(entity.manualStop),
    pathLength: Array.isArray(entity.path) ? entity.path.length : 0,
    poolRouteLength: Array.isArray(entity.poolRoute?.points) ? entity.poolRoute.points.length : 0,
    poolActive: hasActivePoolChoreographyForTest(entity),
    actionT: Number(entity.actionT || 0),
    action: entity.action || 'Idle',
    pose: entity.pose || 'stand'
  }));
  window.__APARTMENT_GOD_P2_ACTORS__ = actors;
}
