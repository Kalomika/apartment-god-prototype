import { applyWorkCompletion } from './careerSystem.js';
import { changeNeed, log, say, setMood } from './state.js';

export const DAILY_DESTINATIONS = [
  { id: 'work', label: 'Four Hour Work Shift', cost: 0, duration: 11, hours: [5, 24], scene: 'work', stat: 'money', money: 95, fun: -2, energy: -8 },
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
  const duration = adjustedDuration(destination?.duration ?? 30, vehicleId);
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

function adjustedDuration(duration, vehicleId) {
  if (vehicleId === 'bike') return Math.max(12, Math.round(duration * .72));
  if (vehicleId === 'motorbike') return Math.max(10, Math.round(duration * .58));
  return duration;
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
      changeNeed(e, 'hunger', -8);
      applyWorkCompletion(state, e);
    } else {
      changeNeed(e, 'fun', destination?.fun ?? 22);
      changeNeed(e, 'energy', destination?.energy ?? -8);
      changeNeed(e, 'social', destination?.social ?? 0);
      changeNeed(e, 'freshness', destination?.freshness ?? 0);
      if (action === 'movies') { setMood(e, 'happy'); say(e, 'MOVIE'); }
      if (action === 'date') { setMood(e, 'love'); say(e, 'DATE'); }
      if (destination?.activities?.length) log(state, `${e.name} enjoyed ${destination.activities.join(', ')} at ${destination.label}.`);
    }
  }
}
