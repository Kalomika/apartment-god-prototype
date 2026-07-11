import { createStarshotEventBus, STARSHOT_EVENTS } from '../src/starshot/eventBus.js';
import { createStarshotTimingController, TIMING_PROFILES } from '../src/starshot/timingController.js';
import { createActorRuntimeState } from '../src/starshot/actorRuntimeState.js';
import { createActorDebugSnapshot, formatActorDebugLine, formatTimingDebugLine } from '../src/starshot/debugSnapshot.js';
import { createActorUpdatePipeline } from '../src/starshot/actorUpdatePipeline.js';

const bus = createStarshotEventBus({ maxHistory: 4 });
let seen = 0;
bus.on(STARSHOT_EVENTS.ATTACK_STARTED, event => {
  if (event.payload.actorId === 'fighter-a') seen += 1;
});
bus.emit(STARSHOT_EVENTS.ATTACK_STARTED, { actorId: 'fighter-a', t: 1.25, frame: 3 });
if (seen !== 1) throw new Error('Starshot event bus did not deliver attack_started.');
if (bus.recent(1)[0]?.type !== STARSHOT_EVENTS.ATTACK_STARTED) throw new Error('Starshot event history did not retain attack_started.');

const timing = createStarshotTimingController();
timing.requestImpactPause(0.1, 'starshot-smoke');
let snap = timing.update(0.04);
if (snap.profile !== TIMING_PROFILES.IMPACT_PAUSE || snap.scaledDt !== 0) throw new Error('Impact pause timing did not freeze scaled dt.');
snap = timing.update(0.12);
if (snap.profile !== TIMING_PROFILES.REAL_TIME) throw new Error('Timing controller did not recover to real_time.');

const fighter = {
  id: 'fighter-a',
  team: 'A',
  archetypeId: 'suit_operative',
  name: 'Suit Operative',
  x: 140,
  y: 210,
  facing: Math.PI / 2,
  lastMove: 0.72,
  currentMove: { id: 'sweep_kick', kind: 'sweep', target: 'fighter-b', zone: 'legs' },
  memory: { command: { type: 'push', x: 160, y: 230 } },
  brain: { intent: 'pressure' },
  cqc: { lastZone: 'legs' }
};

const runtime = createActorRuntimeState(fighter, null, { timing: timing.snapshot() });
if (runtime.animation.state !== 'attack_heavy') throw new Error(`Expected attack_heavy animation state, got ${runtime.animation.state}.`);
if (runtime.combat.targetId !== 'fighter-b') throw new Error('Runtime combat target did not preserve current move target.');

const actorSnapshot = createActorDebugSnapshot(fighter, null, { timing: timing.snapshot() });
const line = formatActorDebugLine(actorSnapshot);
if (!line.includes('anim:attack_heavy') || !line.includes('combat:active_move')) throw new Error(`Unexpected actor debug line: ${line}`);

const timingLine = formatTimingDebugLine({ timing: timing.snapshot(), actors: [actorSnapshot], eventCount: 1 });
if (!timingLine.includes('STARSHOT')) throw new Error('Timing debug line missing Starshot header.');

let stageCount = 0;
const pipeline = createActorUpdatePipeline({ debug: () => { stageCount += 1; } });
const actor = {};
const updated = pipeline.updateActor(fighter, actor, { timing: timing.snapshot() });
if (stageCount !== 1) throw new Error('Starshot actor update pipeline did not run debug stage.');
if (actor.starshotRuntime !== updated) throw new Error('Pipeline did not attach runtime state to actor.');

console.log('Starshot smoke passed.');
