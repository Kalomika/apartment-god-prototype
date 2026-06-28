import { EFFECT_TTL } from './config.js';
import { addLog } from './state.js';
import { clamp, dist } from './utils.js';

export function updateHiding(state, dt) {
  for (const f of state.fighters) {
    if (f.incapacitated || f.extracted) continue;
    if (f.shadowHidden) {
      if (!f.hideTimer) {
        f.hideTimer = 3.8 + Math.random() * 2.2;
        f.pose = 'hide_shadow';
        addLog(state, `${f.name} slips into shadow cover.`);
      }
      f.hideTimer = Math.max(0, f.hideTimer - dt);
      f.stamina = clamp(f.stamina + dt * 9, 0, 100);
      if (f.hideTimer <= 0) {
        f.shadowHidden = false;
        f.hidden = f.prone || f.crouch;
        f.hideCooldown = 4.2;
        f.pose = f.archetypeId === 'ninja' ? 'roll_out_shadow' : 'crawl_out_shadow';
        addLog(state, `${f.name} rolls back out of hiding.`);
      }
    } else {
      f.hideTimer = 0;
    }
    f.hideCooldown = Math.max(0, (f.hideCooldown || 0) - dt);
  }
  updateInvestigations(state, dt);
}

function updateInvestigations(state, dt) {
  for (const f of state.fighters) {
    const target = state.fighters.find(other => other.team !== f.team);
    if (!target || target.incapacitated || target.extracted) continue;
    const last = f.memory?.lastSeen;
    if (!last) continue;
    const stale = state.clock - last.t;
    if (stale > 2.2 && !target.shadowHidden && dist(f, last) > 55) {
      f.memory.command = { type: 'investigate', x: last.x, y: last.y, urgent: false, until: state.clock + 2.8 };
      f.pose = 'careful_walk';
      if (!f.investigateT || f.investigateT <= 0) {
        state.effects.push({ type: 'alert', x: f.x, y: f.y - 42, ttl: EFFECT_TTL.alert });
        addLog(state, `${f.name} carefully investigates the last known position.`);
        f.investigateT = 2.5;
      }
    }
    f.investigateT = Math.max(0, (f.investigateT || 0) - dt);
  }
}
