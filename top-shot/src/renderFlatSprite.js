import { ARENA_H, ARENA_W, TAU } from './config.js';
import { fighterRequest } from './requests.js';
import { stageFor } from './state.js';

export function draw(ctx, state) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  arena(ctx, state); pickups(ctx, state); projectiles(ctx, state); effects(ctx, state, false);
  for (const f of state.fighters) fighter(ctx, f);
  effects(ctx, state, true); hud(ctx, state); result(ctx, state);
}

function arena(ctx, state) {
  ctx.fillStyle = '#111923'; ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.fillStyle = '#1f2935'; ctx.fillRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#34475c'; ctx.lineWidth = 1;
  for (let x = 52; x <= ARENA_W - 52; x += 64) line(ctx, x, 52, x, ARENA_H - 52);
  for (let y = 52; y <= ARENA_H - 52; y += 64) line(ctx, 52, y, ARENA_W - 52, y);
  ctx.strokeStyle = '#9aacbf'; ctx.lineWidth = 4; ctx.strokeRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  for (const s of state.arena.shadows || []) { ctx.fillStyle = '#02050bbb'; ctx.fillRect(s.x, s.y, s.w, s.h); }
  for (const w of state.arena.walls) block(ctx, w, w.cover ? '#3d5068' : '#2a394b');
  for (const b of state.arena.breakables) if (!b.broken) block(ctx, b, '#667c91');
  ctx.fillStyle = '#d9e8f421'; ctx.font = '900 22px system-ui'; ctx.fillText(state.arena.name?.toUpperCase() || 'ARENA', 378, 86);
}

function block(ctx, r, fill) { ctx.fillStyle = '#05070c88'; ctx.fillRect(r.x + 5, r.y + 6, r.w, r.h); ctx.fillStyle = fill; ctx.fillRect(r.x, r.y, r.w, r.h); ctx.strokeStyle = '#a8b8cb'; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h); }
function pickups(ctx, state) { for (const p of state.pickups.filter(p => !p.used)) { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = '#05070c'; ctx.fillRect(-16, -16, 32, 32); ctx.fillStyle = p.color; ctx.fillRect(-11, -11, 22, 22); ctx.fillStyle = '#071018'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.type[0].toUpperCase(), 0, 4); ctx.restore(); } }
function projectiles(ctx, state) { for (const p of state.projectiles) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1)); ctx.fillStyle = p.type === 'arrow' ? '#e8f2fd' : '#caa76f'; ctx.fillRect(-12, -2, 24, 4); ctx.restore(); } }

function fighter(ctx, f) {
  const stage = stageFor(f); const final = f.incapacitated || f.defeated || f.extracted;
  const pal = colors(f, stage, final); const pose = poseFor(f.currentMove?.id || f.pose || 'idle_guard', f);
  ctx.save(); ctx.translate(Math.round(f.x), Math.round(f.y)); ctx.rotate(f.facing || 0); ctx.globalAlpha = f.extracted ? 0.16 : f.shadowHidden ? 0.5 : 1;
  if (pose.flat) ctx.rotate(Math.PI / 2); if (f.defeated) ctx.rotate(0.25);
  ctx.fillStyle = '#0009'; ctx.fillRect(-30, 12, 62, 18);
  drawPart(ctx, pose.leftLeg, pal.pants, pal.outline, 9, f.limbs?.leftLeg?.t > 0);
  drawPart(ctx, pose.rightLeg, pal.pants, pal.outline, 9, f.limbs?.rightLeg?.t > 0);
  rectBody(ctx, -27, -13, 25, 26, pal.pants, pal.outline);
  body(ctx, pal);
  drawPart(ctx, pose.leftArm, pal.sleeve, pal.outline, 7, f.limbs?.leftArm?.t > 0);
  drawPart(ctx, pose.rightArm, pal.sleeve, pal.outline, 7, f.limbs?.rightArm?.t > 0);
  fist(ctx, pose.leftArm.hx, pose.leftArm.hy, pal); fist(ctx, pose.rightArm.hx, pose.rightArm.hy, pal); foot(ctx, pose.leftLeg.hx, pose.leftLeg.hy, pal); foot(ctx, pose.rightLeg.hx, pose.rightLeg.hy, pal);
  weapon(ctx, f, pal); if (f.currentMove?.ttl > 0) arc(ctx, f.currentMove);
  ctx.rotate(-(f.facing || 0)); labels(ctx, f, stage); ctx.restore();
}

function body(ctx, p) {
  rectBody(ctx, -13, -24, 31, 48, p.shoulder, p.outline);
  rectBody(ctx, -7, -19, 35, 38, p.vest, p.outline);
  ctx.fillStyle = p.shirt; poly(ctx, [[-3,-15],[21,-17],[29,-5],[29,5],[21,17],[-3,15]]);
  ctx.strokeStyle = p.gear; ctx.lineWidth = 3; line(ctx, -8, -18, 25, 15); line(ctx, -8, 18, 25, -15);
  rectBody(ctx, 19, -13, 17, 26, p.skin, p.outline);
  ctx.fillStyle = p.hair; ctx.fillRect(21, -13, 13, 26); ctx.fillRect(30, -11, 7, 22);
  ctx.fillStyle = p.face; ctx.fillRect(36, -6, 3, 3); ctx.fillRect(36, 4, 3, 3); ctx.fillRect(34, -1, 3, 2);
}

function poseFor(name, f) {
  const running = ['walk','run','rush','limp_run','stagger_limp','crouchWalk'].includes(name);
  const p = running ? runCycle(f.anim || 0) : base(); p.flat = false;
  if (['down','prone','crawl'].includes(name) || f.incapacitated || f.prone) return flat(p);
  if (['roll','combat_roll','dive_roll','somersault_dive','flat_dive'].includes(name)) return roll(p);
  if (f.crouch || name === 'duck' || name === 'crouchWalk') crouch(p);
  if (name === 'left_jab') p.leftArm = seg(8, 15, 31, 12, 57, 7);
  if (name === 'right_cross') p.rightArm = seg(8, -15, 33, -11, 60, -6);
  if (name === 'left_elbow') p.leftArm = seg(8, 15, 28, 21, 22, 3);
  if (name === 'right_elbow') p.rightArm = seg(8, -15, 28, -21, 22, -3);
  if (name === 'left_knee') p.leftLeg = seg(-16, 9, 6, 22, 23, 12);
  if (name === 'right_knee') p.rightLeg = seg(-16, -9, 6, -22, 23, -12);
  if (name === 'left_kick') p.leftLeg = seg(-15, 10, 14, 22, 56, 27);
  if (name === 'right_kick' || name === 'roundhouse') p.rightLeg = seg(-15, -10, 14, -22, 56, -27);
  if (name === 'block_leftArm') p.leftArm = seg(7, 15, 20, 24, 27, 4);
  if (name === 'block_rightArm') p.rightArm = seg(7, -15, 20, -24, 27, -4);
  if (name === 'block_leftLeg') p.leftLeg = seg(-17, 10, -5, 25, 14, 20);
  if (name === 'block_rightLeg') p.rightLeg = seg(-17, -10, -5, -25, 14, -20);
  if (name === 'cross_block_leftArm') p.leftArm = seg(7, 15, 18, 3, 31, -12);
  if (name === 'cross_block_rightArm') p.rightArm = seg(7, -15, 18, -3, 31, 12);
  if (name === 'parry_leftArm') p.leftArm = seg(7, 15, 25, 18, 39, 6);
  if (name === 'parry_rightArm') p.rightArm = seg(7, -15, 25, -18, 39, -6);
  if (name === 'slip_left') { p.leftArm = seg(7, 15, 18, 23, 30, 18); p.rightArm = seg(7, -15, 15, -20, 24, -12); }
  if (name === 'slip_right') { p.leftArm = seg(7, 15, 15, 20, 24, 12); p.rightArm = seg(7, -15, 18, -23, 30, -18); }
  if (name === 'grapple') { p.leftArm = seg(8, 15, 29, 18, 42, 7); p.rightArm = seg(8, -15, 29, -18, 42, -7); }
  if (name === 'disarm_attempt' || name === 'disarmed') { p.leftArm = seg(8, 15, 27, 10, 43, 2); p.rightArm = seg(8, -15, 27, -10, 43, -2); }
  if (['short_slash', 'wide_slash', 'reverse_slash', 'thrust_slash', 'knife_jab', 'low_knife_cut', 'arrow_stab'].includes(name)) p.rightArm = seg(8, -15, 31, -13, 56, -10);
  return p;
}

function runCycle(anim) {
  const frames = [
    {
      leftArm: seg(7, 16, 4, 27, -13, 31),
      rightArm: seg(7, -16, 22, -20, 34, -13),
      leftLeg: seg(-17, 10, -24, 17, -35, 25),
      rightLeg: seg(-17, -10, -40, -14, -62, -20)
    },
    {
      leftArm: seg(7, 16, 14, 25, 23, 17),
      rightArm: seg(7, -16, 14, -25, 23, -17),
      leftLeg: seg(-17, 10, -34, 15, -50, 17),
      rightLeg: seg(-17, -10, -34, -15, -50, -17)
    },
    {
      leftArm: seg(7, 16, 22, 20, 34, 13),
      rightArm: seg(7, -16, 4, -27, -13, -31),
      leftLeg: seg(-17, 10, -40, 14, -62, 20),
      rightLeg: seg(-17, -10, -24, -17, -35, -25)
    },
    {
      leftArm: seg(7, 16, 14, 25, 23, 17),
      rightArm: seg(7, -16, 14, -25, 23, -17),
      leftLeg: seg(-17, 10, -34, 15, -50, 17),
      rightLeg: seg(-17, -10, -34, -15, -50, -17)
    }
  ];
  return clonePose(frames[Math.floor(anim) % frames.length]);
}

function base() { return { leftArm: seg(7, 16, 15, 25, 26, 17), rightArm: seg(7, -16, 15, -25, 26, -17), leftLeg: seg(-17, 10, -34, 17, -50, 22), rightLeg: seg(-17, -10, -34, -17, -50, -22) }; }
function clonePose(p) { return { leftArm: { ...p.leftArm }, rightArm: { ...p.rightArm }, leftLeg: { ...p.leftLeg }, rightLeg: { ...p.rightLeg } }; }
function crouch(p) { p.leftLeg = seg(-16, 10, -29, 24, -39, 36); p.rightLeg = seg(-16, -10, -29, -24, -39, -36); p.leftArm = seg(7, 15, 18, 24, 29, 18); p.rightArm = seg(7, -15, 18, -24, 29, -18); }
function flat(p) { p.flat = true; p.leftArm = seg(8, 14, 31, 20, 52, 23); p.rightArm = seg(8, -14, 31, -20, 52, -23); p.leftLeg = seg(-18, 10, -39, 15, -61, 17); p.rightLeg = seg(-18, -10, -39, -15, -61, -17); return p; }
function roll(p) { p.flat = true; p.leftArm = seg(4, 12, 15, 20, 27, 13); p.rightArm = seg(4, -12, 15, -20, 27, -13); p.leftLeg = seg(-10, 8, -23, 15, -33, 7); p.rightLeg = seg(-10, -8, -23, -15, -33, -7); return p; }
function seg(sx, sy, ex, ey, hx, hy) { return { sx, sy, ex, ey, hx, hy }; }

function drawPart(ctx, s, fill, outline, w, hot) { ctx.strokeStyle = outline; ctx.lineWidth = w + 5; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.beginPath(); ctx.moveTo(s.sx, s.sy); ctx.lineTo(s.ex, s.ey); ctx.lineTo(s.hx, s.hy); ctx.stroke(); ctx.strokeStyle = hot ? '#ffe36d' : fill; ctx.lineWidth = w; ctx.stroke(); ctx.fillStyle = hot ? '#ffe36d' : fill; ctx.fillRect(s.ex - 3, s.ey - 3, 6, 6); }
function rectBody(ctx, x, y, w, h, fill, stroke) { ctx.fillStyle = stroke; ctx.fillRect(x - 2, y - 2, w + 4, h + 4); ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
function fist(ctx, x, y, p) { rectBody(ctx, x - 5, y - 4, 9, 8, p.glove, p.outline); ctx.fillStyle = p.skin; ctx.fillRect(x - 2, y - 2, 3, 4); }
function foot(ctx, x, y, p) { rectBody(ctx, x - 7, y - 4, 14, 8, p.boot, p.outline); ctx.fillStyle = p.gear; ctx.fillRect(x + 2, y - 3, 3, 6); }
function weapon(ctx, f, p) { ctx.strokeStyle = p.weapon; ctx.lineWidth = 4; if (f.weapon === 'rifle' || f.archetypeId === 'marine') line(ctx, 16, -19, 57, -29); else if (f.weapon === 'bow' || f.archetypeId === 'archer') line(ctx, 8, 22, 44, 31); else if (f.melee === 'sword' || f.archetypeId === 'ninja') line(ctx, 15, -19, 52, -24); }
function arc(ctx, m) { ctx.strokeStyle = m.kind === 'sword' ? '#eaf3ff' : '#f3d66f'; ctx.lineWidth = 4; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(24, 0, m.reach || 44, -.5, .5); ctx.stroke(); ctx.globalAlpha = 1; }
function labels(ctx, f, stage) { ctx.textAlign = 'center'; ctx.font = '800 12px system-ui'; ctx.fillStyle = stage.color; ctx.fillText(stage.label, 0, -50); meter(ctx, -32, -43, 64, 5, f.hp, stage.color); if (f.intent) { ctx.fillStyle = '#b9c7db'; ctx.font = '700 10px system-ui'; ctx.fillText(String(f.intent).replace('coach_', ''), 0, -60); } }
function colors(f, stage, final) { const dull = final ? .78 : Math.max(0, 1 - (stage.saturation ?? 1)); return { outline: '#06090e', skin: final ? '#9a9a9a' : '#b77b58', hair: '#11141a', face: '#f0c7a6', shoulder: mix(f.color || '#506f92', '#858d98', dull * .75), shirt: mix(f.accent || '#5b6b84', '#89919b', dull), vest: '#1b232e', pants: mix(f.color || '#506f92', '#858d98', dull), sleeve: mix(f.color || '#506f92', '#858d98', dull * .8), gear: '#776a4a', glove: '#11161d', boot: '#0d1117', weapon: '#10151d' }; }
function effects(ctx, state, over) { for (const e of state.effects) { const top = ['tracer', 'alert', 'command'].includes(e.type); if (top !== over) continue; ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, e.ttl * 6)); if (e.type === 'tracer') { ctx.strokeStyle = '#e8fbff'; ctx.lineWidth = 5; line(ctx, e.x, e.y, e.x2, e.y2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; line(ctx, e.x, e.y, e.x2, e.y2); dot(ctx, e.x, e.y, 8, '#f7d96a'); } else if (e.type === 'smoke') dot(ctx, e.x, e.y, 55 * (1 - e.ttl / .9), '#cfd8e655'); else if (e.type === 'explosion') dot(ctx, e.x, e.y, (e.radius || 80) * (1 - e.ttl / .7), '#f3b24d55'); else { dot(ctx, e.x, e.y, 15, effectColor(e.type)); if (e.type === 'command' && e.label) { ctx.fillStyle = '#f0d36a'; ctx.font = '900 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(iconText(e.label), e.x, e.y - 22); } } ctx.restore(); } }
function hud(ctx, state) {
  ctx.fillStyle = '#0b111bcc'; ctx.fillRect(980, 0, 300, 720);
  ctx.fillStyle = '#eef6ff'; ctx.font = '900 26px system-ui'; ctx.fillText('TOP SHOT', 1000, 38);
  ctx.fillStyle = '#aebbd0'; ctx.font = '700 13px system-ui'; ctx.fillText('Flat tactical sprite pass', 1000, 60);
  const handler = state.fighters.find(f => f.team === 'A');
  handlerLink(ctx, handler, fighterRequest(state, handler), 1000, 78);
  state.fighters.forEach((f, i) => card(ctx, f, 1000, 190 + i * 142));
  let y = 485; ctx.fillStyle = '#d6e2f2'; ctx.font = '800 13px system-ui';
  ctx.fillText(`State: ${state.matchState}`, 1000, y); ctx.fillText(`Trust: ${Math.round(state.trust)}`, 1000, y + 22); ctx.fillText(`Clock: ${state.clock.toFixed(1)}s`, 1000, y + 44);
  y += 72; ctx.fillStyle = '#9fb0c6'; ctx.font = '700 12px system-ui';
  for (const l of state.log.slice(0, 7)) { fitText(ctx, l, 1000, y, 260); y += 21; }
}
function handlerLink(ctx, f, request, x, y) {
  if (!f || !request) return;
  ctx.fillStyle = '#111a27'; ctx.fillRect(x, y, 250, 92);
  ctx.strokeStyle = request.color; ctx.lineWidth = 2; ctx.strokeRect(x, y, 250, 92);
  handlerPortrait(ctx, f, request, x + 12, y + 14, 64);
  ctx.fillStyle = '#9fb0c6'; ctx.font = '800 10px system-ui'; ctx.fillText('HANDLER LINK', x + 88, y + 23);
  ctx.fillStyle = request.color; ctx.font = '900 15px system-ui'; fitText(ctx, request.label, x + 88, y + 45, 146);
  ctx.fillStyle = '#edf4ff'; ctx.font = '700 12px system-ui'; fitText(ctx, request.detail, x + 88, y + 66, 146);
}
function handlerPortrait(ctx, f, request, x, y, size) {
  const s = stageFor(f);
  const p = colors(f, s, f.incapacitated || f.defeated || f.extracted);
  ctx.fillStyle = '#091018'; ctx.fillRect(x, y, size, size); ctx.strokeStyle = '#334154'; ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size);
  // Compact original portrait inspired by the upward-looking reference: broad shoulders, raised face, hands at the handler edge.
  rectBody(ctx, x + 6, y + 40, 52, 16, p.vest, p.outline);
  rectBody(ctx, x + 15, y + 34, 34, 12, p.sleeve, p.outline);
  rectBody(ctx, x + 26, y + 32, 12, 10, p.skin, p.outline);
  rectBody(ctx, x + 20, y + 17, 24, 24, p.skin, p.outline);
  ctx.fillStyle = p.hair; ctx.fillRect(x + 18, y + 14, 28, 12); ctx.fillRect(x + 18, y + 23, 8, 10); ctx.fillRect(x + 38, y + 23, 8, 10);
  ctx.fillStyle = p.face; ctx.fillRect(x + 26, y + 29, 4, 3); ctx.fillRect(x + 36, y + 29, 4, 3);
  rectBody(ctx, x + 8, y + 45, 11, 15, p.skin, p.outline);
  rectBody(ctx, x + 45, y + 45, 11, 15, p.skin, p.outline);
  ctx.fillStyle = request.color; ctx.fillRect(x + 44, y + 5, 17, 15);
  ctx.fillStyle = '#071018'; ctx.font = '900 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText(iconText(request.icon), x + 52.5, y + 16);
}
function card(ctx, f, x, y) { const s = stageFor(f); ctx.fillStyle = '#121b28'; ctx.fillRect(x, y, 250, 132); ctx.strokeStyle = f.color; ctx.strokeRect(x, y, 250, 132); ctx.fillStyle = '#eff5ff'; ctx.font = '900 15px system-ui'; fitText(ctx, f.name, x + 12, y + 23, 160); ctx.fillStyle = s.color; ctx.font = '800 12px system-ui'; ctx.fillText(s.label, x + 185, y + 23); labelMeter(ctx, 'VIT', f.hp, x + 12, y + 40, s.color); labelMeter(ctx, 'STA', f.stamina, x + 12, y + 62, '#7ad99a'); labelMeter(ctx, 'DODGE', f.dodge, x + 12, y + 84, '#b894ff'); labelMeter(ctx, 'BLOCK', f.block, x + 12, y + 106, '#f0d36a'); }
function result(ctx, state) { if (state.matchState !== 'finished') return; ctx.fillStyle = '#05080dcc'; ctx.fillRect(120, 250, 720, 150); ctx.strokeStyle = '#f0d36a'; ctx.lineWidth = 3; ctx.strokeRect(120, 250, 720, 150); ctx.textAlign = 'center'; ctx.fillStyle = '#f5f0d0'; ctx.font = '900 34px system-ui'; ctx.fillText('MATCH COMPLETE', 480, 305); ctx.fillStyle = '#edf4ff'; ctx.font = '800 20px system-ui'; ctx.fillText(state.result || 'Match finished.', 480, 340); }
function labelMeter(ctx, label, value, x, y, color) { ctx.fillStyle = '#aebbd0'; ctx.font = '800 10px system-ui'; ctx.fillText(label, x, y + 8); meter(ctx, x + 48, y, 170, 8, value, color); }
function meter(ctx, x, y, w, h, value, color) { ctx.fillStyle = '#091018'; ctx.fillRect(x, y, w, h); ctx.fillStyle = color; ctx.fillRect(x, y, w * Math.max(0, Math.min(100, value)) / 100, h); }
function fitText(ctx, text, x, y, maxWidth) { let out = String(text); while (out.length > 4 && ctx.measureText(out).width > maxWidth) out = out.slice(0, -2).trim(); if (out !== String(text)) out = `${out.slice(0, -1)}...`; ctx.fillText(out, x, y); }
function iconText(label) { const icons = { bleed: '+', med: '+', grenade: 'G', ammo: 'AM', extract: 'EX', ok: 'OK', command: '?', help: '?' }; return icons[label] || String(label || '?').slice(0, 2).toUpperCase(); }
function effectColor(type) { return { block: '#f4db73', cross_block: '#f7b955', parry: '#8ee6ff', slip: '#7bd0ff', dodge: '#7bd0ff', counter: '#ff9b66' }[type] || '#f15d56'; }
function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill(); }
function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function dot(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function mix(a, b, t) { const ca = parse(a), cb = parse(b); return `rgb(${Math.round(ca.r + (cb.r - ca.r) * t)}, ${Math.round(ca.g + (cb.g - ca.g) * t)}, ${Math.round(ca.b + (cb.b - ca.b) * t)})`; }
function parse(hex) { const v = Number.parseInt(String(hex).replace('#', '').slice(0, 6), 16) || 0; return { r: v >> 16 & 255, g: v >> 8 & 255, b: v & 255 }; }
