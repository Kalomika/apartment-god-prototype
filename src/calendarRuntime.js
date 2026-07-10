import { startOffsite } from './actions.js';
import { bookingTimeLabel, canAffordBookingNow, dueCalendarBookings, ensureCalendar, markBookingStatus } from './calendarSystem.js';
import { byId, log, say } from './state.js';

export function updateCalendarRuntime(state) {
  ensureCalendar(state);
  applyPendingOffsiteHandoff(state);
  const due = dueCalendarBookings(state);
  for (const actor of state.entities || []) if (actor.calendarReminderT > 0) actor.calendarReminderT -= .6;
  if (!due.length) return;
  for (const booking of due) {
    const actor = byId(state, booking.actorId);
    if (!actor || actor.hidden || actor.labOnly) {
      markBookingStatus(state, booking.id, 'missed');
      log(state, `Missed ${booking.label}: actor unavailable.`);
      continue;
    }
    const overdue = (state.time || 0) - booking.startMinute;
    if (!canAffordBookingNow(state, booking)) {
      markBookingStatus(state, booking.id, 'missed');
      log(state, `${actor.name} could not start ${booking.label}. Cost $${booking.cost}, available $${Math.floor(state.money || 0)}.`);
      say(actor, 'BROKE');
      continue;
    }
    if (actorBusy(actor) || state.offsite || state.vehicleDeparture || state.vehicleReturn) {
      handleBlockedBooking(state, actor, booking, overdue, `${actor.name} has ${booking.label} due now but is busy.`);
      continue;
    }
    const ok = startOffsite(state, actor, booking.actionId, booking.invitedIds || [], booking.vehicleId || 'auto', { fromQueue: true });
    if (ok) {
      state.pendingCalendarOffsite = {
        bookingId: booking.id,
        actionId: booking.actionId,
        bookedDuration: booking.duration,
        extraCost: booking.extraCost || 0,
        bookedCost: booking.cost || 0,
        applied: false
      };
      if (state.vehicleDeparture) {
        state.vehicleDeparture.bookingId = booking.id;
        state.vehicleDeparture.bookedDuration = booking.duration;
        state.vehicleDeparture.extraCost = booking.extraCost || 0;
        state.vehicleDeparture.bookedCost = booking.cost || 0;
      }
      markBookingStatus(state, booking.id, 'started');
      say(actor, 'GO');
      log(state, `${actor.name}'s calendar started ${booking.label}.`);
    } else {
      handleBlockedBooking(state, actor, booking, overdue, `${actor.name}'s calendar could not start ${booking.label} yet.`);
    }
  }
}

function applyPendingOffsiteHandoff(state) {
  const pending = state.pendingCalendarOffsite;
  if (!pending || pending.applied || !state.offsite) return;
  if (state.offsite.actionId !== pending.actionId) return;
  if (Number.isFinite(pending.bookedDuration) && pending.bookedDuration > 0) {
    state.offsite.t = pending.bookedDuration;
    state.offsite.bookedDuration = pending.bookedDuration;
  }
  if (pending.extraCost > 0) {
    if ((state.money || 0) >= pending.extraCost) {
      state.money -= pending.extraCost;
      log(state, `Paid $${pending.extraCost} for extended trip time.`);
    } else {
      log(state, `Extended trip cost $${pending.extraCost} could not be paid. Trip uses standard length.`);
    }
  }
  state.offsite.bookingId = pending.bookingId;
  state.offsite.bookedCost = pending.bookedCost || 0;
  pending.applied = true;
  state.pendingCalendarOffsite = null;
}

function handleBlockedBooking(state, actor, booking, overdue, message) {
  if (overdue > 90) {
    markBookingStatus(state, booking.id, 'missed');
    log(state, `${actor.name} missed ${booking.label} from ${bookingTimeLabel(booking)}.`);
    say(actor, 'MISSED');
    return;
  }
  if (!actor.calendarReminderT || actor.calendarReminderT <= 0) {
    actor.calendarReminderT = 18;
    say(actor, 'PLAN');
    log(state, message);
  }
}

function actorBusy(actor) {
  if (!actor) return true;
  return Boolean(actor.path?.length || actor.target || actor.pending || actor.actionT > 0 || actor.hidden || actor.stopped);
}
