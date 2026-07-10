import { findBooking, gameDay, markBookingStatus, minuteOfDay, bookingTimeLabel, timeText } from './calendarSystem.js';
import { destinationFor } from './travelLocations.js';
import { changeNeed, log, say } from './state.js';

const PREP_WINDOW_MINUTES = 60;
const MORNING_START_MINUTE = 6 * 60;

export function skipTargetForBooking(state, booking) {
  if (!booking || booking.status !== 'scheduled') return null;
  const now = state.time || 0;
  const prep = Math.max(dayStartForMinute(booking.startMinute), booking.startMinute - PREP_WINDOW_MINUTES);
  if (now >= prep) return null;
  return prep;
}

export function canSkipToBooking(state, booking) {
  return Boolean(skipTargetForBooking(state, booking)) && !state.offsite && !state.vehicleDeparture && !state.vehicleReturn;
}

export function skipToBookingPrep(state, actor, bookingId) {
  const booking = findBooking(state, bookingId);
  const target = skipTargetForBooking(state, booking);
  if (!booking || booking.status !== 'scheduled') {
    log(state, 'That calendar event is no longer available.');
    if (actor) say(actor, 'NOPE');
    return false;
  }
  if (state.offsite || state.vehicleDeparture || state.vehicleReturn) {
    log(state, 'Cannot skip time while the household is already traveling.');
    if (actor) say(actor, 'WAIT');
    return false;
  }
  if (!target) {
    log(state, `${booking.label} is close enough to live through now.`);
    if (actor) say(actor, 'SOON');
    return false;
  }

  const from = state.time || 0;
  const skippedBookings = collectSkippedBookings(state, from, target, booking.id);
  applyTimeSkipConsequences(state, target - from);
  fulfillSkippedBookings(state, skippedBookings);
  resetActorsAfterTimeSkip(state, booking);
  state.time = target;
  state.viewHoldT = 0;
  state.calendar.skipRecap = buildSkipRecap(from, target, booking, skippedBookings);
  log(state, `Skipped to prep time for ${booking.label}, ${timeText(target)}.`);
  if (actor) say(actor, 'PREP');
  return true;
}

function dayStartForMinute(totalMinute) {
  return Math.floor(totalMinute / 1440) * 1440 + MORNING_START_MINUTE;
}

function collectSkippedBookings(state, from, to, protectedBookingId) {
  return (state.calendar?.bookings || [])
    .filter(b => b && b.status === 'scheduled' && b.id !== protectedBookingId && b.startMinute > from && b.startMinute < to)
    .sort((a, b) => a.startMinute - b.startMinute)
    .map(b => ({ ...b }));
}

function fulfillSkippedBookings(state, skippedBookings) {
  for (const booking of skippedBookings) {
    const destination = destinationFor(booking.actionId);
    const cost = Math.max(0, booking.cost || destination?.cost || 0);
    if ((state.money || 0) < cost) {
      markBookingStatus(state, booking.id, 'missed');
      log(state, `During skip, ${booking.label} was missed because it cost $${cost}.`);
      continue;
    }
    if (cost > 0) state.money = Math.max(0, (state.money || 0) - cost);
    markBookingStatus(state, booking.id, 'fulfilled during skip');
    try {
      applyOffsiteRewardsLikeSkip(state, booking);
    } catch (_) {}
    log(state, `During skip, ${booking.label} was fulfilled.`);
  }
}

function applyOffsiteRewardsLikeSkip(state, booking) {
  const destination = destinationFor(booking.actionId);
  if (!destination) return;
  for (const id of [booking.actorId, ...(booking.invitedIds || [])]) {
    const actor = state.entities?.find(e => e.id === id);
    if (!actor || actor.hidden || actor.labOnly) continue;
    changeNeed(actor, 'fun', destination.rewards?.fun || 0);
    changeNeed(actor, 'social', destination.rewards?.social || 0);
    changeNeed(actor, 'energy', destination.rewards?.energy || 0);
    changeNeed(actor, 'freshness', destination.rewards?.freshness || 0);
  }
}

function applyTimeSkipConsequences(state, skippedMinutes) {
  const hours = Math.max(0, skippedMinutes / 60);
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.labOnly || !entity.needs) continue;
    const sleepish = String(entity.pose || '').includes('sleep') || String(entity.action || '').toLowerCase().includes('sleep');
    const dog = entity.type === 'dog';
    changeNeed(entity, 'hunger', -(dog ? .24 : .34) * hours);
    changeNeed(entity, 'bladder', -(dog ? .18 : .44) * hours);
    changeNeed(entity, 'freshness', -(dog ? .08 : .12) * hours);
    changeNeed(entity, 'fun', -.08 * hours);
    if (sleepish) {
      changeNeed(entity, 'energy', .9 * hours);
      changeNeed(entity, 'stamina', .65 * hours);
    } else {
      changeNeed(entity, 'energy', -.18 * hours);
      changeNeed(entity, 'stamina', -.1 * hours);
    }
  }
}

function resetActorsAfterTimeSkip(state, booking) {
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.labOnly) continue;
    entity.path = [];
    entity.target = null;
    entity.pending = null;
    entity.queuedTask = null;
    entity.actionT = 0;
    entity.actionTotal = 0;
    entity.pose = 'stand';
    entity.stopped = false;
    if (entity.carrying && !String(entity.carrying).includes('luggage')) entity.carrying = null;
    entity.action = entity.id === booking.actorId ? `${booking.label} prep` : 'Time skipped';
    entity.idleT = entity.id === booking.actorId ? 4 : 0;
  }
}

function buildSkipRecap(from, to, protectedBooking, skippedBookings) {
  const days = [];
  const startDay = gameDay({ time: from });
  const endDay = gameDay({ time: to });
  for (let day = startDay; day <= endDay; day++) {
    const dayStart = day * 1440;
    const dayEnd = dayStart + 1439;
    const events = skippedBookings.filter(b => b.startMinute >= dayStart && b.startMinute <= dayEnd);
    const protectedToday = protectedBooking.startMinute >= dayStart && protectedBooking.startMinute <= dayEnd;
    days.push({
      day,
      checked: day < endDay || events.length > 0,
      label: `${dayLabel(dayStart)} ${events.length ? 'event handled' : protectedToday ? 'event prep' : 'day passed'}`,
      events: events.map(e => e.label)
    });
  }
  return {
    from,
    to,
    targetEventId: protectedBooking.id,
    targetLabel: protectedBooking.label,
    targetTime: bookingTimeLabel(protectedBooking),
    days,
    message: `Skipped to one hour before ${protectedBooking.label}`,
    visibleT: 18
  };
}

function dayLabel(totalMinute) {
  const d = Math.floor(totalMinute / 1440);
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[d % 7];
}
