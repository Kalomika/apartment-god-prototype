import { updateActorRuntimeState } from './actorRuntimeState.js';

export const STARSHOT_UPDATE_STAGES = Object.freeze([
  'profile',
  'ai',
  'combat',
  'motion',
  'animation',
  'rendering',
  'debug'
]);

export function createActorUpdatePipeline(stages = {}) {
  const handlers = {};
  for (const stage of STARSHOT_UPDATE_STAGES) {
    if (typeof stages[stage] === 'function') handlers[stage] = stages[stage];
  }

  function setStage(stage, handler) {
    assertStage(stage);
    if (typeof handler !== 'function') throw new Error(`Starshot stage handler must be a function: ${stage}`);
    handlers[stage] = handler;
    return () => removeStage(stage);
  }

  function removeStage(stage) {
    assertStage(stage);
    delete handlers[stage];
  }

  function updateActor(fighter, actor, context = {}) {
    const runtime = updateActorRuntimeState(context.runtime || actor?.starshotRuntime || null, fighter, actor, context);
    const stageContext = { ...context, fighter, actor, runtime };
    for (const stage of STARSHOT_UPDATE_STAGES) {
      const handler = handlers[stage];
      if (!handler) continue;
      handler(stageContext);
    }
    if (actor) actor.starshotRuntime = runtime;
    return runtime;
  }

  function updateActors(fighters = [], actorMap = new Map(), context = {}) {
    const runtimes = new Map();
    for (const fighter of fighters) {
      if (!fighter?.id) continue;
      const actor = actorMap?.get?.(fighter.id) || null;
      const runtime = updateActor(fighter, actor, context);
      runtimes.set(runtime.id, runtime);
    }
    return runtimes;
  }

  function activeStages() {
    return STARSHOT_UPDATE_STAGES.filter(stage => typeof handlers[stage] === 'function');
  }

  return { setStage, removeStage, updateActor, updateActors, activeStages };
}

export function createNoopActorUpdatePipeline() {
  return createActorUpdatePipeline();
}

function assertStage(stage) {
  if (!STARSHOT_UPDATE_STAGES.includes(stage)) throw new Error(`Unknown Starshot stage: ${stage}`);
}
