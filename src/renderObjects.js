import { objects } from './world.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    if (obj.kind === 'car' && state.objectState.vehicleInUse === obj.id) continue;
    const active = state.entities.some(e => e.target?.objectId === obj.id || String(e.action || '').toLowerCase().includes(obj.kind));
    ctx.save();
    ctx.shadowColor = active ? 'rgba(116,230,255,.55)' : 'transparent';
    ctx.shadowBlur = active ? 18 : 0;
    drawObject(ctx, obj, state);
    ctx.restore();
  }
}

function drawObject(ctx, o, state) {
  if (o.kind === 'couch') return couch(ctx, o);
  if (o.kind === 'tv') return tv(ctx, o, state);
  if (o.kind === 'fridge') return fridge(ctx, o, state);
  if (o.kind === 'stove') return stove(ctx, o, state);
  if (o.kind === 'sink') return sink(ctx, o);
  if (o.kind === 'shower') return shower(ctx, o);
  if (o.kind === 'toilet') return toilet(ctx, o);
  if (o.kind === 'bed') return bed(ctx, o);
  if (o.kind === 'desk') return desk(ctx, o);
  if (o.kind === 'stairs') return stairs(ctx, o);
  if (o.kind === 'pool_table') return poolTable(ctx, o);
  if (o.kind === 'car') return car(ctx, o, state);
  if (o.kind === 'bike') return bike(ctx, o);
  if (o.kind === 'motorbike') return motorbike(ctx, o);
  return box(ctx, o, '#667085');
}

function box(ctx, o, color) { ctx.fillStyle = color; ctx.fillRect(o.x, o.y, o.w, o.h); ctx.strokeStyle = '#10141b'; ctx.lineWidth = 2; ctx.strokeRect(o.x, o.y, o.w, o.h); }
function couch(ctx, o) { box(ctx, o, '#775f7f'); ctx.fillStyle = '#8b72a0'; ctx.fillRect(o.x + 10, o.y + 9, o.w * .38, o.h - 18); ctx.fillRect(o.x + o.w * .53, o.y + 9, o.w * .36, o.h - 18); }
function tv(ctx, o, state) { box(ctx, o, '#151923'); ctx.fillStyle = state.tv.on ? '#5fc7ff' : '#242b38'; ctx.fillRect(o.x + 8, o.y + 6, o.w - 16, o.h - 12); }
function fridge(ctx, o, state) { box(ctx, o, '#d5dde8'); if (state.objectState.fridgeOpen) { ctx.fillStyle = '#dff7ff'; ctx.fillRect(o.x + o.w, o.y + 8, 38, o.h - 16); } }
function stove(ctx, o) { box(ctx, o, '#606878'); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(o.x + 18 + (i % 2) * 34, o.y + 18 + Math.floor(i / 2) * 28, 9, 0, Math.PI * 2); ctx.stroke(); } }
function sink(ctx, o) { box(ctx, o, '#aab7c8'); ctx.fillStyle = '#62778f'; ctx.fillRect(o.x + 10, o.y + 9, o.w - 20, o.h - 18); }
function shower(ctx, o) { box(ctx, o, '#6d8ea6'); }
function toilet(ctx, o) { box(ctx, o, '#d9e3ef'); }
function bed(ctx, o) { box(ctx, o, '#59739c'); ctx.fillStyle = '#d7e1f0'; ctx.fillRect(o.x + 14, o.y + 12, 54, 36); }
function desk(ctx, o) { box(ctx, o, '#795d45'); ctx.fillStyle = '#7de1ff'; ctx.fillRect(o.x + 42, o.y + 15, 38, 18); }
function stairs(ctx, o) { box(ctx, o, '#3b4656'); ctx.fillStyle = '#74e6ff'; ctx.font = '900 10px system-ui'; ctx.fillText(o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function poolTable(ctx, o) { box(ctx, o, '#123b35'); ctx.fillStyle = '#185c4f'; ctx.fillRect(o.x + 14, o.y + 14, o.w - 28, o.h - 28); }
function car(ctx, o, state) { const night = (state.time % 1440) >= 18 * 60 || (state.time % 1440) < 6 * 60; box(ctx, o, o.id === 'car_2' ? '#802d2a' : '#d7d8d0'); ctx.fillStyle = '#15303a'; ctx.fillRect(o.x + o.w * .22, o.y + o.h * .22, o.w * .56, o.h * .2); ctx.fillRect(o.x + o.w * .22, o.y + o.h * .68, o.w * .56, o.h * .2); ctx.fillStyle = night ? '#ffe66e' : '#f8fbff'; ctx.fillRect(o.x + o.w * .18, o.y + 10, 16, 9); ctx.fillRect(o.x + o.w * .68, o.y + 10, 16, 9); }
function bike(ctx, o) { box(ctx, o, '#60726f'); }
function motorbike(ctx, o) { box(ctx, o, '#4f4b44'); }
