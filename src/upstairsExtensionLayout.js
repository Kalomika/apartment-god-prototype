import { objects } from './world.js';

const FLOOR = '#d8c4a4';
const WALL = '#6f6556';
const VANITY = '#8f765f';
const BASIN = '#ece5d8';
const WATER = '#a8d3db';
const TV_OFF = '#262320';
const GLASS = 'rgba(168,211,219,.68)';

export function applyUpstairsExtensionLayout() {
  patch('stairs_up', { x: 72, y: 572, w: 118, h: 84, room: 'upstairs_landing' });
  patch('bookshelf', { x: 520, y: 372, w: 42, h: 54, room: 'office', label: 'Office Book Library' });
  patch('office_couch', { x: 850, y: 300, w: 58, h: 118, facing: 'west', room: 'office' });
  patch('master_bath_sink', { x: 526, y: 504, w: 42, h: 112, facing: 'east', handleSide: 'west', room: 'suite_foyer', label: 'Primary East-Facing Double Vanity' });
}

export function drawUpstairsExtensionPolish(ctx, state) {
  if (state.floor !== 1) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawStairLanding(ctx);
  drawBedroomBuiltIns(ctx);
  drawSharedBathModernLayout(ctx);
  drawSuiteVanityOrientation(ctx);
  ctx.restore();
}

function drawStairLanding(ctx) {
  const stairs = object('stairs_up');
  if (!stairs) return;
  clearZone(ctx, 46, 540, 172, 134);
  round(ctx, 50, 548, 160, 124, 8, '#cdbb9b');
  round(ctx, 50, 548, 160, 8, 2, WALL);
  round(ctx, 50, 664, 160, 8, 2, WALL);
  round(ctx, 50, 548, 8, 124, 2, WALL);
  drawStairWell(ctx, stairs.x, stairs.y, stairs.w, stairs.h);
  label(ctx, 'STAIRS UP', 76, 562);
}

function drawBedroomBuiltIns(ctx) {
  drawBedroomSet(ctx, object('full_bed'), object('full_bedroom_tv'), object('full_bedroom_closet'), 'FULL');
  drawBedroomSet(ctx, object('queen_bed'), object('queen_bedroom_tv'), object('queen_bedroom_closet'), 'QUEEN');
  drawBedroomSet(ctx, object('bed'), object('bedroom_tv'), object('closet'), 'PRIMARY');
}

function drawBedroomSet(ctx, bed, tv, closet, labelText) {
  if (bed) {
    round(ctx, bed.x - 5, bed.y - 5, bed.w + 10, bed.h + 10, 14, '#6f5947');
    round(ctx, bed.x + 8, bed.y + 8, 34, bed.h - 16, 12, '#7f654f');
    round(ctx, bed.x + 42, bed.y + 12, bed.w - 56, bed.h - 24, 14, '#f1e7d8');
    round(ctx, bed.x + 54, bed.y + 20, 42, 30, 10, '#fffaf2');
    round(ctx, bed.x + 102, bed.y + 18, bed.w - 116, bed.h - 36, 12, '#60718f');
  }
  if (tv) {
    round(ctx, tv.x - 2, tv.y - 2, tv.w + 4, tv.h + 4, 4, '#3a3531');
    round(ctx, tv.x + 4, tv.y + 8, tv.w - 8, tv.h - 16, 3, TV_OFF);
    line(ctx, tv.x - 4, tv.y + tv.h / 2, tv.x + tv.w + 4, tv.y + tv.h / 2, 'rgba(255,255,255,.12)', 1);
  }
  if (closet) {
    round(ctx, closet.x, closet.y, closet.w, closet.h, 5, '#5f5145');
    round(ctx, closet.x + 7, closet.y + 5, closet.w - 14, closet.h - 10, 3, '#2d3338');
  }
  if (bed) label(ctx, labelText, bed.x + 10, bed.y - 9);
}

function drawSharedBathModernLayout(ctx) {
  const shower = object('shared_shower');
  const sink = object('shared_bath_sink');
  const toilet = object('shared_toilet');
  clearZone(ctx, 36, 348, 166, 150);
  round(ctx, 38, 350, 160, 146, 8, '#d3c1a2');
  round(ctx, 38, 350, 160, 8, 2, WALL);
  round(ctx, 38, 488, 160, 8, 2, WALL);
  if (shower) drawGlassShower(ctx, shower);
  if (sink) drawModernSingleVanity(ctx, sink, 'west');
  if (toilet) drawModernToilet(ctx, toilet);
  label(ctx, 'SHARED BATH', 54, 364);
}

function drawSuiteVanityOrientation(ctx) {
  const sink = object('master_bath_sink');
  if (!sink) return;
  clearZone(ctx, sink.x - 12, sink.y - 16, sink.w + 44, sink.h + 32);
  drawEastFacingDoubleVanity(ctx, sink);
  label(ctx, 'HANDLES WEST', sink.x - 4, sink.y - 10);
}

function drawGlassShower(ctx, shower) {
  round(ctx, shower.x - 2, shower.y - 2, shower.w + 4, shower.h + 4, 8, '#5f6c6d');
  round(ctx, shower.x + 6, shower.y + 7, shower.w - 12, shower.h - 14, 6, GLASS);
  line(ctx, shower.x + 12, shower.y + 14, shower.x + shower.w - 12, shower.y + shower.h - 12, 'rgba(255,255,255,.28)', 2);
  circle(ctx, shower.x + shower.w - 13, shower.y + 17, 4, '#cfd9dc');
}

function drawModernSingleVanity(ctx, sink, handleSide = 'north') {
  round(ctx, sink.x - 3, sink.y - 3, sink.w + 6, sink.h + 6, 7, '#5f5145');
  round(ctx, sink.x + 4, sink.y + 5, sink.w - 8, sink.h - 10, 6, VANITY);
  ctx.fillStyle = BASIN;
  ctx.beginPath();
  ctx.ellipse(sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, 17, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = WATER;
  ctx.beginPath(); ctx.ellipse(sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, 11, 5, 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, sink.x + sink.w / 2, sink.y + sink.h / 2 + 2, 2.8, '#4e5964');
  if (handleSide === 'west') line(ctx, sink.x + 8, sink.y + 8, sink.x + 8, sink.y + sink.h - 8, '#cfd9dc', 3);
  else line(ctx, sink.x + sink.w / 2 - 8, sink.y + 8, sink.x + sink.w / 2 + 8, sink.y + 8, '#cfd9dc', 3);
}

function drawEastFacingDoubleVanity(ctx, sink) {
  round(ctx, sink.x - 4, sink.y - 4, sink.w + 8, sink.h + 8, 8, '#5f5145');
  round(ctx, sink.x + 5, sink.y + 7, sink.w - 10, sink.h - 14, 7, VANITY);
  for (const y of [sink.y + sink.h * .32, sink.y + sink.h * .68]) {
    ctx.fillStyle = BASIN;
    ctx.beginPath();
    ctx.ellipse(sink.x + sink.w * .58, y, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = WATER;
    ctx.beginPath(); ctx.ellipse(sink.x + sink.w * .58, y, 8, 13, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, sink.x + sink.w * .58, y, 2.8, '#4e5964');
    line(ctx, sink.x + 8, y - 15, sink.x + 8, y + 15, '#cfd9dc', 3);
  }
}

function drawModernToilet(ctx, toilet) {
  round(ctx, toilet.x + 6, toilet.y, toilet.w - 12, 16, 5, '#ece5d8');
  ctx.fillStyle = '#ece5d8';
  ctx.beginPath();
  ctx.ellipse(toilet.x + toilet.w / 2, toilet.y + 34, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#66737b'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#a8d3db';
  ctx.beginPath(); ctx.ellipse(toilet.x + toilet.w / 2, toilet.y + 35, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
}

function drawStairWell(ctx, x, y, w, h) {
  round(ctx, x - 8, y - 8, w + 16, h + 16, 12, '#5b5145');
  round(ctx, x + 1, y + 1, w - 2, h - 2, 8, '#b7a384');
  for (let i = 0; i < 7; i += 1) {
    const p = i / 6;
    const sy = y + 11 + i * ((h - 22) / 7);
    round(ctx, x + 14, sy, w - 28, 7, 3, `rgba(12,15,18,${0.2 + p * 0.58})`);
  }
  round(ctx, x + 22, y + h - 20, w - 44, 14, 5, 'rgba(4,7,10,.80)');
}

function clearZone(ctx, x, y, w, h) {
  round(ctx, x, y, w, h, 0, FLOOR);
  ctx.strokeStyle = 'rgba(124,103,75,.15)';
  ctx.lineWidth = 1;
  for (let lineY = Math.ceil(y / 14) * 14; lineY < y + h; lineY += 14) line(ctx, x + 8, lineY, x + w - 8, lineY, 'rgba(124,103,75,.15)', 1);
}

function patch(id, patchValues) {
  const obj = object(id);
  if (obj) Object.assign(obj, patchValues);
}

function object(id) { return objects.find(o => o.id === id) || null; }

function label(ctx, text, x, y) {
  ctx.fillStyle = 'rgba(7,16,24,.62)';
  ctx.font = '900 9px system-ui';
  ctx.fillText(text, x, y);
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
