import { createWrestlerProfile, Temperament, WrestlingStyle } from './core/wrestler_profile.mjs';
import { createManagerChoiceState, InteractionMode, queueManagerChoice } from './core/manager_choice.mjs';
import { chooseNextAction, suggestedChoiceTray } from './core/decision_brain.mjs';
import { applyMoveResult, resolveLockup } from './core/grapple_resolver.mjs';
import {
  advancePosition,
  buildMatchReport,
  checkFinish,
  createMatchContext,
  decayConditions,
  distanceBetween
} from './core/match_context.mjs';

export function runDemoMatch({ interactionMode = InteractionMode.COACH_MODE } = {}) {
  const atlas = createWrestlerProfile({
    displayName: 'Atlas King',
    inspirationNotes: 'Power wrestler template with old school main event energy.',
    style: WrestlingStyle.POWERHOUSE,
    temperament: Temperament.AGGRESSIVE,
    stats: {
      strength: 0.86,
      speed: 0.42,
      stamina: 0.68,
      toughness: 0.78,
      technique: 0.48,
      charisma: 0.74,
      awareness: 0.52,
      aggression: 0.82,
      discipline: 0.44,
      counterSkill: 0.42
    },
    tendencies: {
      riskTolerance: 0.62,
      showboatChance: 0.35,
      grapplePreference: 0.78,
      strikePreference: 0.42,
      aerialPreference: 0.08,
      submissionPreference: 0.14,
      staminaDiscipline: 0.38,
      pinUrgency: 0.55
    }
  });

  const saint = createWrestlerProfile({
    displayName: 'Iron Saint',
    inspirationNotes: 'Technical counter wrestler template with patient pacing.',
    style: WrestlingStyle.TECHNICIAN,
    temperament: Temperament.METHODICAL,
    stats: {
      strength: 0.54,
      speed: 0.62,
      stamina: 0.76,
      toughness: 0.64,
      technique: 0.84,
      charisma: 0.5,
      awareness: 0.78,
      aggression: 0.46,
      discipline: 0.82,
      counterSkill: 0.78
    },
    tendencies: {
      riskTolerance: 0.32,
      showboatChance: 0.12,
      grapplePreference: 0.58,
      strikePreference: 0.36,
      aerialPreference: 0.12,
      submissionPreference: 0.72,
      staminaDiscipline: 0.82,
      pinUrgency: 0.48
    }
  });

  const context = createMatchContext(atlas, saint);
  const managerById = new Map([
    [atlas.id, createManagerChoiceState(interactionMode)],
    [saint.id, createManagerChoiceState(InteractionMode.FULL_AUTO)]
  ]);

  for (let turn = 1; turn <= context.maxTurns && !context.finished; turn += 1) {
    context.turn = turn;

    const [wrestlerA, wrestlerB] = context.wrestlers;
    const actor = turn % 2 === 1 ? wrestlerA : wrestlerB;
    const opponent = actor === wrestlerA ? wrestlerB : wrestlerA;
    const managerState = managerById.get(actor.profile.id);

    decayConditions(actor);
    decayConditions(opponent);

    if (turn === 5 && actor.profile.displayName === 'Atlas King') {
      queueManagerChoice(managerState, 'body_slam');
    }

    if (turn === 15 && actor.profile.displayName === 'Atlas King') {
      queueManagerChoice(managerState, 'recover');
    }

    const tray = suggestedChoiceTray(actor, opponent, context, 6);
    const distance = distanceBetween(actor, opponent);

    if (distance > 0.32) {
      advancePosition(actor, opponent);
      context.eventLog.push(`${actor.profile.displayName} closes distance. Choices: ${tray.map((item) => item.label).join(', ')}.`);
      continue;
    }

    const lockup = resolveLockup(actor, opponent, context);

    if (lockup.outcome === 'defender_counter') {
      opponent.history.lockupsWon += 1;
      actor.history.lockupsLost += 1;
      opponent.condition.momentum = Math.min(1, opponent.condition.momentum + 0.08);
      context.eventLog.push(`${opponent.profile.displayName} wins the lockup exchange against ${actor.profile.displayName}.`);
      continue;
    }

    if (lockup.outcome === 'neutral_clash') {
      actor.condition.stamina = Math.max(0, actor.condition.stamina - 0.03);
      opponent.condition.stamina = Math.max(0, opponent.condition.stamina - 0.03);
      context.eventLog.push(`${actor.profile.displayName} and ${opponent.profile.displayName} hit a neutral clash.`);
      continue;
    }

    actor.history.lockupsWon += 1;
    opponent.history.lockupsLost += 1;

    const move = chooseNextAction(actor, opponent, context, managerState);
    const result = applyMoveResult(move, actor, opponent, context);

    actor.history.movesTried += 1;
    if (result.success) actor.history.movesLanded += 1;

    context.eventLog.push(
      result.success
        ? `${actor.profile.displayName} lands ${move.label} on ${opponent.profile.displayName}.`
        : `${actor.profile.displayName} tries ${move.label}, but ${opponent.profile.displayName} avoids the worst of it.`
    );

    checkFinish(context, actor, opponent, move);
  }

  return buildMatchReport(context, managerById);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runDemoMatch(), null, 2));
}
