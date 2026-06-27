import { objects, roomAt } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    const active = state.entities.some(e => e.target?.objectId === obj.id || String(e.action || '').toLowerCase().includes(obj.kind));
    ctx.save();
    ctx.shadowColor = active ? 'rgba(242,214,109,.45)' : 'transparent';
    ctx.shadowBlur = active ? 18 : 0;
    drawObject(ctx, obj, state, active);
    ctx.restore();
  }
}

function drawObject(ctx, o, state, active) {
  if (o.kind === 'couch') return couch(ctx, o);
  if (o.kind === 'tv') return tv(ctx, o, state);
  if (o.kind === 'fridge') return fridge(ctx, o, state);
  if (o.kind === 'stove') return stove(ctx, o);
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
  roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#667085');
}

function couch(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 16, '#775f7f'); roundRect(ctx, o.x + 10, o.y + 9, 58, 44, 10, '#8b72a0'); roundRect(ctx, o.x + 82, o.y + 9, 58, 44, 10, '#8b72a0'); }
function tv(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 6, '#151923'); roundRect(ctx, o.x + 8, o.y + 6, o.w - 16, o.h - 12, 4, state.tv.on ? '#5fc7ff' : '#242b38'); }
function fridge(ctx, o, state) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#d5dde8'); if (state.objectState.fridgeOpen) { ctx.fillStyle = '#dff7ff'; ctx.fillRect(o.x + o.w, o.y + 10, 20, o.h - 20); } }
function stove(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#606878'); for (let i = 0; i < 4; i++) { ctx.strokeStyle = '#252b35'; ctx.beginPath(); ctx.arc(o.x + 18 + (i % 2) * 34, o.y + 18 + Math.floor(i / 2) * 28, 9, 0, Math.PI * 2); ctx.stroke(); } }
function sink(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#aab7c8'); roundRect(ctx, o.x + 10, o.y + 9, o.w - 20, o.h - 18, 8, '#62778f'); }
function shower(ctx, o, active) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#6d8ea6'); ctx.strokeStyle = active ? '#9ce8ff' : '#cdefff'; ctx.strokeRect(o.x + 8, o.y + 8, o.w - 16, o.h - 16); }
function toilet(ctx, o) { roundRect(ctx, o.x + 4, o.y, o.w - 8, 20, 5, '#d9e3ef'); ctx.fillStyle = '#d9e3ef'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + 38, 19, 16, 0, 0, Math.PI * 2); ctx.fill(); }
function door(ctx, o, state) { ctx.fillStyle = '#8a5c3d'; ctx.fillRect(o.x, o.y, o.w, o.h); if (state.objectState.doorOpen) { ctx.fillStyle = '#9b704e'; ctx.fillRect(o.x + o.w, o.y + 8, 16, o.h - 16); } }
function bed(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 14, '#59739c'); roundRect(ctx, o.x + 14, o.y + 12, 54, 36, 10, '#d7e1f0'); roundRect(ctx, o.x + 76, o.y + 18, o.w - 90, o.h - 32, 12, '#7d9fd1'); }
function desk(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#795d45'); roundRect(ctx, o.x + 36, o.y + 10, 50, 34, 5, '#222936'); ctx.fillStyle = '#7de1ff'; ctx.fillRect(o.x + 42, o.y + 15, 38, 18); }
function bowl(ctx, o) { ctx.fillStyle = '#b43f4e'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill(); }
function light(ctx, o, state) { const room = roomAt(o.x, o.y, o.floor); ctx.fillStyle = room && state.roomLights[room.id] !== false ? '#ffe377' : '#555d69'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 11, 0, Math.PI * 2); ctx.fill(); }
function stairs(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#3b4656'); ctx.strokeStyle = '#93a0b3'; for (let y = o.y + 12; y < o.y + o.h; y += 14) { ctx.beginPath(); ctx.moveTo(o.x + 12, y); ctx.lineTo(o.x + o.w - 12, y); ctx.stroke(); } }
function bookshelf(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#6c4b33'); for (let y = o.y + 14; y < o.y + o.h - 8; y += 24) { ctx.fillStyle = '#d7a45f'; ctx.fillRect(o.x + 8, y, o.w - 16, 5); ctx.fillStyle = '#8fb3e8'; ctx.fillRect(o.x + 12, y + 7, 10, 14); ctx.fillStyle = '#e88fae'; ctx.fillRect(o.x + 28, y + 7, 8, 14); ctx.fillStyle = '#90d68c'; ctx.fillRect(o.x + 42, y + 7, 12, 14); } }
function workout(ctx, o) { roundRect(ctx, o.x, o.y, o.w, o.h, 8, '#45505e'); ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(o.x + 12, o.y + 22); ctx.lineTo(o.x + o.w - 12, o.y + 22); ctx.stroke(); ctx.fillStyle = '#d7e1f0'; ctx.fillRect(o.x + 8, o.y + 14, 8, 16); ctx.fillRect(o.x + o.w - 16, o.y + 14, 8, 16); }
