import { changeNeed, log, say, setMood } from './state.js';

export const DAILY_DESTINATIONS = [
  { id: 'work', label: 'Work Shift', cost: 0, duration: 14, hours: [6, 22], scene: 'work', stat: 'money', money: 95, fun: -5, energy: -14 },
  { id: 'errand', label: 'Quick Errand', cost: 20, duration: 9, hours: [7, 23], scene: 'errand', fun: 4, energy: -6 },
  { id: 'mall', label: 'Mall Trip', cost: 55, duration: 12, hours: [10, 22], scene: 'mall', fun: 14, social: 8, energy: -8 },
  { id: 'movies', label: 'Movie Theater', cost: 32, duration: 13, hours: [11, 25], scene: 'theater', fun: 24, social: 10, energy: -7 },
  { id: 'date', label: 'Date Night', cost: 72, duration: 14, hours: [17, 25], scene: 'date', fun: 20, social: 22, energy: -10 }
];

export const VACATION_DESTINATIONS = [
  { id: 'vacation_beach', label: 'Beach Resort', cost: 420, duration: 22, scene: 'beach_resort', activities: ['surf', 'relax', 'treasure_search'], fun: 30, freshness: 12, energy: -14 },
  { id: 'vacation_alps', label: 'The Alps', cost: 680, duration: 24, scene: 'alps', activities: ['ski', 'hot_cocoa', 'sightsee'], fun: 26, freshness: 18, energy: -18 },
  { id: 'vacation_camping', label: 'Forest Camping', cost: 240, duration: 20, scene: 'camping', activities: ['hike', 'campfire', 'stargaze'], fun: 24, freshness: 16, energy: -20 },
  { id: 'vacation_tokyo', label: 'Neon Tokyo', cost: 760, duration: 25, scene: 'tokyo', activities: ['arcade', 'ramen', 'night_walk'], fun: 32, social: 12, energy: -18 },
  { id: 'vacation_paris', label: 'Paris Weekend', cost: 720, duration: 24, scene: 'paris', activities: ['museum', 'cafe', 'walk'], fun: 28, social: 12, energy: -14 },
  { id: 'vacation_safari', label: 'Kenya Safari', cost: 820, duration: 26, scene: 'safari', activities: ['safari_drive', 'photo', 'sunset'], fun: 34, freshness: 10, energy: -18 },
  { id: 'vacation_island', label: 'Private Island', cost: 930, duration: 26, scene: 'private_island', activities: ['snorkel', 'relax', 'treasure_search'], fun: 36, freshness: 16, energy: -16 },
  { id: 'vacation_vegas', label: 'Vegas Lights', cost: 650, duration: 22, scene: 'vegas', activities: ['show', 'buffet', 'night_walk'], fun: 28, social: 10, energy: -22 },
  { id: 'vacation_cruise', label: 'Cruise Ship', cost: 700, duration: 24, scene: 'cruise', activities: ['deck_walk', 'buffet', 'show'], fun: 30, social: 14, energy: -12 },
  { id: 'vacation_desert', label: 'Desert Spa', cost: 540, duration: 20, scene: 'desert_spa', activities: ['spa', 'stargaze', 'hike'], fun: 22, freshness: 20, energy: -10 }
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

export function canAffordTravel(state, destination) {
  return !destination || destination.cost <= 0 || state.money >= destination.cost || hasTravelPass(state, destination.id);
}

export function payForTravel(state, destination) {
  if (!destination) return true;
  if (destination.cost <= 0) return true;
  if (consumeTravelPass(state, destination.id)) {
    log(state, `Used a free ticket for ${destination.label}.`);
    return true;
  }
  if (state.money < destination.cost) {
    log(state, `Not enough money for ${destination.label}. Need $${destination.cost}.`);
    return false;
  }
  state.money -= destination.cost;
  log(state, `Paid $${destination.cost} for ${destination.label}.`);
  return true;
}

export function createOffsiteJob(actionId, partyIds, vehicleId = 'car_1') {
  const destination = destinationFor(actionId);
  const vacation = actionId.startsWith('vacation_');
  return {
    actionId,
    destinationId: destination?.id || actionId,
    label: destination?.label || actionId.replaceAll('_', ' '),
    t: destination?.duration ?? 10,
    actors: partyIds,
    vehicleId,
    stage: vacation ? 'plane' : 'activity',
    scene: vacation ? 'plane' : destination?.scene || actionId,
    destinationScene: destination?.scene || actionId,
    progress: 0,
    planeT: vacation ? 6 : 0,
    planeTotal: vacation ? 6 : 0,
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
    const total = job.planeTotal || 6;
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
  job.progress = 1 - Math.max(0, job.t) / Math.max(1, destinationFor(job.actionId)?.duration || 10);
  if (job.t > 0) return false;
  if (job.vacation && !job.returning) {
    job.returning = true;
    job.stage = 'return_plane';
    job.scene = 'plane';
    job.planeT = 6;
    job.planeTotal = 6;
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
    changeNeed(e, 'fun', destination?.fun ?? (action === 'work' ? -5 : 22));
    changeNeed(e, 'hunger', -12);
    changeNeed(e, 'energy', destination?.energy ?? -12);
    changeNeed(e, 'freshness', destination?.freshness ?? -3);
    if (destination?.social) changeNeed(e, 'social', destination.social);
    if (action === 'work') { state.money += destination?.money ?? 95; changeNeed(e, 'social', -4); awardWorkPerks(state, e); }
    if (action === 'movies') e.memory.movies.push(randomMovieTitle(state));
    if (action.includes('beach') && job.activities?.includes('treasure_search')) maybeFindBeachGold(state, e, job);
    setMood(e, action === 'work' ? 'tired' : 'happy');
    say(e, action === 'work' ? 'WORK' : 'TRIP');
  }
  recordSecretActivity(state, action);
  maybeAwardSecretTickets(state);
}

function awardWorkPerks(state, actor) {
  state.careers ??= { workHours: 0, movieTheaterHours: 0, airlineHours: 0 };
  state.rewards ??= { freeTickets: {}, messages: [] };
  state.careers.workHours += 8;
  state.careers.movieTheaterHours += 2;
  state.careers.airlineHours += 1;
  if (state.careers.movieTheaterHours >= 6) {
    state.careers.movieTheaterHours = 0;
    state.rewards.freeTickets.movies = (state.rewards.freeTickets.movies || 0) + 1;
    log(state, `${actor.name} earned free movie tickets from theater work perks.`);
  }
  if (state.careers.airlineHours >= 10) {
    state.careers.airlineHours = 0;
    state.rewards.freeTickets.vacation_any = (state.rewards.freeTickets.vacation_any || 0) + 1;
    log(state, `${actor.name} earned an airline standby vacation ticket.`);
  }
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
