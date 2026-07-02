import { WrestlingStyle } from './wrestler_profile.mjs';

export function resolveLockup(attacker, defender, context) {
  const attackerScore = lockupScore(attacker, context) + randomPressure();
  const defenderScore = lockupScore(defender, context) + randomPressure();
  const margin = attackerScore - defenderScore;

  if (margin > 0.16) {
    return {
      outcome: 'attacker_advantage',
      margin
    };
  }

  if (margin < -0.16) {
    return {
      outcome: 'defender_counter',
      margin
    };
  }

  return {
    outcome: 'neutral_clash',
    margin
  };
}

export function scoreMove(move, wrestler, opponent, context, managerState) {
  const stats = wrestler.profile.stats;
  const tendencies = wrestler.profile.tendencies;

  let score = 0;

  score += move.damage * 1.7;
  score += move.crowd * 0.8;
  score -= Math.max(0, move.staminaCost) * 1.2;
  score -= move.risk * (1 - tendencies.riskTolerance);

  if (move.category === 'grapple') score += tendencies.grapplePreference * 0.45;
  if (move.category === 'strike') score += tendencies.strikePreference * 0.45;
  if (move.category === 'technical') score += stats.technique * 0.35;
  if (move.category === 'finish_check') score += tendencies.pinUrgency * opponent.condition.stun;
  if (move.category === 'strategy') score += (1 - wrestler.condition.stamina) * tendencies.staminaDiscipline;

  if (wrestler.profile.style === WrestlingStyle.POWERHOUSE && move.category === 'grapple') score += 0.25;
  if (wrestler.profile.style === WrestlingStyle.TECHNICIAN && move.category === 'technical') score += 0.25;
  if (wrestler.profile.style === WrestlingStyle.STRIKER && move.category === 'strike') score += 0.25;
  if (wrestler.profile.style === WrestlingStyle.SHOWMAN && move.crowd > 0.2) score += 0.2;

  if (context.crowdHeat > 0.65 && move.crowd > 0.2) score += 0.25;
  if (wrestler.condition.stamina < 0.3 && move.staminaCost > 0.1) score -= 0.55;
  if (opponent.condition.stun > 0.62 && move.category === 'finish_check') score += 0.6;

  const pending = managerState?.pendingChoice;
  if (pending?.moveId === move.id) {
    score += context.managerSuggestionWeight ?? 0;
  }

  score += Math.random() * 0.12;

  return score;
}

export function applyMoveResult(move, actor, opponent, context) {
  actor.condition.stamina = clamp01(actor.condition.stamina - move.staminaCost);

  if (move.staminaCost < 0) {
    actor.condition.stamina = clamp01(actor.condition.stamina - move.staminaCost);
  }

  const successBase = 0.55 + actor.profile.stats.technique * 0.18 + actor.profile.stats.awareness * 0.12;
  const riskPenalty = move.risk * (0.35 + opponent.profile.stats.counterSkill * 0.25);
  const staminaPenalty = actor.condition.stamina < 0.25 ? 0.2 : 0;
  const successChance = clamp01(successBase - riskPenalty - staminaPenalty);
  const success = Math.random() <= successChance;

  if (success) {
    opponent.condition.health = clamp01(opponent.condition.health - move.damage);
    opponent.condition.stun = clamp01(opponent.condition.stun + move.damage * 1.35 + move.crowd * 0.25);
    actor.condition.momentum = clamp01(actor.condition.momentum + move.crowd + move.damage * 0.6);
    context.crowdHeat = clamp01(context.crowdHeat + move.crowd * 0.35);
  } else {
    actor.condition.stun = clamp01(actor.condition.stun + move.risk * 0.25);
    opponent.condition.momentum = clamp01(opponent.condition.momentum + 0.08 + move.risk * 0.12);
    context.crowdHeat = clamp01(context.crowdHeat + move.risk * 0.08);
  }

  return {
    success,
    move,
    actorName: actor.profile.displayName,
    opponentName: opponent.profile.displayName
  };
}

function lockupScore(wrestler, context) {
  const stats = wrestler.profile.stats;
  const condition = wrestler.condition;

  let score = 0;
  score += stats.strength * 0.3;
  score += stats.technique * 0.28;
  score += stats.stamina * 0.12;
  score += stats.awareness * 0.14;
  score += stats.aggression * 0.1;
  score += condition.stamina * 0.18;
  score += condition.momentum * 0.12;

  if (wrestler.profile.style === WrestlingStyle.POWERHOUSE) score += 0.1;
  if (wrestler.profile.style === WrestlingStyle.TECHNICIAN) score += 0.08;
  if (context.crowdHeat > 0.7 && wrestler.profile.stats.charisma > 0.7) score += 0.06;

  return score;
}

function randomPressure() {
  return Math.random() * 0.16 - 0.08;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value)));
}
