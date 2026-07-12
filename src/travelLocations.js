import { applyWorkCompletion } from './careerSystem.js';
import { changeNeed, log, say, setMood } from './state.js';

export const DAILY_DESTINATIONS = [
  { id: 'work', label: 'Work Shift', cost: 0, duration: 60, hours: [5, 24], scene: 'work', stat: 'money', money: 95, fun: -5, energy: -14 },
  { id: 'errand', label: 'Quick Errand', cost: 20, duration: 30, hours: [7, 23], scene: 'errand', fun: 4, energy: -6 },
  { id: 'mall', label: 'Mall Trip', cost: 55, duration: 60, hours: [10, 22], scene: 'mall', fun: 14, social: 8, energy: -8 },
  { id: 'movies', label: 'Movie Theater', cost: 32, duration: 120, hours: [11, 25], scene: 'theater', fun: 24, social: 10, energy: -7 },
  { id: 'date', label: 'Date Night', cost: 72, duration: 90, hours: [17, 25], scene: 'date', fun: 20, social: 22, energy: -10 }
];

export const VACATION_DESTINATIONS = [
  { id: 'vacation_beach', label: 'Beach Resort', cost: 420, duration: 140, scene: 'beach_resort', activities: ['surf', 'relax', 'treasure_search'], fun: 30, freshness: 12, energy: -14 },
  { id: 'vacation_alps', label: 'The Alps', cost: 680, duration: 150, scene: 'alps', activities: ['ski', 'hot_cocoa', 'sightsee'], fun: 26, freshness: 18, energy: -18 },
  { id: 'vacation_camping', label: 'Forest Camping', cost: 240, duration: 130, scene: 'camping', activities: ['hike', 'campfire', 'stargaze'], fun: 24, freshness: 16, energy: -20 },
  { id: 'vacation_tokyo', label: 'Neon Tokyo', cost: 760, duration: 160, scene: 'tokyo', activities: ['arcade', 'ramen', 'night_walk'], fun: 32, social: 12, energy: -18 },
  { id: 'vacation_paris', label: 'Paris Weekend', cost: 720, duration: 150, scene: 'paris', activities: ['museum', 'cafe', 'walk'], fun: 28, social: 12, energy: -14 },
  { id: 'vacation_safari', label: 'Kenya Safari', cost: 820, duration: 160, scene: 'safari', activities: ['safari_drive', 'photo', 'sunset'], fun: 34, freshness: 10, energy: -18 },
  { id: 'vacation_island', label: 'Private Island', cost: 930, duration: 160, scene: 'private_island', activities: ['snorkel', 'relax', 'treasure_search'], fun: 36, freshness: 16, energy: -16 },
  { id: 'vacation_vegas', label: 'Vegas Lights', cost: 650, duration: 140, scene: 'vegas', activities: ['show', 'buffet', 'night_walk'], fun: 28, social: 10, energy: -22 },
  { id: 'vacation_cruise', label: 'Cruise Ship', cost: 700, duration: 150, scene: 'cruise', activities: ['deck_walk', 'buffet', 'show'], fun: 30, social: 14, energy: -12 },
  { id: 'vacation_desert', label: 'Desert Spa', cost: 540, duration: 130, scene: 'desert_spa', activities: ['spa', 'stargaze', 'hike'], fun: 22, freshness: 20, energy: -10 }
];

export const ALL_TRAVEL = [...DAILY_DESTINATIONS, ...VACATION_DESTINATIONS];

export function destinationFor(actionId) {
  return ALL_TRAVEL.find(d => d.id === actionId) || DAILY_DESTINATIONS.find(d => d.id === actionId) || null;
}

export function currentHour(state) {
  return Math.floor((state.time % 1440) / 60);
}

export function isDestinationOpen(state, destination) {
  if (!destination?.hours) return true;
  const hour = currentHour(state);
  const [start, end] = destination.hours;
  if (end >= 24) return hour >= start || hour < end - 24;
  return hour >= start && hour < end;
}

export function hasTravelPass(state, actionId) {
  return Boolean(state.rewards?.freeTickets?.[actionId] || (actionId.startsWith('vacation_') && state.rewards?.freeTickets?.vacation_any));
}

export function consumeTravelPass(state, actionId) {
  if (state.rewards?.freeTickets?.[actionId]) { state.rewards.freeTickets[actionId] -= 1; return true; }
  if (actionId.startsWith('vacation_') && state.rewards?.freeTickets?.vacation_any) { state.rewards.freeTickets.vacation_any -= 1; return true; }
  return false;
}

export function travelCost(destination, vehicleId = 'auto') {
  if (!destination || destination.cost <= 0) return 0;
  if (vehicleId === 'bike') return Math.max(0, Math.round(destination.cost * .45));
  if (vehicleId === 'motorbike') return Math.max(0, Math.round(destination.cost * .62));
  return destination.cost;
}

export function canAffordTravel(state, destination, vehicleId = 'auto') {
  const cost = travelCost(destination, vehicleId);
  return !destination || cost <= 0 || state.money >= cost || hasTravelPass(state, destination.id);
}

export function payForTravel(state, destination, vehicleId = 'auto') {
  if (!destination) return true;
  const cost = travelCost(destination, vehicleId);
  if (cost <= 0) return true;
  if (consumeTravelPass(state, destination.id)) {
    log(state, `Used a free ticket for ${destination.label}.`);
    return true;
  }
  if (state.money < cost) {
    log(state, `Not enough money for ${destination.label}. Need $${cost}.`);
    return false;
  }
  state.money -= cost;
  log(state, `Paid $${cost} for ${destination.label}.`);
  return true;
}

export function createOffsiteJob(actionId, partyIds, vehicleId = 'car_1') {
  const destination = destinationFor(actionId);
  const vacation = actionId.startsWith('vacation_');
  const duration = Math.max(1, destination?.duration ?? 30);
  return {
    actionId,
    destinationId: destination?.id || actionId,
    label: destination?.label || actionId.replaceAll('_', ' '),
    t: duration,
    baseDuration: duration,
    bookedDuration: duration,
    actors: partyIds,
    vehicleId,
    stage: vacation ? 'plane' : 'activity',
    scene: vacation ? 'plane' : destination?.scene || actionId,
    destinationScene: destination?.scene || actionId,
    progress: 0,
    planeT: vacation ? 12 : 0,
    planeTotal: vacation ? 12 : 0,
    vacation,
    returning: false,
    activities: destination?.activities || [],
    treasureSeed: Math.random()
  };
}

export function updateOffsiteJob(state, dt) {
  const job = state.offsite;
  if (!job) return false;
  if (job.stage === 'plane' || job.stage === 'return_plane') {
    const total = job.planeTotal || 12;
    job.planeT -= dt;
    job.progress = 1 - Math.max(0, job.planeT) / total;
    if (job.planeT <= 0) {
      if (job.stage === 'return_plane') {
        log(state, `Return flight landed from ${job.label}.`);
        return true;
      }
      job.stage = 'activity';
      job.scene = job.destinationScene;
      job.progress = 0;
      log(state, `Plane arrived at ${job.label}.`);
    }
    return false;
  }
  job.t -= dt;
  const duration = Math.max(1, job.bookedDuration || job.baseDuration || destinationFor(job.actionId)?.duration || 30);
  job.progress = 1 - Math.max(0, job.t) / duration;
  if (job.t > 0) return false;
  if (job.vacation && !job.returning) {
    job.returning = true;
    job.stage = 'return_plane';
    job.scene = 'plane';
    job.planeT = 12;
    job.planeTotal = 12;
    job.progress = 0;
    log(state, `Leaving ${job.label}. Return flight boarding.`);
    return false;
  }
  return true;
}

export function applyOffsiteRewards(state, job) {
  const destination = destinationFor(job.actionId);
  const action = job.actionId;
  for (const id of job.actors || []) {
    const e = state.entities.find(x => x.id === id);
    if (!e) continue;
    if (action === 'work') {
      changeNeed(e, 'hunger', -14);
      applyWorkCompletion(state, e);
    } else {
      changeNeed(e, 'fun', destination?.fun ?? 22);
      changeNeed(e, 'hunger', -12);
      changeNeed(e, 'energy', destination?.energy ?? -12);
      changeNeed(e, 'freshness', destination?.freshness ?? -3);
      if (job.vehicleId === 'bike') { changeNeed(e, 'freshness', -7); changeNeed(e, 'energy', -4); }
      if (job.vehicleId === 'motorbike') { changeNeed(e, 'freshness', -4); changeNeed(e, 'energy', -2); }
      if (destination?.social) changeNeed(e, 'social', destination.social);
    }
    if (action === 'movies') e.memory.movies.push(randomMovieTitle(state));
    if (action.includes('beach') && job.activities?.includes('treasure_search')) maybeFindBeachGold(state, e, job);
    setMood(e, action === 'work' ? 'tired' : 'happy');
    say(e, action === 'work' ? 'WORK' : 'TRIP');
  }
  recordSecretActivity(state, action);
  maybeAwardSecretTickets(state);
}

export function recordSecretActivity(state, actionId) {
  state.secretLog ??= { used: {}, lastRewardAt: 0 };
  state.secretLog.used[actionId] = (state.secretLog.used[actionId] || 0) + 1;
}

export function maybeAwardSecretTickets(state) {
  const usedCount = Object.keys(state.secretLog?.used || {}).length;
  state.rewards ??= { freeTickets: {}, messages: [] };
  if (usedCount >= 12 && !state.rewards.messages.includes('feature_explorer')) {
    state.rewards.freeTickets.vacation_any = (state.rewards.freeTickets.vacation_any || 0) + 1;
    state.rewards.messages.push('feature_explorer');
    log(state, 'Email reward: free vacation ticket for exploring the game.');
  }
}

function maybeFindBeachGold(state, actor, job) {
  const chance = 0.18 + ((actor.skills?.learning || 1) * 0.025);
  if (job.treasureSeed < chance) {
    const amount = 900 + Math.floor(job.treasureSeed * 5000);
    state.money += amount;
    log(state, `${actor.name} found hidden gold near the beach and gained $${amount}.`);
    say(actor, 'GOLD');
  }
}

function randomMovieTitle(state) {
  const n = Math.floor((state.time + Math.random() * 1000) % 6);
  return ['Neon Tenants', 'Garage Gods', 'The Midnight Lease', 'Beach Money', 'Apartment Zero', 'Last Train to Render'][n];
}
