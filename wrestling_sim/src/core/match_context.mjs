import { classifyRingZone, randomRingPosition, randomStepToward, zoneTagsFor } from './ring_zones.mjs';

export function createMatchContext(profileA, profileB) {
  const wrestlerA = createWrestlerState(profileA, { x: -0.28, z: 0 });
  const wrestlerB = createWrestlerState(profileB, { x: 0.28, z: 0 });

  return {
    turn: 0,
    maxTurns: 90,
    crowdHeat: 0.2,
    finished: false,
    finish: null,
    wrestlers: [wrestlerA, wrestlerB],
    eventLog: [],
    zoneTagsFor: (position) => zoneTagsFor(classifyRingZone(position))
  };
}

export function createWrestlerState(profile, position = randomRingPosition()) {
  return {
    profile,
    position,
    zone: classifyRingZone(position),
    condition: {
      health: 1,
      stamina: 1,
      stun: 0,
      momentum: 0
    },
    history: {
      movesTried: 0,
      movesLanded: 0,
      lockupsWon: 0,
      lockupsLost: 0
    }
  };
}

export function advancePosition(actor, opponent) {
  actor.position = randomStepToward(actor.position, opponent.position, 0.16);
  actor.zone = classifyRingZone(actor.position);
}

export function distanceBetween(a, b) {
  return Math.hypot((a.position.x ?? 0) - (b.position.x ?? 0), (a.position.z ?? 0) - (b.position.z ?? 0));
}

export function decayConditions(wrestler) {
  wrestler.condition.stun = clamp01(wrestler.condition.stun - 0.04);
  wrestler.condition.momentum = clamp01(wrestler.condition.momentum - 0.015);
  wrestler.condition.stamina = clamp01(wrestler.condition.stamina + 0.025 * wrestler.profile.tendencies.staminaDiscipline);
}

export function checkFinish(context, actor, opponent, move) {
  if (move.category !== 'finish_check') return false;

  const pinChance = clamp01(
    0.18 + opponent.condition.stun * 0.58 + actor.condition.momentum * 0.18 - opponent.profile.stats.toughness * 0.22
  );

  if (Math.random() <= pinChance) {
    context.finished = true;
    context.finish = {
      winner: actor.profile.displayName,
      loser: opponent.profile.displayName,
      finishType: 'pinfall',
      turn: context.turn
    };
    return true;
  }

  context.eventLog.push(`${opponent.profile.displayName} escaped the pin attempt.`);
  return false;
}

export function buildMatchReport(context, managerStateByWrestlerId = new Map()) {
  const [a, b] = context.wrestlers;
  const winner = context.finish?.winner ?? decideByCondition(a, b);
  const loser = winner === a.profile.displayName ? b : a;
  const winnerState = winner === a.profile.displayName ? a : b;
  const managerState = managerStateByWrestlerId.get(winnerState.profile.id);

  return {
    winner,
    loser: loser.profile.displayName,
    finishType: context.finish?.finishType ?? 'judge decision',
    finishTurn: context.finish?.turn ?? context.turn,
    summary: `${winner} controlled the stronger match pattern through stamina, momentum, and better action selection.`,
    managerInfluence: managerState
      ? {
          accepted: managerState.acceptedChoices,
          ignored: managerState.ignoredChoices,
          ignoredReasons: managerState.ignoredReasons
        }
      : null,
    finalConditions: context.wrestlers.map((wrestler) => ({
      name: wrestler.profile.displayName,
      health: round2(wrestler.condition.health),
      stamina: round2(wrestler.condition.stamina),
      stun: round2(wrestler.condition.stun),
      momentum: round2(wrestler.condition.momentum)
    })),
    recentEvents: context.eventLog.slice(-10)
  };
}

function decideByCondition(a, b) {
  const aScore = a.condition.health + a.condition.stamina + a.condition.momentum - a.condition.stun;
  const bScore = b.condition.health + b.condition.stamina + b.condition.momentum - b.condition.stun;
  return aScore >= bScore ? a.profile.displayName : b.profile.displayName;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value)));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}
