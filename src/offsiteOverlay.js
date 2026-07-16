import { destinationFor } from './travelLocations.js';

export function updateOffsiteHomeView(state) {
  if (!state.offsite) return;
  const selected = (state.entities || []).find(e => e.id === state.selectedId);
  if (selected && !selected.hidden) return;
  const home = (state.entities || []).find(e => !e.hidden && !e.labOnly && e.type === 'person') || (state.entities || []).find(e => !e.hidden && !e.labOnly);
  if (!home) return;
  state.selectedId = home.id;
  state.floor = home.floor;
  state.followSelected = true;
  state.viewHoldT = 0;
  state.viewFocus = null;
  state.cameraTransition = null;
}

export function drawOffsiteProgressOverlay(ctx, state) {
  const job = state.offsite;
  if (!job) return;
  const label = job.label || destinationFor(job.actionId)?.label || String(job.actionId || 'Offsite').replaceAll('_', ' ');
  const progress = Math.max(.02, Math.min(1, Number(job.progress || 0)));
  const travelers = (job.actors || []).map(id => (state.entities || []).find(e => e.id === id)?.name || id).join(', ');
  ctx.save();
  ctx.fillStyle = 'rgba(7,16,24,.88)';
  round(ctx, 244, 48, 472, 54, 14);
  ctx.strokeStyle = 'rgba(241,198,106,.72)';
  ctx.lineWidth = 2;
  ctx.strokeRect(250, 54, 460, 42);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 13px system-ui';
  ctx.fillText(`${label}${travelers ? `, ${travelers}` : ''}`, 264, 72);
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(264, 82, 432, 8);
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(264, 82, 432 * progress, 8);
  ctx.restore();
}

function round(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fill();
}
