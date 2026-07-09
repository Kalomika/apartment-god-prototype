import { changeNeed, log, say, setMood } from './state.js';

export const CAREER_TRACKS = [
  {
    id: 'storyboard_artist',
    label: 'Storyboard Artist',
    scheduleLabel: 'Mon to Fri, 9 AM to 5 PM',
    startHour: 9,
    endHour: 17,
    days: [1, 2, 3, 4, 5],
    basePay: 165,
    payRaise: 36,
    xpPerShift: 32,
    promoXp: 100,
    staminaCost: 14,
    energyCost: 16,
    funCost: 5,
    freshnessCost: 3,
    socialCost: 4,
    perk: 'creative'
  },
  {
    id: 'remote_support',
    label: 'Remote Support Lead',
    scheduleLabel: 'Mon to Fri, 8 AM to 4 PM',
    startHour: 8,
    endHour: 16,
    days: [1, 2, 3, 4, 5],
    basePay: 125,
    payRaise: 28,
    xpPerShift: 28,
    promoXp: 90,
    staminaCost: 10,
    energyCost: 14,
    funCost: 4,
    freshnessCost: 2,
    socialCost: 2,
    perk: 'steady'
  },
  {
    id: 'movie_theater',
    label: 'Movie Theater Crew',
    scheduleLabel: 'Thu to Sun, 4 PM to 11 PM',
    startHour: 16,
    endHour: 23,
    days: [0, 4, 5, 6],
    basePay: 92,
    payRaise: 18,
    xpPerShift: 24,
    promoXp: 80,
    staminaCost: 13,
    energyCost: 12,
    funCost: -6,
    freshnessCost: 4,
    socialCost: -4,
    perk: 'movie_tickets'
  },
  {
    id: 'airline_ground',
    label: 'Airline Ground Crew',
    scheduleLabel: 'Tue to Sat, 6 AM to 2 PM',
    startHour: 6,
    endHour: 14,
    days: [2, 3, 4, 5, 6],
    basePay: 142,
    payRaise: 30,
    xpPerShift: 30,
    promoXp: 95,
    staminaCost: 18,
    energyCost: 18,
    funCost: 6,
    freshnessCost: 6,
    socialCost: 2,
    perk: 'travel_standby'
  },
  {
    id: 'freelance_animator',
    label: 'Freelance Animator',
    scheduleLabel: 'Flexible, best between 10 AM and 8 PM',
    startHour: 10,
    endHour: 20,
    days: [0, 1, 2, 3, 4, 5, 6],
    basePay: 118,
    payRaise: 42,
    xpPerShift: 35,
    promoXp: 110,
    staminaCost: 16,
    energyCost: 18,
    funCost: -3,
    freshnessCost: 4,
    socialCost: 8,
    perk: 'creative'
  }
];

const TRACKS = new Map(CAREER_TRACKS.map(track => [track.id, track]));
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function defaultCareerState(actorId) {
  const trackId = actorId === 'girlfriend' ? 'remote_support' : actorId === 'resident' ? 'storyboard_artist' : '';
  return {
    trackId,
    level: 1,
    xp: 0,
    shiftsWorked: 0,
    lastWorkedDay: -1,
    lateWarnings: 0,
    missedShifts: 0,
    lastPay: 0,
    status: trackId ? 'employed' : 'unassigned'
  };
}

export function ensureCareers(state) {
  const existing = state.careers || {};
  state.careers = {
    workHours: existing.workHours || 0,
    movieTheaterHours: existing.movieTheaterHours || 0,
    airlineHours: existing.airlineHours || 0,
    people: existing.people || {},
    history: Array.isArray(existing.history) ? existing.history.slice(-12) : []
  };

  for (const actor of state.entities || []) {
    if (actor.type !== 'person' || actor.labOnly) continue;
    state.careers.people[actor.id] = normalizeCareer(state.careers.people[actor.id], actor.id);
  }
  return state.careers;
}

function normalizeCareer(career, actorId) {
  const base = defaultCareerState(actorId);
  const next = { ...base, ...(career || {}) };
  if (next.trackId && !TRACKS.has(next.trackId)) next.trackId = base.trackId;
  next.status = next.trackId ? 'employed' : 'unassigned';
  next.level = Math.max(1, Number(next.level) || 1);
  next.xp = Math.max(0, Number(next.xp) || 0);
  next.shiftsWorked = Math.max(0, Number(next.shiftsWorked) || 0);
  next.lastWorkedDay = Number.isFinite(next.lastWorkedDay) ? next.lastWorkedDay : -1;
  next.lateWarnings = Math.max(0, Number(next.lateWarnings) || 0);
  next.missedShifts = Math.max(0, Number(next.missedShifts) || 0);
  next.lastPay = Math.max(0, Number(next.lastPay) || 0);
  return next;
}

export function careerFor(state, actor) {
  if (!actor || actor.labOnly || actor.type !== 'person') return null;
  ensureCareers(state);
  return state.careers.people[actor.id] || null;
}

export function trackForCareer(career) {
  return career?.trackId ? TRACKS.get(career.trackId) || null : null;
}

export function assignCareer(state, actor, trackId) {
  if (!actor || actor.labOnly || actor.type !== 'person') return false;
  const track = TRACKS.get(trackId);
  if (!track) return false;
  ensureCareers(state);
  state.careers.people[actor.id] = {
    ...defaultCareerState(actor.id),
    trackId: track.id,
    status: 'employed'
  };
  log(state, `${actor.name} accepted a ${track.label} job.`);
  say(actor, 'JOB');
  return true;
}

export function quitCareer(state, actor) {
  if (!actor || actor.labOnly || actor.type !== 'person') return false;
  ensureCareers(state);
  state.careers.people[actor.id] = { ...defaultCareerState(actor.id), trackId: '', status: 'unassigned' };
  log(state, `${actor.name} quit their job.`);
  say(actor, 'QUIT');
  return true;
}

export function gameDay(state) {
  return Math.floor((state.time || 0) / 1440);
}

export function gameDayName(state) {
  return DAY_NAMES[gameDay(state) % 7];
}

export function currentHour(state) {
  return Math.floor(((state.time || 0) % 1440) / 60);
}

export function isWorkWindow(state, track) {
  if (!track) return false;
  const day = gameDay(state) % 7;
  const hour = currentHour(state);
  if (!track.days.includes(day)) return false;
  return hour >= track.startHour && hour < track.endHour;
}

export function shouldAutoStartWork(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track || actor.hidden || actor.stopped || actor.labOnly) return false;
  if (!isWorkWindow(state, track)) return false;
  if (career.lastWorkedDay === gameDay(state)) return false;
  if ((actor.needs?.energy ?? 100) < 14 || (actor.needs?.bladder ?? 100) < 14 || (actor.needs?.hunger ?? 100) < 12) return false;
  return true;
}

export function workDueText(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track) return 'No job';
  const due = isWorkWindow(state, track) && career.lastWorkedDay !== gameDay(state);
  const level = career.level || 1;
  const pay = payForShift(track, level);
  return `${track.label} L${level}, ${track.scheduleLabel}, $${pay}/shift${due ? ', due now' : ''}`;
}

export function careerHudLine(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track) return 'Career: none';
  return `Career: ${track.label} L${career.level} XP ${Math.round(career.xp)}/${promoThreshold(track, career.level)} Last $${Math.round(career.lastPay || 0)}`;
}

export function applyWorkCompletion(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track) {
    state.money += 85;
    log(state, `${actor.name} completed temp work and earned $85.`);
    return { pay: 85, promoted: false };
  }

  const pay = payForShift(track, career.level);
  state.money += pay;
  career.lastPay = pay;
  career.lastWorkedDay = gameDay(state);
  career.shiftsWorked += 1;
  career.xp += track.xpPerShift;
  state.careers.workHours = (state.careers.workHours || 0) + shiftHours(track);
  state.careers.history.unshift({ actorId: actor.id, trackId: track.id, pay, day: gameDay(state), level: career.level });
  state.careers.history = state.careers.history.slice(0, 12);

  let promoted = false;
  const threshold = promoThreshold(track, career.level);
  if (career.xp >= threshold) {
    career.xp -= threshold;
    career.level += 1;
    promoted = true;
    log(state, `${actor.name} was promoted in ${track.label} to level ${career.level}.`);
    say(actor, 'PROMO');
  }

  applyCareerNeeds(actor, track);
  awardCareerPerk(state, actor, track);
  setMood(actor, 'tired');
  log(state, `${actor.name} completed a ${track.label} shift and earned $${pay}.`);
  return { pay, promoted };
}

function applyCareerNeeds(actor, track) {
  changeNeed(actor, 'energy', -track.energyCost);
  changeNeed(actor, 'stamina', -track.staminaCost);
  changeNeed(actor, 'freshness', -track.freshnessCost);
  changeNeed(actor, 'fun', -track.funCost);
  changeNeed(actor, 'social', -track.socialCost);
}

function awardCareerPerk(state, actor, track) {
  state.rewards ??= { freeTickets: {}, messages: [] };
  if (track.perk === 'movie_tickets') {
    state.careers.movieTheaterHours = (state.careers.movieTheaterHours || 0) + shiftHours(track);
    if (state.careers.movieTheaterHours >= 14) {
      state.careers.movieTheaterHours = 0;
      state.rewards.freeTickets.movies = (state.rewards.freeTickets.movies || 0) + 1;
      log(state, `${actor.name} earned free movie tickets from theater work.`);
    }
  }
  if (track.perk === 'travel_standby') {
    state.careers.airlineHours = (state.careers.airlineHours || 0) + shiftHours(track);
    if (state.careers.airlineHours >= 24) {
      state.careers.airlineHours = 0;
      state.rewards.freeTickets.vacation_any = (state.rewards.freeTickets.vacation_any || 0) + 1;
      log(state, `${actor.name} earned an airline standby vacation ticket.`);
    }
  }
  if (track.perk === 'creative') changeNeed(actor, 'fun', 4);
}

function payForShift(track, level) {
  return Math.round(track.basePay + (Math.max(1, level) - 1) * track.payRaise);
}

function promoThreshold(track, level) {
  return Math.round(track.promoXp + (Math.max(1, level) - 1) * 35);
}

function shiftHours(track) {
  const raw = track.endHour - track.startHour;
  return raw > 0 ? raw : raw + 24;
}
