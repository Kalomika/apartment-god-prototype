import { calendarDateLabel } from './calendarSystem.js';
import { adjustRelationship, ensureRelationshipState, relationshipBetween } from './reactionSystem.js';
import { changeNeed, log, say, setMood } from './state.js';

const DAY = 1440;
const MONTH = DAY * 30;
const YEAR = DAY * 360;
const MONTHLY_TARGET = 68;
const YEARLY_TARGET = 72;
const REVIEW_LIMIT = 18;

const OPTIONAL_CATEGORIES = new Set(['tv', 'reading', 'gaming', 'arcade', 'pool', 'darts', 'fitness', 'swimming', 'soccer', 'music', 'travel', 'dating', 'idle_fun']);
const ROMANCE_ACTIONS = new Set(['kiss', 'cuddle', 'hands', 'intimacy', 'bed_together', 'watch_together', 'date']);
const PRACTICAL_ACTIONS = new Set(['snack', 'meal', 'eat_meal', 'sleep', 'nap', 'shower', 'toilet', 'groom', 'brush', 'wash_dishes', 'take_trash_out', 'dump_trash', 'make_bed', 'work']);

export function ensureLifeQualityState(state) {
  state.lifeControl ??= { mode: 'semi_auto', pendingChoices: [] };
  state.lifeControl.mode = state.lifeControl.mode === 'auto' ? 'auto' : 'semi_auto';
  state.lifeControl.pendingChoices = Array.isArray(state.lifeControl.pendingChoices) ? state.lifeControl.pendingChoices.slice(-12) : [];
  state.lifeQuality ??= { lastMonthIndex: null, lastYearIndex: null, reviews: [], yearReviews: [] };
  state.lifeQuality.reviews = Array.isArray(state.lifeQuality.reviews) ? state.lifeQuality.reviews.slice(-REVIEW_LIMIT) : [];
  state.lifeQuality.yearReviews = Array.isArray(state.lifeQuality.yearReviews) ? state.lifeQuality.yearReviews.slice(-8) : [];
  for (const actor of people(state)) ensureActorLife(actor);
  ensureRelationshipState(state);
  return state.lifeQuality;
}

function ensureActorLife(actor) {
  actor.life ??= {};
  actor.life.passions = Array.isArray(actor.life.passions) && actor.life.passions.length ? actor.life.passions : defaultPassions(actor);
  actor.life.quality ??= {};
  actor.life.quality.monthly = normalizePeriod(actor.life.quality.monthly);
  actor.life.quality.yearly = normalizePeriod(actor.life.quality.yearly);
  actor.life.quality.scores ??= { current: 70, monthly: [], yearly: [] };
  actor.life.quality.boredom ??= {};
  actor.life.quality.avoidUntilMonth ??= {};
  actor.life.quality.breakingPoint = clamp(actor.life.quality.breakingPoint ?? 0, 0, 100);
  actor.life.quality.lastReviewLabel ||= '';
  return actor.life;
}

function normalizePeriod(period) {
  const p = period && typeof period === 'object' ? period : {};
  p.activities = p.activities && typeof p.activities === 'object' ? p.activities : {};
  p.satisfactionSum = Number.isFinite(p.satisfactionSum) ? p.satisfactionSum : 0;
  p.samples = Number.isFinite(p.samples) ? p.samples : 0;
  p.boredomSum = Number.isFinite(p.boredomSum) ? p.boredomSum : 0;
  return p;
}

function defaultPassions(actor) {
  if (actor.id === 'girlfriend') return ['social', 'dating', 'reading', 'travel', 'music'];
  if (actor.id === 'resident') return ['reading', 'gaming', 'fitness', 'creative', 'travel'];
  return ['reading', 'social', 'idle_fun'];
}

export function recordLifeActivity(state, actor, actionId, label = '') {
  if (!actor || actor.type !== 'person' || actor.labOnly) return null;
  ensureLifeQualityState(state);
  const category = activityCategory(actionId, label);
  const satisfaction = activitySatisfaction(state, actor, category, actionId);
  const boredom = activityBoredom(actor, category);
  recordPeriodActivity(actor.life.quality.monthly, category, satisfaction, boredom);
  recordPeriodActivity(actor.life.quality.yearly, category, satisfaction, boredom);
  actor.life.quality.boredom[category] = boredom;
  if (boredom >= 48 && OPTIONAL_CATEGORIES.has(category)) {
    actor.life.quality.avoidUntilMonth[category] = currentMonthIndex(state) + 1;
    changeNeed(actor, 'fun', -3);
    log(state, `${actor.name} is getting bored of too much ${category}.`);
  }
  if (ROMANCE_ACTIONS.has(actionId)) boostRomanceAroundAction(state, actor, actionId);
  return { category, satisfaction, boredom };
}

function recordPeriodActivity(period, category, satisfaction, boredom) {
  period.activities[category] ??= { count: 0, satisfactionSum: 0, boredomSum: 0, lastScore: 0 };
  const row = period.activities[category];
  row.count += 1;
  row.satisfactionSum += satisfaction;
  row.boredomSum += boredom;
  row.lastScore = satisfaction;
  period.satisfactionSum += satisfaction;
  period.boredomSum += boredom;
  period.samples += 1;
}

function activitySatisfaction(state, actor, category, actionId) {
  const passions = actor.life?.passions || [];
  let base = 58;
  if (passions.includes(category) || passions.includes(actionId)) base += 18;
  if (category === 'romance' || category === 'social') base += 6;
  if (category === 'work') base += careerSatisfaction(state, actor);
  if (category === 'chores') base -= actor.traits?.meticulous ? 2 : 8;
  if (category === 'sleep' || category === 'hygiene' || category === 'food') base += 4;
  const count = actor.life?.quality?.monthly?.activities?.[category]?.count || 0;
  const repetition = Math.max(0, count - (passions.includes(category) ? 6 : 3)) * 5;
  return clamp(base - repetition, 0, 100);
}

function activityBoredom(actor, category) {
  if (!OPTIONAL_CATEGORIES.has(category)) return 0;
  const passions = actor.life?.passions || [];
  const count = actor.life?.quality?.monthly?.activities?.[category]?.count || 0;
  const tolerance = passions.includes(category) ? 8 : 4;
  return clamp((count - tolerance) * 11, 0, 100);
}

function careerSatisfaction(state, actor) {
  const career = state.careers?.people?.[actor.id];
  if (!career || career.status !== 'employed') return -4;
  const warnings = career.lateWarnings || 0;
  const missed = career.missedShifts || 0;
  const pay = career.lastPay || 0;
  return clamp((pay >= 90 ? 6 : -3) - warnings * 2 - missed * 5, -18, 12);
}

function boostRomanceAroundAction(state, actor, actionId) {
  const partner = people(state).find(other => other.id !== actor.id && !other.hidden && other.floor === actor.floor);
  if (!partner) return;
  const amount = actionId === 'intimacy' ? 7 : actionId === 'date' ? 6 : actionId.includes('together') ? 4 : 3;
  adjustRelationship(state, actor.id, partner.id, { vibe: 2, romance: amount, annoyance: -2, reason: 'romance effort' });
  adjustRelationship(state, partner.id, actor.id, { vibe: 2, romance: amount, annoyance: -2, reason: 'romance effort' });
}

export function updateLifeQualitySystem(state) {
  ensureLifeQualityState(state);
  const monthIndex = currentMonthIndex(state);
  const yearIndex = currentYearIndex(state);
  if (state.lifeQuality.lastMonthIndex === null) state.lifeQuality.lastMonthIndex = monthIndex;
  if (state.lifeQuality.lastYearIndex === null) state.lifeQuality.lastYearIndex = yearIndex;
  if (monthIndex > state.lifeQuality.lastMonthIndex) {
    runMonthlyReview(state, state.lifeQuality.lastMonthIndex, monthIndex);
    state.lifeQuality.lastMonthIndex = monthIndex;
  }
  if (yearIndex > state.lifeQuality.lastYearIndex) {
    runYearlyReview(state, state.lifeQuality.lastYearIndex, yearIndex);
    state.lifeQuality.lastYearIndex = yearIndex;
  }
}

function runMonthlyReview(state, oldMonthIndex, newMonthIndex) {
  for (const actor of people(state)) {
    ensureActorLife(actor);
    const review = buildReview(state, actor, 'monthly', oldMonthIndex, actor.life.quality.monthly, MONTHLY_TARGET);
    actor.life.quality.scores.current = review.score;
    actor.life.quality.scores.monthly.push(review);
    actor.life.quality.scores.monthly = actor.life.quality.scores.monthly.slice(-12);
    actor.life.quality.lastReviewLabel = `${review.score}% monthly quality of life`;
    state.lifeQuality.reviews.unshift(review);
    state.lifeQuality.reviews = state.lifeQuality.reviews.slice(0, REVIEW_LIMIT);
    applyMonthlyConsequences(state, actor, review, newMonthIndex);
    actor.life.quality.monthly = normalizePeriod({});
  }
  log(state, `Monthly life review completed for ${calendarDateLabel(state)}.`);
}

function runYearlyReview(state, oldYearIndex, _newYearIndex) {
  for (const actor of people(state)) {
    ensureActorLife(actor);
    const review = buildReview(state, actor, 'yearly', oldYearIndex, actor.life.quality.yearly, YEARLY_TARGET);
    actor.life.quality.scores.yearly.push(review);
    actor.life.quality.scores.yearly = actor.life.quality.scores.yearly.slice(-8);
    state.lifeQuality.yearReviews.unshift(review);
    state.lifeQuality.yearReviews = state.lifeQuality.yearReviews.slice(0, 8);
    applyYearlyConsequences(state, actor, review);
    actor.life.quality.yearly = normalizePeriod({});
  }
  log(state, 'Yearly quality of life review completed.');
}

function buildReview(state, actor, period, index, data, target) {
  const needsScore = averageNeedScore(actor);
  const satisfaction = data.samples ? data.satisfactionSum / data.samples : 64;
  const boredomPenalty = data.samples ? Math.min(24, data.boredomSum / data.samples * 0.5) : 0;
  const relationScore = relationshipHealth(state, actor);
  const tidyPenalty = tidinessPenalty(state);
  const moneyScore = state.money >= 1000 ? 82 : state.money >= 300 ? 68 : state.money >= 80 ? 52 : 38;
  const score = clamp(Math.round(needsScore * .32 + satisfaction * .28 + relationScore * .2 + moneyScore * .1 + (100 - tidyPenalty) * .1 - boredomPenalty), 0, 100);
  const top = topActivities(data.activities, 5);
  const weak = lowestFactors({ needsScore, satisfaction, relationScore, moneyScore, tidyPenalty, boredomPenalty, top });
  return {
    id: `${period}_${index}_${actor.id}`,
    actorId: actor.id,
    actorName: actor.name,
    period,
    index,
    score,
    target,
    needsScore: Math.round(needsScore),
    satisfaction: Math.round(satisfaction),
    relationship: Math.round(relationScore),
    money: Math.round(moneyScore),
    tidinessPenalty: Math.round(tidyPenalty),
    boredomPenalty: Math.round(boredomPenalty),
    topActivities: top,
    weakFactors: weak,
    createdAt: state.time || 0
  };
}

function averageNeedScore(actor) {
  const needs = actor.needs || {};
  const values = ['hunger', 'freshness', 'energy', 'fun', 'bladder', 'social', 'stamina'].map(key => needs[key]).filter(Number.isFinite);
  if (!values.length) return 60;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function relationshipHealth(state, actor) {
  ensureRelationshipState(state);
  const rels = state.relationships?.[actor.id] || {};
  const rows = Object.entries(rels).filter(([id]) => people(state).some(e => e.id === id));
  if (!rows.length) return 62;
  const scores = rows.map(([, rel]) => clamp((rel.vibe ?? 50) + (rel.romance ?? 0) * .25 - (rel.beef ?? 0) * .35 - (rel.annoyance ?? 0) * .45, 0, 100));
  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function tidinessPenalty(state) {
  const rooms = state.tidiness?.rooms || {};
  const values = Object.values(rooms).filter(Number.isFinite);
  if (!values.length) return 0;
  return Math.min(35, values.reduce((sum, value) => sum + value, 0) / values.length * .35);
}

function topActivities(activities, limit) {
  return Object.entries(activities || {})
    .map(([id, row]) => ({ id, count: row.count || 0, satisfaction: row.count ? Math.round(row.satisfactionSum / row.count) : 0, boredom: row.count ? Math.round(row.boredomSum / row.count) : 0 }))
    .sort((a, b) => b.count - a.count || b.satisfaction - a.satisfaction)
    .slice(0, limit);
}

function lowestFactors(parts) {
  const rows = [
    ['needs', parts.needsScore],
    ['activity satisfaction', parts.satisfaction],
    ['relationship', parts.relationScore],
    ['money', parts.moneyScore],
    ['home tidiness', 100 - parts.tidyPenalty],
    ['boredom', 100 - parts.boredomPenalty * 3]
  ];
  return rows.sort((a, b) => a[1] - b[1]).slice(0, 3).map(([label, value]) => ({ label, value: Math.round(value) }));
}

function applyMonthlyConsequences(state, actor, review, monthIndex) {
  const below = review.target - review.score;
  if (below <= 0) {
    actor.life.quality.breakingPoint = clamp((actor.life.quality.breakingPoint || 0) - 6, 0, 100);
    if (review.score >= 82) {
      state.money += 24;
      log(state, `${actor.name}'s strong month earned a $24 quality of life bonus.`);
    }
    return;
  }

  actor.life.quality.breakingPoint = clamp((actor.life.quality.breakingPoint || 0) + below * .32, 0, 100);
  setMood(actor, review.score < 45 ? 'spooked' : 'tired');
  say(actor, review.score < 45 ? 'REVIEW' : 'PLAN');
  const mainIssue = review.weakFactors?.[0]?.label || 'quality of life';
  queueLifeChoice(state, actor, {
    type: review.score < 45 ? 'quality_warning' : 'quality_adjustment',
    severity: review.score < 45 ? 'major' : 'minor',
    label: `${actor.name} needs a better month`,
    reason: mainIssue,
    score: review.score,
    mode: state.lifeControl.mode,
    createdAt: state.time || 0
  });

  for (const item of review.topActivities || []) {
    if (item.boredom >= 48 && OPTIONAL_CATEGORIES.has(item.id)) actor.life.quality.avoidUntilMonth[item.id] = monthIndex + 1;
  }

  relationshipMonthPressure(state, actor, review);
}

function applyYearlyConsequences(state, actor, review) {
  if (review.score >= YEARLY_TARGET) {
    const bonus = review.score >= 86 ? 220 : 110;
    state.money += bonus;
    log(state, `${actor.name}'s year stayed healthy. Household bonus: $${bonus}.`);
    return;
  }
  queueLifeChoice(state, actor, {
    type: 'yearly_life_change_review',
    severity: review.score < 50 ? 'major' : 'medium',
    label: `${actor.name} is reviewing their year`,
    reason: review.weakFactors?.map(f => f.label).join(', ') || 'overall life quality',
    score: review.score,
    mode: state.lifeControl.mode,
    createdAt: state.time || 0
  });
  log(state, `${actor.name}'s yearly quality review is low at ${review.score}%.`);
}

function relationshipMonthPressure(state, actor, review) {
  const partner = people(state).find(other => other.id !== actor.id && other.type === 'person' && !other.labOnly);
  if (!partner) return;
  const rel = relationshipBetween(state, actor.id, partner.id);
  const romanceStress = review.score < 55 || review.weakFactors?.some(f => f.label === 'relationship');
  if (!romanceStress) return;
  adjustRelationship(state, actor.id, partner.id, { romance: -2, vibe: -1, patience: -2, reason: 'low life quality month' });
  adjustRelationship(state, partner.id, actor.id, { romance: -1, patience: -1, reason: 'felt distance this month' });
  const updated = relationshipBetween(state, actor.id, partner.id);
  if ((updated.romance ?? rel.romance ?? 50) < 35 || (updated.patience ?? 70) < 30) {
    queueLifeChoice(state, actor, {
      type: 'relationship_ultimatum_seed',
      severity: 'major',
      label: `${partner.name} may need relationship repair`,
      reason: 'romance or patience is dropping',
      score: review.score,
      mode: state.lifeControl.mode,
      createdAt: state.time || 0
    });
  }
}

function queueLifeChoice(state, actor, choice) {
  state.lifeControl ??= { mode: 'semi_auto', pendingChoices: [] };
  state.lifeControl.pendingChoices ??= [];
  if (state.lifeControl.mode === 'auto') {
    autoApplyLifeChoice(state, actor, choice);
    return;
  }
  state.lifeControl.pendingChoices.unshift({ id: `life_choice_${Math.floor(state.time || 0)}_${actor.id}_${Math.floor(Math.random() * 9999)}`, actorId: actor.id, ...choice });
  state.lifeControl.pendingChoices = state.lifeControl.pendingChoices.slice(0, 12);
  log(state, `${choice.label}: ${choice.reason}. Awaiting God approval in semi auto.`);
}

function autoApplyLifeChoice(state, actor, choice) {
  actor.life.quality.autoFocus = choice.reason || 'variety';
  actor.brain ??= {};
  actor.brain.recentActions = [];
  actor.brain.recentObjects = [];
  if (choice.type?.includes('quality')) changeNeed(actor, 'fun', 5);
  log(state, `${actor.name} auto adjusted after review: ${choice.reason}.`);
}

export function shouldAvoidActivityForNow(state, actor, actionId) {
  if (!actor || actor.type !== 'person') return false;
  const category = activityCategory(actionId, actionId);
  if (!OPTIONAL_CATEGORIES.has(category)) return false;
  if (PRACTICAL_ACTIONS.has(actionId)) return false;
  ensureActorLife(actor);
  const until = actor.life.quality.avoidUntilMonth?.[category] || 0;
  return until > currentMonthIndex(state);
}

export function lifeQualityHudLine(state, actor) {
  ensureLifeQualityState(state);
  if (!actor || actor.type !== 'person') return '';
  const score = actor.life?.quality?.scores?.current ?? 70;
  const breaking = Math.round(actor.life?.quality?.breakingPoint || 0);
  return `QoL: ${Math.round(score)}%${breaking > 0 ? ` Break ${breaking}%` : ''}`;
}

export function lifeQualityMenuRows(state, actor) {
  ensureLifeQualityState(state);
  ensureActorLife(actor);
  const score = actor.life.quality.scores.current ?? 70;
  const rows = [
    { label: `Mode: ${lifeControlLabel(state)}` },
    { label: `Quality of life: ${Math.round(score)}%` },
    { label: `Breaking point: ${Math.round(actor.life.quality.breakingPoint || 0)}%` }
  ];
  const top = topActivities(actor.life.quality.monthly.activities, 5);
  if (top.length) for (const item of top) rows.push({ label: `Top: ${item.id} x${item.count}, sat ${item.satisfaction}%, bored ${item.boredom}%` });
  else rows.push({ label: 'Top activities: none yet this month' });
  const pending = (state.lifeControl.pendingChoices || []).filter(choice => choice.actorId === actor.id).slice(0, 4);
  if (pending.length) for (const choice of pending) rows.push({ label: `Pending: ${choice.label}, ${choice.reason}` });
  const last = actor.life.quality.scores.monthly?.[actor.life.quality.scores.monthly.length - 1];
  if (last) rows.push({ label: `Last month: ${last.score}%, weak ${last.weakFactors.map(f => f.label).join(', ')}` });
  return rows;
}

export function toggleLifeControlMode(state) {
  ensureLifeQualityState(state);
  state.lifeControl.mode = state.lifeControl.mode === 'auto' ? 'semi_auto' : 'auto';
  log(state, `Life control mode: ${lifeControlLabel(state)}.`);
  return state.lifeControl.mode;
}

export function lifeControlLabel(state) {
  return state.lifeControl?.mode === 'auto' ? 'Auto life choices' : 'Semi auto, God approves major life choices';
}

export function activityCategory(actionId = '', label = '') {
  const text = `${actionId} ${label}`.toLowerCase();
  if (text.includes('work') || text.includes('career')) return 'work';
  if (text.includes('kiss') || text.includes('cuddle') || text.includes('hands') || text.includes('intimacy') || text.includes('date') || text.includes('bed together')) return 'romance';
  if (text.includes('talk') || text.includes('phone') || text.includes('social') || text.includes('together')) return 'social';
  if (text.includes('read') || text.includes('study') || text.includes('book')) return 'reading';
  if (text.includes('tv') || text.includes('comedy') || text.includes('horror') || text.includes('sports') || text.includes('movie')) return 'tv';
  if (text.includes('console') || text.includes('game')) return 'gaming';
  if (text.includes('arcade')) return 'arcade';
  if (text.includes('pool')) return 'pool';
  if (text.includes('dart')) return 'darts';
  if (text.includes('treadmill') || text.includes('lift') || text.includes('heavy bag')) return 'fitness';
  if (text.includes('swim')) return 'swimming';
  if (text.includes('soccer')) return 'soccer';
  if (text.includes('music') || text.includes('stereo')) return 'music';
  if (text.includes('trip') || text.includes('vacation') || text.includes('mall') || text.includes('errand')) return 'travel';
  if (text.includes('trash') || text.includes('dishes') || text.includes('make bed') || text.includes('return loose book')) return 'chores';
  if (text.includes('sleep') || text.includes('nap')) return 'sleep';
  if (text.includes('shower') || text.includes('toilet') || text.includes('groom') || text.includes('brush')) return 'hygiene';
  if (text.includes('snack') || text.includes('meal') || text.includes('eat') || text.includes('coffee')) return 'food';
  return 'idle_fun';
}

function people(state) {
  return (state.entities || []).filter(actor => actor && actor.type === 'person' && !actor.hidden && !actor.labOnly);
}

function currentMonthIndex(state) {
  return Math.floor((state.time || 0) / MONTH);
}

function currentYearIndex(state) {
  return Math.floor((state.time || 0) / YEAR);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
