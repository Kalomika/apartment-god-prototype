import { ARENA_H, ARENA_W, TAU } from './config.js';
import { stageFor } from './state.js';

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawArena(ctx, state); drawPickups(ctx, state); drawProjectiles(ctx, state); drawEffects(ctx, state, false); drawFighters(ctx, state); drawEffects(ctx, state, true); drawSideHud(ctx, state); drawResult(ctx, state);
}

function drawArena(ctx, state) {
  ctx.fillStyle = '#121b27'; ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.fillStyle = '#202b3a'; ctx.fillRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#3a4b62'; ctx.lineWidth = 2;
  for (let x = 52; x <= ARENA_W - 52; x += 64) line(ctx, x, 52, x, ARENA_H - 52);
  for (let y = 52; y <= ARENA_H - 52; y += 64) line(ctx, 52, y, ARENA_W - 52, y);
  ctx.strokeStyle = '#7f8fa6'; ctx.lineWidth = 4; ctx.strokeRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  for (const s of state.arena.shadows || []) { ctx.fillStyle = '#02050aaa'; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.strokeStyle = '#111d2c'; ctx.lineWidth = 2; ctx.strokeRect(s.x, s.y, s.w, s.h); }
  for (const wall of state.arena.walls) box(ctx, wall, wall.cover ? '#394b63' : '#26364a', '#7d8ba2');
  for (const b of state.arena.breakables) if (!b.broken) box(ctx, b, '#61778faa', '#b9d8eb');
  ctx.fillStyle = '#d8e6f422'; ctx.font = '900 22px system-ui'; ctx.fillText(state.arena.name?.toUpperCase() || 'ARENA', 380, 88);
}

function drawPickups(ctx, state) { for (const p of state.pickups.filter(p => !p.used)) { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = '#071018'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill(); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill(); ctx.fillStyle = '#061018'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.type[0].toUpperCase(), 0, 4); ctx.restore(); } }
function drawProjectiles(ctx, state) { for (const p of state.projectiles) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1)); if (p.type === 'grenade') { dot(ctx, 0, 0, 8, '#596777'); ctx.strokeStyle = '#f1d36b'; ctx.lineWidth = 2; ctx.stroke(); } else if (p.type === 'shuriken') { ctx.strokeStyle = '#dce7f4'; ctx.lineWidth = 3; line(ctx, -9, 0, 9, 0); line(ctx, 0, -9, 0, 9); } else { ctx.fillStyle = p.type === 'arrow' ? '#e4edf8' : '#c9aa75'; ctx.fillRect(-11, -2, 22, 4); ctx.fillRect(5, -5, 8, 10); } ctx.restore(); } }
function drawFighters(ctx, state) { for (const f of state.fighters) drawFighter(ctx, f); }

function drawFighter(ctx, f) {
  const stage = stageFor(f); const final = f.incapacitated || f.defeated || f.extracted;
  const palette = fighterPalette(f, stage, final); const move = f.currentMove?.id || f.pose || 'idle'; const pose = poseFor(f, move);
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.facing + pose.bodyRot); ctx.globalAlpha = f.extracted ? 0.18 : f.shadowHidden ? 0.45 : 1;
  if (pose.flat) ctx.rotate(Math.PI / 2); if (f.defeated) ctx.rotate(0.28);
  shadow(ctx, pose.flat ? 34 : 25, pose.flat ? 13 : 11);
  if (pose.roll) return drawRoll(ctx, f, palette, stage);
  limb(ctx, pose.leftLeg, palette.pants, palette.outline, 9, f.limbs.leftLeg.t > 0); limb(ctx, pose.rightLeg, palette.pants, palette.outline, 9, f.limbs.rightLeg.t > 0);
  pelvis(ctx, palette); torso(ctx, palette, pose); gear(ctx, palette); head(ctx, palette, pose);
  limb(ctx, pose.leftArm, palette.skin, palette.outline, 7, f.limbs.leftArm.t > 0); limb(ctx, pose.rightArm, palette.skin, palette.outline, 7, f.limbs.rightArm.t > 0);
  fistsAndFeet(ctx, pose, palette); weapon(ctx, f, palette); moveCue(ctx, f.currentMove);
  ctx.rotate(-f.facing - pose.bodyRot); ctx.globalAlpha = 1; labels(ctx, f, stage); ctx.restore();
}

function poseFor(f, move) {
  const w = Math.sin(f.anim || 0); const run = ['walk','run','rush','limp_run','stagger_limp','crouchWalk'].includes(f.pose);
  const p = basePose(w, run); p.bodyRot = 0; p.flat = f.prone || f.incapacitated || move === 'down'; p.roll = ['roll','combat_roll','dive_roll','somersault_dive'].includes(move);
  if (p.flat) { p.leftArm = segs(9,15,30,21,48,23); p.rightArm = segs(9,-15,30,-21,48,-23); p.leftLeg = segs(-16,11,-36,16,-56,18); p.rightLeg = segs(-16,-11,-36,-16,-56,-18); return p; }
  if (f.crouch || move === 'duck') { p.scaleY = 0.88; p.leftLeg = segs(-10,10,-24,24,-34,35); p.rightLeg = segs(-10,-10,-24,-24,-34,-35); }
  if (move.includes('left_jab') || move === 'leftJab') p.leftArm = segs(9,14,28,12,54,8);
  if (move.includes('right_cross') || move === 'rightCross') p.rightArm = segs(9,-14,30,-10,58,-6);
  if (move.includes('left_elbow')) p.leftArm = segs(8,14,25,20,18,4);
  if (move.includes('right_elbow')) p.rightArm = segs(8,-14,25,-20,18,-4);
  if (move.includes('left_kick')) p.leftLeg = segs(-12,10,16,18,53,25);
  if (move.includes('right_kick') || move === 'roundhouse') p.rightLeg = segs(-12,-10,16,-18,53,-25);
  if (move.includes('left_knee')) p.leftLeg = segs(-12,10,8,20,22,12);
  if (move.includes('right_knee')) p.rightLeg = segs(-12,-10,8,-20,22,-12);
  if (move.includes('block_left') || move.includes('leftHighBlock')) p.leftArm = segs(7,14,18,25,22,6);
  if (move.includes('block_right') || move.includes('rightHighBlock')) p.rightArm = segs(7,-14,18,-25,22,-6);
  if (move.includes('block') && !move.includes('left') && !move.includes('right')) { p.leftArm = segs(7,14,18,22,25,6); p.rightArm = segs(7,-14,18,-22,25,-6); }
  if (move.includes('clinch') || move.includes('grapple')) { p.leftArm = segs(10,14,28,18,36,7); p.rightArm = segs(10,-14,28,-18,36,-7); }
  if (move.includes('sword') || move.includes('slash')) p.rightArm = segs(8,-13,30,-22,54,-18);
  if (move.includes('shuriken') || move.includes('arrow') || move.includes('debris')) p.rightArm = segs(8,-13,30,-13,52,-10);
  return p;
}

function basePose(w, running) { const stride = running ? w : w * 0.35; return { scaleY: 1, bodyRot: running ? stride * 0.08 : 0, flat: false, roll: false, leftArm: segs(8,15,0,28 - stride * 6,-12,31 - stride * 10), rightArm: segs(8,-15,0,-28 + stride * 6,-12,-31 + stride * 10), leftLeg: segs(-13,10,-27,17 + stride * 8,-40,23 + stride * 12), rightLeg: segs(-13,-10,-27,-17 - stride * 8,-40,-23 - stride * 12) }; }
function segs(sx,sy,ex,ey,hx,hy) { return { sx, sy, ex, ey, hx, hy }; }
function limb(ctx, s, fill, outline, width, hit) { ctx.strokeStyle = outline; ctx.lineWidth = width + 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(s.sx, s.sy); ctx.lineTo(s.ex, s.ey); ctx.lineTo(s.hx, s.hy); ctx.stroke(); ctx.strokeStyle = hit ? '#f3dc72' : fill; ctx.lineWidth = width; ctx.stroke(); joint(ctx, s.ex, s.ey, width * 0.56, hit ? '#f3dc72' : fill, outline); }
function pelvis(ctx, p) { oval(ctx, -13, 0, 15, 13, p.dark, p.outline, 3); }
function torso(ctx, p, pose) { oval(ctx, 2, 0, 23, 29 * (pose.scaleY || 1), p.shirt, p.outline, 4); oval(ctx, 5, 0, 28, 15, p.vest, p.outline, 3); }
function gear(ctx, p) { ctx.strokeStyle = p.gear; ctx.lineWidth = 4; line(ctx, -16, -14, 18, 14); line(ctx, -16, 14, 18, -14); ctx.fillStyle = p.gear; ctx.fillRect(-18, -7, 11, 14); ctx.fillRect(1, -21, 9, 7); ctx.fillRect(1, 14, 9, 7); }
function head(ctx, p, pose) { oval(ctx, 25, 0, 11, 12, p.skin, p.outline, 3); oval(ctx, 27, 0, 9, 10, p.hair, 'transparent', 0); ctx.fillStyle = p.face; ctx.fillRect(31, -4, 2, 3); ctx.fillRect(31, 3, 2, 3); }
function fistsAndFeet(ctx, pose, p) { fist(ctx, pose.leftArm.hx, pose.leftArm.hy, p); fist(ctx, pose.rightArm.hx, pose.rightArm.hy, p); foot(ctx, pose.leftLeg.hx, pose.leftLeg.hy, p); foot(ctx, pose.rightLeg.hx, pose.rightLeg.hy, p); }
function fist(ctx,x,y,p){ oval(ctx,x,y,5,5,p.glove,p.outline,2); }
function foot(ctx,x,y,p){ oval(ctx,x,y,7,5,p.boot,p.outline,2); }
function weapon(ctx, f, p) { ctx.save(); ctx.strokeStyle = p.weapon; ctx.lineWidth = 4; ctx.lineCap = 'round'; if (f.weapon === 'rifle' || f.archetypeId === 'marine') line(ctx, 15, -18, 52, -30); else if (f.weapon === 'bow' || f.archetypeId === 'archer') { ctx.strokeStyle = '#caa56c'; line(ctx, 6, 20, 43, 29); ctx.strokeStyle = '#dfe7f1'; line(ctx, 6, 22, 43, 31); } else if (f.melee === 'sword' || f.archetypeId === 'ninja') { ctx.strokeStyle = '#cfd9e6'; line(ctx, 12, -19, 48, -24); } ctx.restore(); }
function moveCue(ctx, m) { if (!m) return; ctx.strokeStyle = m.kind === 'sword' ? '#e8f1ff' : '#f0d36a'; ctx.lineWidth = m.kind === 'sword' ? 4 : 6; ctx.globalAlpha = 0.65; ctx.beginPath(); ctx.arc(24, 0, m.reach || 44, -0.5, 0.5); ctx.stroke(); ctx.globalAlpha = 1; }
function drawRoll(ctx, f, p, stage) { shadow(ctx, 23, 16); oval(ctx, 0, 0, 24, 18, p.vest, p.outline, 4); oval(ctx, 12, -6, 12, 10, p.shirt, p.outline, 3); oval(ctx, 18, 8, 9, 9, p.skin, p.outline, 3); labels(ctx, f, stage); ctx.restore(); }

function labels(ctx, f, stage) { ctx.fillStyle = stage.color; ctx.font = '800 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(stage.label, 0, -49); meter(ctx, -32, -42, 64, 5, f.hp, stage.color); if (f.bleed?.rate > 0) meter(ctx, -32, -34, 64, 4, f.bleed.pool || 0, '#b22d35'); if (f.spottedT > 0) { ctx.fillStyle = '#f7e36f'; ctx.font = '900 26px system-ui'; ctx.fillText('!', 0, -66); } }
function fighterPalette(f, stage, final) { const skin = final ? '#9b9b9b' : '#c78f68'; return { outline:'#071018', skin, face:'#f5d3b4', hair:'#15151b', shirt:mix(f.accent || '#334', final?'#8c8f96':'#9098a3', final?0.75:1-(stage.saturation??1)), pants:mix(f.color || '#456', final?'#888':'#89919c', final?0.75:1-(stage.saturation??1)), vest:'#232a27', dark:'#161b22', gear:'#766b4c', glove:'#11151b', boot:'#0e1217', weapon:'#20242b' }; }
function oval(ctx,x,y,rx,ry,fill,stroke,w=2){ ctx.fillStyle=fill; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,TAU); ctx.fill(); if(stroke && stroke!=='transparent' && w>0){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke();} }
function joint(ctx,x,y,r,fill,stroke){ oval(ctx,x,y,r,r,fill,stroke,2); }
function shadow(ctx, rx, ry) { ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(-3, 18, rx, ry, 0, 0, TAU); ctx.fill(); }
function drawEffects(ctx, state, over) { for (const e of state.effects) { const fg = ['tracer','alert','command','bandage'].includes(e.type); if (fg !== over) continue; ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, e.ttl * 6)); if (e.type === 'tracer') { ctx.strokeStyle = '#dff6ff'; ctx.lineWidth = 5; ctx.shadowColor = '#80d7ff'; ctx.shadowBlur = 14; line(ctx, e.x, e.y, e.x2, e.y2); ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; line(ctx, e.x, e.y, e.x2, e.y2); dot(ctx, e.x, e.y, 8, '#f7d66a'); dot(ctx, e.x2, e.y2, 6, '#eaf8ff'); } else if (e.type === 'explosion') dot(ctx, e.x, e.y, (e.radius || 80) * (1 - e.ttl / 0.7), '#f3b24d55'); else if (e.type === 'smoke') dot(ctx, e.x, e.y, 55 * (1 - e.ttl / 0.9), '#cfd8e655'); else if (e.type === 'alert') { ctx.fillStyle = '#f7e36f'; ctx.font = '900 28px system-ui'; ctx.textAlign = 'center'; ctx.fillText('!', e.x, e.y); } else if (e.type === 'command') { ctx.strokeStyle = '#f0d36a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, 18, 0, TAU); ctx.stroke(); } else dot(ctx, e.x, e.y, 15, e.type === 'block' ? '#f4db73' : e.type === 'dodge' || e.type === 'dive' ? '#7bd0ff' : '#f15d56'); ctx.restore(); } }
function drawSideHud(ctx, state) { ctx.fillStyle = '#0c121bcc'; ctx.fillRect(980, 0, 300, 720); ctx.fillStyle = '#edf4ff'; ctx.font = '900 26px system-ui'; ctx.fillText('TOP SHOT', 1000, 38); ctx.fillStyle = '#aebbd0'; ctx.font = '700 13px system-ui'; ctx.fillText('AI fighters. Coach commands only.', 1000, 60); state.fighters.forEach((f,i)=>card(ctx,f,1000,92+i*170)); ctx.fillStyle = '#d6e2f2'; ctx.font = '800 13px system-ui'; ctx.fillText(`State: ${state.matchState}`,1000,455); ctx.fillText(`Trust: ${Math.round(state.trust)}`,1000,476); ctx.fillText(`Clock: ${state.clock.toFixed(1)}s`,1000,497); let y=525; ctx.fillStyle='#9fb0c6'; ctx.font='700 12px system-ui'; for(const l of state.log.slice(0,8)){ctx.fillText(l,1000,y); y+=22;} }
function card(ctx,f,x,y){ const s=stageFor(f); ctx.fillStyle='#121b28'; ctx.fillRect(x,y,250,148); ctx.strokeStyle=f.color; ctx.strokeRect(x,y,250,148); ctx.fillStyle='#eff5ff'; ctx.font='900 16px system-ui'; ctx.fillText(f.name,x+12,y+25); ctx.fillStyle=s.color; ctx.font='800 12px system-ui'; ctx.fillText(s.label,x+185,y+25); labelMeter(ctx,'VIT',f.hp,x+12,y+45,s.color); labelMeter(ctx,'BLEED',f.bleed?.pool||0,x+12,y+70,'#b22d35'); labelMeter(ctx,'DODGE',f.dodge,x+12,y+95,'#b894ff'); labelMeter(ctx,'BLOCK',f.block,x+12,y+120,'#f0d36a'); }
function drawResult(ctx,state){ if(state.matchState!=='finished')return; ctx.save(); ctx.fillStyle='#05080dcc'; ctx.fillRect(120,250,720,150); ctx.strokeStyle='#f0d36a'; ctx.lineWidth=3; ctx.strokeRect(120,250,720,150); ctx.textAlign='center'; ctx.fillStyle='#f5f0d0'; ctx.font='900 34px system-ui'; ctx.fillText('MATCH COMPLETE',480,305); ctx.fillStyle='#edf4ff'; ctx.font='800 20px system-ui'; ctx.fillText(state.result||'Match finished.',480,340); ctx.restore(); }
function labelMeter(ctx,label,value,x,y,color){ ctx.fillStyle='#aebbd0'; ctx.font='800 10px system-ui'; ctx.fillText(label,x,y+8); meter(ctx,x+48,y,170,8,value,color); }
function meter(ctx,x,y,w,h,value,color){ ctx.fillStyle='#091018'; ctx.fillRect(x,y,w,h); ctx.fillStyle=color; ctx.fillRect(x,y,w*Math.max(0,Math.min(100,value))/100,h); }
function box(ctx,r,fill,stroke){ ctx.fillStyle=fill; ctx.fillRect(r.x,r.y,r.w,r.h); ctx.strokeStyle=stroke; ctx.lineWidth=2; ctx.strokeRect(r.x,r.y,r.w,r.h); }
function line(ctx,x1,y1,x2,y2){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
function dot(ctx,x,y,r,color){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,TAU); ctx.fill(); }
function mix(a,b,t){ const ca=parse(a), cb=parse(b); return `rgb(${Math.round(ca.r+(cb.r-ca.r)*t)}, ${Math.round(ca.g+(cb.g-ca.g)*t)}, ${Math.round(ca.b+(cb.b-ca.b)*t)})`; }
function parse(hex){ const v=Number.parseInt(String(hex).replace('#','').slice(0,6),16) || 0; return {r:v>>16&255,g:v>>8&255,b:v&255}; }
