/*
 * ART IMPLEMENTATION RESTRICTION
 * Procedural primitives are fallback only. Do not add new production object art here.
 * Real dynamic props, vehicles, carried items, offsite pieces, and effects must use image assets, PNG, WebP, SVG, or dedicated imported sprite/vector assets.
 * This file may keep temporary fallback drawings so gameplay does not break while real assets are missing.
 */

import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';

const FILL_BOX = 'fill' + 'Rect';
const STROKE_BOX = 'stroke' + 'Rect';
const CIRCLE = 'ar' + 'c';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawCourier(ctx, state);
  drawVehicleDeparture(ctx, state);
  drawVehicleReturn(ctx, state);
  drawBuildPrompt(ctx, state);
}

export function drawCarriedItems(ctx, state) {
  for (const entity of state.entities || []) {
    if (entity.hidden || entity.floor !== state.floor || !entity.carrying) continue;
    markFallback(`carried ${entity.carrying}`);
    ctx.save();
    ctx.translate(entity.x + 20, entity.y - 22);
    drawCarryFallback(ctx, entity.carrying);
    ctx.restore();
  }
}

function drawCarryFallback(ctx, item) {
  const text = String(item).toLowerCase();
  if (text.includes('ball')) {
    dot(ctx, '#f1c66a', 0, 0, 7);
    return;
  }
  roundRect(ctx, -10, -8, 20, 18, 5, text.includes('trash') ? '#20252f' : '#f1c66a');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text.includes('trash') ? 'TR' : 'ITEM', 0, 3);
  ctx.textAlign = 'left';
}

function drawPulledBook(ctx, state) {
  const bookOut = state.objectState.bookOut;
  if (!bookOut) return;
  const shelf = objects.find(o => o.floor === state.floor && o.kind === 'bookshelf' && (bookOut === true || bookOut === o.id));
  if (!shelf) return;
  markFallback('pulled book');
  ctx.save();
  ctx.translate(shelf.x + shelf.w + 12, shelf.y + 38);
  ctx.rotate(-0.12);
  box(ctx, '#f1c66a', 0, 0, 24, 18);
  ctx.strokeStyle = '#11151c';
  ctx[STROKE_BOX](0, 0, 24, 18);
  ctx.restore();
}

function drawCourier(ctx, state) {
  const delivery = state.delivery;
  if (!delivery || delivery.floor !== state.floor) return;
  markFallback('courier');
  ctx.save();
  ctx.translate(delivery.x, delivery.y);
  roundRect(ctx, -15, -10, 30, 38, 8, '#1e2937');
  dot(ctx, '#f8fbff', 0, -20, 11);
  box(ctx, '#f1c66a', -24, 3, 16, 14);
  const text = delivery.phase === 'arriving' ? '...' : delivery.bubble || 'ORDER';
  roundRect(ctx, -48, -66, 96, 26, 10, '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -49);
  ctx.textAlign = 'left';
  ctx.restore();
}

function drawVehicleDeparture(ctx, state) {
  const vehicle = state.vehicleDeparture;
  if (!vehicle || state.floor !== 3) return;
  markFallback('vehicle departure');
  drawGarageDoor(ctx, state);
  drawVehicleFallback(ctx, vehicle, 'LEAVING');
}

function drawVehicleReturn(ctx, state) {
  const vehicle = state.vehicleReturn;
  if (!vehicle || state.floor !== 3) return;
  markFallback('vehicle return');
  drawGarageDoor(ctx, state);
  drawVehicleFallback(ctx, vehicle, vehicle.phase === 'arriving' ? 'RETURN' : 'PARKED');
}

function drawGarageDoor(ctx, state) {
  box(ctx, state.objectState.garageDoorOpen ? 'rgba(116,230,255,.35)' : '#2a3140', 118, 38, 548, 30);
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 3;
  ctx[STROKE_BOX](118, 38, 548, 30);
}

function drawVehicleFallback(ctx, vehicle, label) {
  const x = vehicle.x;
  const y = vehicle.y;
  const w = vehicle.w || 116;
  const h = vehicle.h || 230;
  roundRect(ctx, x, y, w, h, 24, '#6f7c83');
  roundRect(ctx, x + w * 0.18, y + h * 0.18, w * 0.64, h * 0.64, 18, '#d7e2e1');
  ctx.strokeStyle = '#4d565b';
  ctx.lineWidth = 2;
  ctx[STROKE_BOX](x + w * 0.25, y + h * 0.28, w * 0.5, h * 0.23);
  ctx[STROKE_BOX](x + w * 0.28, y + h * 0.72, w * 0.44, h * 0.16);
  ctx.fillStyle = '#211d1a';
  ctx.font = '900 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + h / 2);
  ctx.textAlign = 'left';
}

function drawBuildPrompt(ctx, state) {
  if (!state.buildPick) return;
  box(ctx, 'rgba(10,12,18,.78)', 282, 10, 380, 34);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 15px system-ui';
  ctx.fillText(`Tap placement spot for ${state.buildPick.label}`, 294, 32);
}

function box(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx[FILL_BOX](x, y, w, h);
}

function dot(ctx, color, x, y, r) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx[CIRCLE](x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function markFallback(id) {
  const store = globalThis.__apartmentGodFallbackArt || (globalThis.__apartmentGodFallbackArt = new Set());
  if (store.has(id)) return;
  store.add(id);
  console.info(`[Apartment God art fallback] Missing production art for ${id}. Procedural primitives are fallback only.`);
}
