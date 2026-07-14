import { changeNeed, log, say, setMood } from './state.js';

const WORK_REAL_SECONDS_PER_SHIFT_HOUR = 2.75;

export const CAREER_TRACKS = [
  {
    id: 'storyboard_artist',
    label: 'Storyboard Artist',
    scheduleLabel: 'Mon, Tue, Thu, Fri, 9 AM to 5 PM',
    workloadLabel: 'Full day production schedule',
    workloadTier: 'full_day_creative',
    startHour: 9,
    endHour: 17,
    days: [1, 2, 4, 5],
    basePay: 285,
    payRaise: 54,
    xpPerShift: 36,
    promoXp: 120,
    staminaCost: 11,
    energyCost: 16,
    funCost: 7,
    freshnessCost: 4,
    socialCost: 5,
    perk: 'creative'
  },
  {
    id: 'remote_support',
    label: 'Remote Support Lead',
    scheduleLabel: 'Mon, Wed, Fri, 9 AM to 2 PM',
    workloadLabel: 'Shorter remote steady shifts',
    workloadTier: 'remote_part_time',
    startHour: 9,
    endHour: 14,
    days: [1, 3, 5],
    basePay: 135,
    payRaise: 30,
    xpPerShift: 21,
    promoXp: 90,
    staminaCost: 5,
    energyCost: 8,
    funCost: 3,
    freshnessCost: 1,
    socialCost: 2,
    perk: 'steady'
  },
  {
    id: 'movie_theater',
    label: 'Movie Theater Crew',
    scheduleLabel: 'Fri, Sat, Sun, 6 PM to 11 PM',
    workloadLabel: 'Evening part time shifts',
    workloadTier: 'part_time_evening',
    startHour: 18,
    endHour: 23,
    days: [5, 6, 0],
    basePay: 105,
    payRaise: 18,
    xpPerShift: 18,
    promoXp: 80,
    staminaCost: 6,
    energyCost: 7,
    funCost: -4,
    freshnessCost: 3,
    socialCost: -3,
    perk: 'movie_tickets'
  },
  {
    id: 'airline_ground',
    label: 'Airline Ground Crew',
    scheduleLabel: 'Tue, Wed, Fri, Sat, 7 AM to 3 PM',
    workloadLabel: 'Full day physical shifts',
    workloadTier: 'full_day_physical',
    startHour: 7,
    endHour: 15,
    days: [2, 3, 5, 6],
    basePay: 225,
    payRaise: 42,
    xpPerShift: 32,
    promoXp: 105,
    staminaCost: 16,
    energyCost: 15,
    funCost: 7,
    freshnessCost: 8,
    socialCost: 2,
    perk: 'travel_standby'
  },
  {
    id: 'freelance_animator',
    label: 'Freelance Animator',
    scheduleLabel: 'Tue, Thu, Sat, 11 AM to 5 PM',
    workloadLabel: 'Long flexible creative blocks',
    workloadTier: 'freelance_flexible',
    startHour: 11,
    endHour: 17,
    days: [2, 4, 6],
    basePay: 190,
    payRaise: 58,
    xpPerShift: 30,
    promoXp: 120,
    staminaCost: 10,
    energyCost: 13,
    funCost: -2,
    freshnessCost: 3,
    socialCost: 7,
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
  return `${track.label} L${level}, ${track.workloadLabel}, ${track.scheduleLabel}, ${shiftHours(track)}h, $${pay}/shift${due ? ', due now' : ''}`;
}

export function careerScheduleStatusLine(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track) return 'Work: no job assigned';
  const day = gameDay(state) % 7;
  const todayName = DAY_NAMES[day];
  const worked = career.lastWorkedDay === gameDay(state);
  const today = track.days.includes(day);
  const dueNow = isWorkWindow(state, track) && !worked;
  const missed = today && currentHour(state) >= track.endHour && !worked;
  const window = shiftWindowLabel(track);
  const workload = track.workloadLabel ? `, ${track.workloadLabel}` : '';
  if (dueNow) return `Work: due now, ${track.label}, ${window}${workload}`;
  if (worked) return `Work: already worked today, last pay $${Math.round(career.lastPay || 0)}${workload}`;
  if (missed) return `Work: ${todayName} shift missed, ${track.label}, ${window}${workload}`;
  if (today) return `Work: today ${window}, ${track.label}${workload}`;
  return `Work: off today, ${track.label}, schedule ${track.scheduleLabel}${workload}`;
}

export function careerHudLine(state, actor) {
  const career = careerFor(state, actor);
  const track = trackForCareer(career);
  if (!career || !track) return 'Career: none';
  return `Career: ${track.label} L${career.level} XP ${Math.round(career.xp)}/${promoThreshold(track, career.level)} Last $${Math.round(career.lastPay || 0)}`;
}

export function workOffsiteDurationForActor(state, actorId) {
  const actor = (state.entities || []).find(entity => entity.id === actorId) || null;
  const career = actor ? careerFor(state, actor) : null;
  const track = trackForCareer(career);
  return Math.max(8, Math.round(shiftHours(track) * WORK_REAL_SECONDS_PER_SHIFT_HOUR));
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
  const hours = shiftHours(track);
  state.money += pay;
  career.lastPay = pay;
  career.lastWorkedDay = gameDay(state);
  career.shiftsWorked += 1;
  career.xp += track.xpPerShift;
  state.careers.workHours = (state.careers.workHours || 0) + hours;
  state.careers.history.unshift({ actorId: actor.id, trackId: track.id, pay, day: gameDay(state), level: career.level, hours, workloadTier: track.workloadTier || '' });
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
  setMood(actor, 'calm');
  log(state, `${actor.name} completed a ${hours} hour ${track.label} shift and earned $${pay}.`);
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
    if (state.careers.movieTheaterHours >= 12) {
      state.careers.movieTheaterHours = 0;
      state.rewards.freeTickets.movies = (state.rewards.freeTickets.movies || 0) + 1;
      log(state, `${actor.name} earned free movie tickets from theater work.`);
    }
  }
  if (track.perk === 'travel_standby') {
    state.careers.airlineHours = (state.careers.airlineHours || 0) + shiftHours(track);
    if (state.careers.airlineHours >= 16) {
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
  if (!track) return 4;
  const raw = track.endHour - track.startHour;
  return raw > 0 ? raw : raw + 24;
}

function shiftWindowLabel(track) {
  return `${hourLabel(track.startHour)} to ${hourLabel(track.endHour)}`;
}

function hourLabel(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  const h = ((normalized + 11) % 12) + 1;
  return `${h} ${suffix}`;
}
