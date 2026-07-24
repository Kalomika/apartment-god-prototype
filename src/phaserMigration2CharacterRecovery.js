import { setBaseActorVisualVisible } from './phaserCharacterAnimationSystem.js';

const GAME_SCENE_KEY = 'ApartmentGodNativeScene';
const HUMAN_SPEED = 92;
const DOG_SPEED = 120;
const STALE_IDLE_ACTION = /^(?:recovered|runtime recovered|walking|running|going to\b|waking up|blocked|no route\b|pool:)/i;

export function defaultActorSpeedForTest(entity) {
  return entity?.type === 'dog' ? DOG_SPEED : HUMAN_SPEED;
}

export function hasActivePoolChoreographyForTest(entity) {
  const points = entity?.poolRoute?.points;
  const hasRoute = Array.isArray(points) && points.length > 0;
  const action = `${entity?.currentActionId || ''} ${entity?.action || ''} ${entity?.pose || ''}`.toLowerCase();
  const timedPoolAction = Number(entity?.actionT || 0) > 0 && action.includes('pool');
  return hasRoute || timedPoolAction;
}

export function shouldPreferBaseActorVisualForTest(entity) {
  if (!entity || entity.hidden) return false;
  const hasPath = Array.isArray(entity.path) && entity.path.length > 0;
  const movingVelocity = Math.hypot(Number(entity.vx || 0), Number(entity.vy || 0)) > .08;
  const activeTimedActivity = Number(entity.actionT || 0) > 0;
  return hasPath || movingVelocity || !activeTimedActivity;
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

  const poolPoints = entity.poolRoute?.points;
  if (entity.poolRoute && (!Array.isArray(poolPoints) || poolPoints.length === 0)) entity.poolRoute = null;

  if (entity.stopped && !entity.labOnly && entity.manualStop !== true) entity.stopped = false;

  const activePool = hasActivePoolChoreographyForTest(entity);
  const hasDestination = entity.path.length > 0 || Boolean(entity.target || entity.pending);
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

  const normalize = () => {
    for (const entity of scene.state?.entities || []) normalizeP2ActorMotionForTest(entity);
    exposeRecoveryDiagnostics(scene);
  };

  const repairSpriteVisibility = () => {
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
  });
  scene.events.once('destroy', () => {
    scene.events.off('preupdate', normalize);
    scene.events.off('postupdate', repairSpriteVisibility);
  });

  normalize();
  repairSpriteVisibility();
}

function exposeRecoveryDiagnostics(scene) {
  if (typeof window === 'undefined') return;
  const actors = (scene.state?.entities || []).map(entity => ({
    id: entity.id,
    x: entity.x,
    y: entity.y,
    speed: entity.speed,
    stopped: Boolean(entity.stopped),
    pathLength: Array.isArray(entity.path) ? entity.path.length : 0,
    poolRouteLength: Array.isArray(entity.poolRoute?.points) ? entity.poolRoute.points.length : 0,
    action: entity.action || 'Idle',
    pose: entity.pose || 'stand'
  }));
  window.__APARTMENT_GOD_P2_ACTORS__ = actors;
}
