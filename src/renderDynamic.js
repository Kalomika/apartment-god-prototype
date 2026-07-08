import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawCourier(ctx, state);
  drawVehicleDeparture(ctx, state);
  drawVehicleReturn(ctx, state);
  drawBuildPrompt(ctx, state);
}

export function drawCarriedItems(ctx, state) {
  for (const e of state.entities || []) {
    if (e.hidden || e.floor !== state.floor || !e.carrying) continue;
    ctx.save(); ctx.translate(e.x + 20, e.y - 22); drawCarryIcon(ctx, e.carrying); ctx.restore();
  }
}

function drawCarryIcon(ctx, item) {
  const text = String(item).toLowerCase();
  if (text.includes('ball')) { ctx.fillStyle = '#f1c66a'; ctx.strokeStyle = '#11151c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); return; }
  if (text.includes('bag') || text.includes('trash')) { roundRect(ctx, -10, -8, 20, 18, 5, text.includes('trash') ? '#20252f' : '#f1c66a'); ctx.fillStyle = '#10141b'; ctx.font = '900 7px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text.includes('trash') ? 'TR' : 'FOOD', 0, 3); ctx.textAlign = 'left'; return; }
  if (text.includes('dish')) { roundRect(ctx, -11, -5, 22, 10, 5, '#d7e1f0'); return; }
  roundRect(ctx, -9, -7, 18, 14, 4, '#f1c66a');
}

function drawPulledBook(ctx, state) {
  const bookOut = state.objectState.bookOut;
  if (!bookOut) return;
  const shelf = objects.find(o => o.floor === state.floor && o.kind === 'bookshelf' && (bookOut === true || bookOut === o.id));
  if (!shelf) return;
  ctx.save(); ctx.fillStyle = '#f1c66a'; ctx.strokeStyle = '#11151c'; ctx.lineWidth = 2; ctx.translate(shelf.x + shelf.w + 12, shelf.y + 38); ctx.rotate(-0.12); ctx.fillRect(0, 0, 24, 18); ctx.strokeRect(0, 0, 24, 18); ctx.fillStyle = '#11151c'; ctx.font = '900 10px system-ui'; ctx.fillText('BOOK', -1, 13); ctx.restore();
}

function drawCourier(ctx, state) {
  const d = state.delivery;
  if (!d || d.floor !== state.floor) return;
  ctx.save(); ctx.translate(d.x, d.y); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 18, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); roundRect(ctx, -15, -10, 30, 38, 8, '#1e2937'); ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 2; ctx.strokeRect(-12, -6, 24, 18); ctx.fillStyle = '#f1c66a'; ctx.fillRect(-24, 3, 16, 14); ctx.fillStyle = '#11151c'; ctx.font = '900 8px system-ui'; ctx.fillText('BAG', -23, 13); ctx.fillStyle = '#f8fbff'; ctx.beginPath(); ctx.arc(0, -20, 11, 0, Math.PI * 2); ctx.fill(); const text = d.phase === 'arriving' ? '...' : d.bubble || 'ORDER'; const w = Math.max(76, text.length * 10 + 22); roundRect(ctx, -w / 2, -66, w, 26, 10, '#f8fbff'); ctx.fillStyle = '#10141b'; ctx.font = '900 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -49); ctx.textAlign = 'left'; ctx.restore();
}

function drawGarageDoor(ctx, state) {
  ctx.fillStyle = state.objectState.garageDoorOpen ? 'rgba(116,230,255,.35)' : '#2a3140';
  ctx.fillRect(118, 38, 548, 30);
  ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.strokeRect(118, 38, 548, 30);
}

function drawAnimatedCar(ctx, v, label) {
  const x = v.x;
  const y = v.y;
  const w = v.w || 116;
  const h = v.h || 230;
  const vertical = h >= w;
  roundRect(ctx, x, y, w, h, 24, '#202838');
  roundRect(ctx, x + w * 0.18, y + h * 0.22, w * 0.64, h * 0.55, 16, '#0d1118');
  ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3;
  ctx.strokeRect(x + w * 0.28, y + h * 0.34, w * 0.44, h * 0.28);
  ctx.fillStyle = '#f1c66a';
  if (vertical) {
    ctx.fillRect(x + w * 0.18, y + 8, Math.max(12, w * 0.18), 10);
    ctx.fillRect(x + w * 0.64, y + 8, Math.max(12, w * 0.18), 10);
    ctx.fillStyle = '#d84b4b';
    ctx.fillRect(x + w * 0.18, y + h - 18, Math.max(12, w * 0.18), 8);
    ctx.fillRect(x + w * 0.64, y + h - 18, Math.max(12, w * 0.18), 8);
  } else {
    ctx.fillRect(x + w - 22, y + h * 0.18, 10, Math.max(12, h * 0.18));
    ctx.fillRect(x + w - 22, y + h * 0.64, 10, Math.max(12, h * 0.18));
    ctx.fillStyle = '#d84b4b';
    ctx.fillRect(x + 10, y + h * 0.18, 8, Math.max(12, h * 0.18));
    ctx.fillRect(x + 10, y + h * 0.64, 8, Math.max(12, h * 0.18));
  }
  ctx.fillStyle = '#f1c66a'; ctx.font = '900 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h / 2); ctx.textAlign = 'left';
}

function drawVehicleDeparture(ctx, state) {
  const v = state.vehicleDeparture;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  drawAnimatedCar(ctx, v, 'LEAVING');
  ctx.restore();
}

function drawVehicleReturn(ctx, state) {
  const v = state.vehicleReturn;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  drawAnimatedCar(ctx, v, v.phase === 'arriving' ? 'RETURN' : 'PARKED');
  ctx.restore();
}

function drawBuildPrompt(ctx, state) {
  if (!state.buildPick) return;
  ctx.save(); ctx.fillStyle = 'rgba(10,12,18,.78)'; ctx.fillRect(282, 10, 380, 34); ctx.fillStyle = '#f8fbff'; ctx.font = '900 15px system-ui'; ctx.fillText(`Tap placement spot for ${state.buildPick.label}`, 294, 32); ctx.restore();
}
