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
  if (o.kind === 'atv') return atv(ctx, o);
  return box(ctx, o, '#667085');
}

function box(ctx, o, color) {
  ctx.fillStyle = color;
  ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.strokeStyle = '#10141b';
  ctx.lineWidth = 2;
  ctx.strokeRect(o.x, o.y, o.w, o.h);
}

function rr(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), r);
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function couch(ctx, o) {
  ctx.fillStyle = '#7ea4a0';
  rr(ctx, o.x, o.y, o.w, o.h, 18, true, false);
  ctx.fillStyle = '#93b8b3';
  rr(ctx, o.x + 10, o.y + 9, o.w * .38, o.h - 18, 12, true, false);
  rr(ctx, o.x + o.w * .53, o.y + 9, o.w * .36, o.h - 18, 12, true, false);
  ctx.strokeStyle = '#5e7975'; ctx.lineWidth = 2; rr(ctx, o.x, o.y, o.w, o.h, 18, false, true);
}
function tv(ctx, o, state) { box(ctx, o, '#151923'); ctx.fillStyle = state.tv.on ? '#5fc7ff' : '#242b38'; ctx.fillRect(o.x + 8, o.y + 6, o.w - 16, o.h - 12); }
function fridge(ctx, o, state) { ctx.fillStyle = '#f4eee5'; rr(ctx, o.x, o.y, o.w, o.h, 8, true, false); ctx.strokeStyle = '#7c756b'; ctx.lineWidth = 2; rr(ctx, o.x, o.y, o.w, o.h, 8, false, true); ctx.fillStyle = '#8dbfc7'; ctx.fillRect(o.x + 8, o.y + 18, 6, 44); if (state.objectState.fridgeOpen) { ctx.fillStyle = '#dff7ff'; ctx.fillRect(o.x + o.w, o.y + 8, 38, o.h - 16); } }
function stove(ctx, o) { ctx.fillStyle = '#bdb9ad'; rr(ctx, o.x, o.y, o.w, o.h, 8, true, false); ctx.strokeStyle = '#514b46'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(o.x + 18 + (i % 2) * 34, o.y + 18 + Math.floor(i / 2) * 28, 9, 0, Math.PI * 2); ctx.stroke(); } }
function sink(ctx, o) { ctx.fillStyle = '#c8c4ba'; rr(ctx, o.x, o.y, o.w, o.h, 8, true, false); ctx.fillStyle = '#a9ced4'; rr(ctx, o.x + 10, o.y + 9, o.w - 20, o.h - 18, 8, true, false); }
function shower(ctx, o) { ctx.fillStyle = '#d8e5e2'; rr(ctx, o.x, o.y, o.w, o.h, 8, true, false); ctx.fillStyle = '#9fcbd3'; rr(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 16, 6, true, false); }
function toilet(ctx, o) { ctx.fillStyle = '#f8f2e8'; rr(ctx, o.x + 4, o.y, o.w - 8, 20, 5, true, false); ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + 38, 19, 16, 0, 0, Math.PI * 2); ctx.fill(); }
function bed(ctx, o) { ctx.fillStyle = '#b9a287'; rr(ctx, o.x, o.y, o.w, o.h, 17, true, false); ctx.fillStyle = '#efe7dc'; rr(ctx, o.x + 14, o.y + 10, o.w - 28, o.h - 20, 15, true, false); ctx.fillStyle = '#fff7ec'; rr(ctx, o.x + 18, o.y + 12, 54, 34, 12, true, false); }
function desk(ctx, o) { ctx.fillStyle = '#b78556'; rr(ctx, o.x, o.y, o.w, o.h, 7, true, false); ctx.fillStyle = '#4b4641'; rr(ctx, o.x + 32, o.y + 9, 54, 36, 4, true, false); ctx.fillStyle = '#9fcbd3'; ctx.fillRect(o.x + 42, o.y + 15, 38, 18); }
function stairs(ctx, o) { ctx.fillStyle = '#b3a28c'; rr(ctx, o.x, o.y, o.w, o.h, 8, true, false); ctx.strokeStyle = '#f3eadf'; for (let y = o.y + 12; y < o.y + o.h; y += 14) { ctx.beginPath(); ctx.moveTo(o.x + 12, y); ctx.lineTo(o.x + o.w - 12, y); ctx.stroke(); } ctx.fillStyle = '#403832'; ctx.font = '900 10px system-ui'; ctx.fillText(o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function poolTable(ctx, o) { ctx.fillStyle = '#8b6b49'; rr(ctx, o.x, o.y, o.w, o.h, 18, true, false); ctx.fillStyle = '#557d67'; rr(ctx, o.x + 14, o.y + 14, o.w - 28, o.h - 28, 12, true, false); }

function car(ctx, o, state) {
  const family = o.id !== 'car_2';
  const night = (state.time % 1440) >= 18 * 60 || (state.time % 1440) < 6 * 60;
  const x = o.x, y = o.y, w = o.w, h = o.h;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 8, w * .42, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = family ? '#d9d7cc' : '#9b3e35';
  ctx.strokeStyle = family ? '#26313a' : '#2b1715';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + w * .28, y + h * .12);
  ctx.bezierCurveTo(x + w * .31, y + 8, x + w * .69, y + 8, x + w * .72, y + h * .12);
  ctx.bezierCurveTo(x + w * .90, y + h * .36, x + w * .88, y + h * .76, x + w * .70, y + h * .93);
  ctx.bezierCurveTo(x + w * .58, y + h * .99, x + w * .42, y + h * .99, x + w * .30, y + h * .93);
  ctx.bezierCurveTo(x + w * .12, y + h * .76, x + w * .10, y + h * .36, x + w * .28, y + h * .12);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = family ? '#c7dddf' : '#9fcbd3';
  ctx.strokeStyle = family ? '#26313a' : '#2b1715';
  ctx.lineWidth = 2;
  rr(ctx, x + w * .28, y + h * .20, w * .44, h * .22, 7, true, true);
  rr(ctx, x + w * .27, y + h * .58, w * .46, h * .20, 7, true, true);
  ctx.fillStyle = night ? '#ffe66e' : '#f8fbff';
  rr(ctx, x + w * .22, y + 14, w * .16, 9, 4, true, false);
  rr(ctx, x + w * .62, y + 14, w * .16, 9, 4, true, false);
  ctx.fillStyle = '#b66d55';
  rr(ctx, x + w * .22, y + h - 22, w * .16, 8, 3, true, false);
  rr(ctx, x + w * .62, y + h - 22, w * .16, 8, 3, true, false);
  ctx.restore();
}

function bike(ctx, o) {
  ctx.save();
  ctx.strokeStyle = '#3f3933'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 18, 14, 0, Math.PI * 2); ctx.arc(o.x + o.w / 2, o.y + o.h - 18, 14, 0, Math.PI * 2); ctx.moveTo(o.x + o.w / 2, o.y + 18); ctx.lineTo(o.x + 8, o.y + o.h * .48); ctx.lineTo(o.x + o.w / 2, o.y + o.h - 18); ctx.lineTo(o.x + o.w - 8, o.y + o.h * .50); ctx.closePath(); ctx.stroke();
  ctx.restore();
}
function motorbike(ctx, o) { ctx.fillStyle = '#5f5a52'; rr(ctx, o.x + 6, o.y + 18, o.w - 12, o.h - 36, 16, true, false); ctx.fillStyle = '#9fcbd3'; rr(ctx, o.x + 12, o.y + 42, o.w - 24, 26, 9, true, false); ctx.strokeStyle = '#2d2b28'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 14, 12, 0, Math.PI * 2); ctx.arc(o.x + o.w / 2, o.y + o.h - 14, 12, 0, Math.PI * 2); ctx.stroke(); }
function atv(ctx, o) { ctx.fillStyle = '#6f8a58'; rr(ctx, o.x + 8, o.y + 18, o.w - 16, o.h - 36, 12, true, false); ctx.strokeStyle = '#2d2b28'; ctx.lineWidth = 5; for (const [px, py] of [[8, 24], [o.w - 8, 24], [8, o.h - 24], [o.w - 8, o.h - 24]]) { ctx.beginPath(); ctx.ellipse(o.x + px, o.y + py, 10, 16, 0, 0, Math.PI * 2); ctx.stroke(); } ctx.fillStyle = '#9aae73'; rr(ctx, o.x + 22, o.y + 42, o.w - 44, o.h - 84, 12, true, false); }
