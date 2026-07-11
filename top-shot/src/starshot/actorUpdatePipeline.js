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
  const handlers = { ...stages };

  function setStage(stage, handler) {
    if (!STARSHOT_UPDATE_STAGES.includes(stage)) throw new Error(`Unknown Starshot stage: ${stage}`);
    if (typeof handler !== 'function') throw new Error(`Starshot stage handler must be a function: ${stage}`);
    handlers[stage] = handler;
  }

  function updateActor(fighter, actor, context = {}) {
    const runtime = updateActorRuntimeState(context.runtime || null, fighter, actor, context);
    const stageContext = { ...context, fighter, actor, runtime };
    for (const stage of STARSHOT_UPDATE_STAGES) {
      handlers[stage]?.(stageContext);
    }
    return runtime;
  }

  function updateActors(fighters = [], actorMap = new Map(), context = {}) {
    const runtimes = new Map();
    for (const fighter of fighters) {
      const actor = actorMap?.get?.(fighter.id) || null;
      const runtime = updateActor(fighter, actor, context);
      runtimes.set(runtime.id, runtime);
    }
    return runtimes;
  }

  return { setStage, updateActor, updateActors };
}

export function createNoopActorUpdatePipeline() {
  return createActorUpdatePipeline();
}
