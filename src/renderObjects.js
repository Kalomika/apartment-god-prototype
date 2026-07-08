import { objects, roomAt } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    if (obj.kind === 'car' && state.objectState.vehicleInUse === obj.id) continue;
    const active = state.entities.some(e => e.target?.objectId === obj.id || String(e.action || '').toLowerCase().includes(obj.kind));
    ctx.save();
    ctx.shadowColor = active ? 'rgba(116,230,255,.55)' : 'transparent';
    ctx.shadowBlur = active ? 18 : 0;
    drawObject(ctx, obj, state, active);
    ctx.restore();
  }
}

function drawObject(ctx, o, state, active) {
  if (o.kind === 'couch') return couch(ctx, o);
  if (o.kind === 'tv') return tv(ctx, o, state);
  if (o.kind === 'fridge') return fridge(ctx, o, state);
  if (o.kind === 'stove') return stove(ctx, o, state);
  if (o.kind === 'sink') return sink(ctx, o);
  if (o.kind === 'shower') return shower(ctx, o, active);
  if (o.kind === 'toilet') return toilet(ctx, o);
  if (o.kind === 'door') return door(ctx, o, state);
  if (o.kind === 'bed') return bed(ctx, o);
  if (o.kind === 'desk') return desk(ctx, o);
  if (o.kind === 'dog_bowl') return bowl(ctx, o);
  if (o.kind === 'light') return light(ctx, o, state);
  if (o.kind === 'stairs') return stairs(ctx, o);
  if (o.kind === 'bookshelf') return bookshelf(ctx, o);
  if (o.kind === 'workout') return workout(ctx, o);
  if (o.kind === 'stereo') return stereo(ctx, o, state);
  if (o.kind === 'pool_table') return poolTable(ctx, o);
  if (o.kind === 'arcade') return arcade(ctx, o);
  if (o.kind === 'game_console') return gameConsole(ctx, o);
  if (o.kind === 'dartboard') return dartboard(ctx, o);
  if (o.kind === 'trash_can') return trashCan(ctx, o, state.garbage?.kitchen || 0);
  if (o.kind === 'outdoor_trash') return outdoorTrash(ctx, o, state.garbage?.bagsOutside || 0);
  if (o.kind === 'treadmill') return treadmill(ctx, o);
  if (o.kind === 'weight_bench') return weightBench(ctx, o);
  if (o.kind === 'heavy_bag') return heavyBag(ctx, o);
  if (o.kind === 'swim_pool') return swimPool(ctx, o);
  if (o.kind === 'kennel') return kennel(ctx, o);
  if (o.kind === 'car') return car(ctx, o, state);
  if (o.kind === 'bike') return bike(ctx, o);
  if (o.kind === 'motorbike') return motorbike(ctx, o);
  roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#667085');
}

function couch(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 16, '#775f7f'); roundRect(ctx, o.x + 10, o.y + 9, 58, 44, 10, '#8b72a0'); roundRect(ctx, o.x + 82, o.y + 9, 58, 44, 10, '#8b72a0'); }
function tv(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 6, '#151923'); roundRect(ctx, o.x + 8, o.y + 6, o.w - 16, o.h - 12, 4, state.tv.on ? '#5fc7ff' : '#242b38'); }
function fridge(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#d5dde8'); ctx.fillStyle = '#8795a8'; ctx.fillRect(o.x + 8, o.y + 8, o.w - 16, 2); ctx.fillStyle = '#74e6ff'; ctx.fillRect(o.x + 8, o.y + 18, 6, 44); if (state.objectState.fridgeOpen) { roundRect(ctx, o.x + o.w - 2, o.y + 8, 42, o.h - 16, 4, '#dff7ff'); ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.strokeRect(o.x + o.w - 2, o.y + 8, 42, o.h - 16); ctx.fillStyle = '#243647'; ctx.font = '900 10px system-ui'; ctx.fillText('OPEN', o.x + o.w + 4, o.y + 28); ctx.fillText(state.objectState.fridgeActivity === 'snack' ? 'SNACK' : 'FOOD', o.x + o.w + 4, o.y + 48); } }
function stove(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#606878'); for (let i = 0; i < 4; i++) { ctx.strokeStyle = '#252b35'; ctx.beginPath(); ctx.arc(o.x + 18 + (i % 2) * 34, o.y + 18 + Math.floor(i / 2) * 28, 9, 0, Math.PI * 2); ctx.stroke(); } if (state.objectState.stovePan) { ctx.fillStyle = '#1f2530'; ctx.beginPath(); ctx.ellipse(o.x + 38, o.y + 34, 22, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#11151c'; ctx.beginPath(); ctx.moveTo(o.x + 56, o.y + 34); ctx.lineTo(o.x + 78, o.y + 28); ctx.stroke(); } if (state.objectState.stoveSmoke) { ctx.strokeStyle = 'rgba(230,235,240,.65)'; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(o.x + 24 + i * 12, o.y - 2); ctx.bezierCurveTo(o.x + 12 + i * 12, o.y - 14, o.x + 38 + i * 8, o.y - 20, o.x + 26 + i * 12, o.y - 32); ctx.stroke(); } } }
function sink(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#aab7c8'); roundRect(ctx, o.x + 10, o.y + 9, o.w - 20, o.h - 18, 8, '#62778f'); }
function shower(ctx, o, active) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#6d8ea6'); ctx.strokeStyle = active ? '#9ce8ff' : '#cdefff'; ctx.strokeRect(o.x + 8, o.y + 8, o.w - 16, o.h - 16); }
function toilet(ctx, o) { roundRect(ctx, o.x + 4, o.y, o.w - 8, 20, 5, '#d9e3ef'); ctx.fillStyle = '#d9e3ef'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + 38, 19, 16, 0, 0, Math.PI * 2); ctx.fill(); }
function door(ctx, o, state) { ctx.fillStyle = '#8a5c3d'; ctx.fillRect(o.x, o.y, o.w, o.h); if (state.objectState.doorOpen) { ctx.fillStyle = '#9b704e'; ctx.fillRect(o.x + o.w, o.y + 8, 16, o.h - 16); } }
function bed(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 14, '#59739c'); roundRect(ctx, o.x + 14, o.y + 12, 54, 36, 10, '#d7e1f0'); roundRect(ctx, o.x + 76, o.y + 18, o.w - 90, o.h - 32, 12, '#7d9fd1'); }
function desk(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#795d45'); roundRect(ctx, o.x + 36, o.y + 10, 50, 34, 5, '#222936'); ctx.fillStyle = '#7de1ff'; ctx.fillRect(o.x + 42, o.y + 15, 38, 18); }
function bowl(ctx, o) { ctx.fillStyle = '#b43f4e'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill(); }
function light(ctx, o, state) { const room = roomAt(o.x, o.y, o.floor); ctx.fillStyle = room && state.roomLights[room.id] !== false ? '#ffe377' : '#555d69'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 11, 0, Math.PI * 2); ctx.fill(); }
function stairs(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#3b4656'); ctx.strokeStyle = '#93a0b3'; for (let y = o.y + 12; y < o.y + o.h; y += 14) { ctx.beginPath(); ctx.moveTo(o.x + 12, y); ctx.lineTo(o.x + o.w - 12, y); ctx.stroke(); } ctx.fillStyle = '#74e6ff'; ctx.font = '900 10px system-ui'; ctx.fillText(o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function bookshelf(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#6c4b33'); for (let y = o.y + 14; y < o.y + o.h - 8; y += 24) { ctx.fillStyle = '#d7a45f'; ctx.fillRect(o.x + 8, y, o.w - 16, 5); ctx.fillStyle = '#8fb3e8'; ctx.fillRect(o.x + 12, y + 7, 10, 14); ctx.fillStyle = '#e88fae'; ctx.fillRect(o.x + 28, y + 7, 8, 14); ctx.fillStyle = '#90d68c'; ctx.fillRect(o.x + 42, y + 7, 12, 14); } }
function workout(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#45505e'); ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(o.x + 12, o.y + 22); ctx.lineTo(o.x + o.w - 12, o.y + 22); ctx.stroke(); ctx.fillStyle = '#d7e1f0'; ctx.fillRect(o.x + 8, o.y + 14, 8, 16); ctx.fillRect(o.x + o.w - 16, o.y + 14, 8, 16); }
function stereo(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#202735'); ctx.fillStyle = '#0f141e'; ctx.beginPath(); ctx.arc(o.x + 16, o.y + 18, 10, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(o.x + o.w - 16, o.y + 18, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = state.music ? '#f1c66a' : '#6a7280'; ctx.font = '900 13px system-ui'; ctx.fillText(state.music ? '♪' : 'ST', o.x + 24, o.y + 23); }
function poolTable(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 20, '#123b35'); roundRect(ctx, o.x + 14, o.y + 14, o.w - 28, o.h - 28, 14, '#185c4f'); ctx.fillStyle = '#080b10'; for (const [px, py] of [[16, 16], [o.w / 2, 12], [o.w - 16, 16], [16, o.h - 16], [o.w / 2, o.h - 12], [o.w - 16, o.h - 16]]) { ctx.beginPath(); ctx.arc(o.x + px, o.y + py, 8, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#f8fbff'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 - 24, o.y + o.h / 2, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f1c66a'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + 22, o.y + o.h / 2 - 12, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#f1c66a'; ctx.beginPath(); ctx.moveTo(o.x + 28, o.y + o.h - 18); ctx.lineTo(o.x + o.w - 38, o.y + 24); ctx.stroke(); }
function arcade(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#22152f'); roundRect(ctx, o.x + 8, o.y + 10, o.w - 16, 28, 5, '#10141b'); ctx.fillStyle = '#74e6ff'; ctx.fillRect(o.x + 14, o.y + 16, o.w - 28, 12); ctx.fillStyle = '#ff75df'; ctx.beginPath(); ctx.arc(o.x + 18, o.y + 52, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f1c66a'; ctx.fillRect(o.x + 30, o.y + 50, 12, 4); }
function gameConsole(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 10, '#202735'); roundRect(ctx, o.x + 16, o.y + 10, o.w - 32, 28, 6, '#0f141e'); ctx.fillStyle = '#74e6ff'; ctx.fillRect(o.x + 32, o.y + 16, o.w - 64, 14); ctx.fillStyle = '#f8fbff'; ctx.font = '900 11px system-ui'; ctx.fillText('PS / XBOX', o.x + 50, o.y + 52); }
function dartboard(ctx, o) { ctx.fillStyle = '#10141b'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#f8fbff'; ctx.lineWidth = 2; for (let r = 6; r < o.w / 2; r += 7) { ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, r, 0, Math.PI * 2); ctx.stroke(); } ctx.strokeStyle = '#ff75df'; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, o.y); ctx.lineTo(o.x + o.w / 2, o.y + o.h); ctx.moveTo(o.x, o.y + o.h / 2); ctx.lineTo(o.x + o.w, o.y + o.h / 2); ctx.stroke(); }
function trashCan(ctx, o, level) { roundRect(ctx, o.x, o.y, o.w, o.h, 6, level > 80 ? '#6a2a2a' : '#3d4654'); ctx.fillStyle = '#f1c66a'; ctx.font = '900 9px system-ui'; ctx.fillText(`${Math.round(level)}%`, o.x + 3, o.y + 24); }
function outdoorTrash(ctx, o, bags) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#1f5a47'); ctx.fillStyle = '#111820'; ctx.fillRect(o.x + 8, o.y + 8, o.w - 16, 10); ctx.fillStyle = '#f8fbff'; ctx.font = '900 9px system-ui'; ctx.fillText(`BAGS ${bags}`, o.x + 3, o.y + 48); }
function treadmill(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 12, '#1e2734'); roundRect(ctx, o.x + 14, o.y + 12, o.w - 28, o.h - 24, 8, '#0d1118'); ctx.strokeStyle = '#74e6ff'; ctx.strokeRect(o.x + 18, o.y + 16, o.w - 36, o.h - 32); }
function weightBench(ctx, o) { roundRect(ctx, o.x, o.y + 12, o.w, 24, 10, '#202735'); ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + 6); ctx.lineTo(o.x + o.w - 8, o.y + 6); ctx.stroke(); ctx.fillStyle = '#d7e1f0'; ctx.fillRect(o.x + 18, o.y, 10, 12); ctx.fillRect(o.x + o.w - 28, o.y, 10, 12); }
function heavyBag(ctx, o) { ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, o.y); ctx.lineTo(o.x + o.w / 2, o.y + 16); ctx.stroke(); roundRect(ctx, o.x + 6, o.y + 16, o.w - 12, o.h - 20, 16, '#3b1622'); }
function swimPool(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 28, '#0e5278'); roundRect(ctx, o.x + 12, o.y + 12, o.w - 24, o.h - 24, 22, '#1fa9d8'); ctx.strokeStyle = 'rgba(255,255,255,.45)'; for (let y = o.y + 40; y < o.y + o.h; y += 36) { ctx.beginPath(); ctx.moveTo(o.x + 24, y); ctx.quadraticCurveTo(o.x + o.w / 2, y - 20, o.x + o.w - 24, y); ctx.stroke(); } }
function kennel(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 14, '#4a2f22'); ctx.fillStyle = '#10141b'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h - 16, 20, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#f1c66a'; ctx.font = '900 10px system-ui'; ctx.fillText('KENNEL', o.x + 30, o.y + 20); }
function car(ctx, o, state) { const night = (state.time % 1440) >= 18 * 60 || (state.time % 1440) < 6 * 60; const vertical = o.h > o.w; roundRect(ctx, o.x, o.y, o.w, o.h, 22, '#252d3c'); roundRect(ctx, o.x + o.w * .18, o.y + o.h * .18, o.w * .64, o.h * .64, 16, '#111820'); ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.strokeRect(o.x + o.w * .28, o.y + o.h * .26, o.w * .44, o.h * .34); ctx.fillStyle = night ? '#ffe66e' : '#dfe7f2'; if (vertical) { ctx.fillRect(o.x + o.w * .2, o.y + 10, 18, 10); ctx.fillRect(o.x + o.w * .66, o.y + 10, 18, 10); ctx.fillStyle = '#d84b4b'; ctx.fillRect(o.x + o.w * .2, o.y + o.h - 20, 18, 8); ctx.fillRect(o.x + o.w * .66, o.y + o.h - 20, 18, 8); } else { ctx.fillRect(o.x + o.w - 24, o.y + 20, 12, 18); ctx.fillRect(o.x + o.w - 24, o.y + o.h - 38, 12, 18); ctx.fillStyle = '#d84b4b'; ctx.fillRect(o.x + 10, o.y + 20, 8, 18); ctx.fillRect(o.x + 10, o.y + o.h - 38, 8, 18); } }
function bike(ctx, o) { ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(o.x + 18, o.y + 18, 14, 0, Math.PI * 2); ctx.arc(o.x + o.w - 18, o.y + 18, 14, 0, Math.PI * 2); ctx.moveTo(o.x + 18, o.y + 18); ctx.lineTo(o.x + 46, o.y + 8); ctx.lineTo(o.x + o.w - 18, o.y + 18); ctx.lineTo(o.x + 42, o.y + 18); ctx.lineTo(o.x + 18, o.y + 18); ctx.stroke(); }
function motorbike(ctx, o) { roundRect(ctx, o.x + 20, o.y + 8, o.w - 40, o.h - 16, 16, '#111820'); ctx.fillStyle = '#74e6ff'; ctx.fillRect(o.x + 44, o.y + 16, 34, 8); ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(o.x + 18, o.y + o.h - 12, 12, 0, Math.PI * 2); ctx.arc(o.x + o.w - 18, o.y + o.h - 12, 12, 0, Math.PI * 2); ctx.stroke(); }
