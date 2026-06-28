import { ARENA_H, ARENA_W, TAU } from './config.js';
import { stageFor } from './state.js';

const POSE_STRIP = ['idle_guard','run','left_jab','right_cross','left_elbow','right_elbow','left_knee','right_knee','left_kick','right_kick','block_leftArm','block_rightArm','grapple','roll','down'];

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  background(ctx);
  arena(ctx, state);
  pickups(ctx, state);
  projectiles(ctx, state);
  effects(ctx, state, false);
  for (const f of state.fighters) fighter(ctx, f, false);
  effects(ctx, state, true);
  hud(ctx, state);
  result(ctx, state);
}

function background(ctx) {
  const g = ctx.createLinearGradient(0, 0, 1280, 720);
  g.addColorStop(0, '#07111c'); g.addColorStop(1, '#04070c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
}

function arena(ctx, state) {
  ctx.fillStyle = '#151d28'; ctx.fillRect(0, 0, ARENA_W, ARENA_H);
  ctx.fillStyle = '#202b39'; ctx.fillRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  ctx.strokeStyle = '#314154'; ctx.lineWidth = 1;
  for (let x = 52; x <= ARENA_W - 52; x += 64) line(ctx, x, 52, x, ARENA_H - 52);
  for (let y = 52; y <= ARENA_H - 52; y += 64) line(ctx, 52, y, ARENA_W - 52, y);
  ctx.strokeStyle = '#97a8bd'; ctx.lineWidth = 4; ctx.strokeRect(52, 52, ARENA_W - 104, ARENA_H - 104);
  for (const s of state.arena.shadows || []) { ctx.fillStyle = '#02050bbb'; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.strokeStyle = '#162339'; ctx.lineWidth = 2; ctx.strokeRect(s.x, s.y, s.w, s.h); }
  for (const w of state.arena.walls) coverBox(ctx, w, w.cover ? '#40536c' : '#2b3a4e', '#95a7bd');
  for (const b of state.arena.breakables) if (!b.broken) coverBox(ctx, b, '#697e94aa', '#d0e6f5');
  ctx.fillStyle = '#d9e8f41f'; ctx.font = '900 22px system-ui'; ctx.fillText(state.arena.name?.toUpperCase() || 'ARENA', 375, 86);
}

function coverBox(ctx, r, fill, stroke) {
  ctx.fillStyle = '#06090e88'; ctx.fillRect(r.x + 5, r.y + 7, r.w, r.h);
  ctx.fillStyle = fill; ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = '#ffffff18'; ctx.lineWidth = 1; line(ctx, r.x + 6, r.y + 6, r.x + r.w - 6, r.y + 6);
}

function pickups(ctx, state) { for (const p of state.pickups.filter(p => !p.used)) { ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = '#02050b'; ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fill(); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#071018'; ctx.font = '900 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(p.type[0].toUpperCase(), 0, 4); ctx.restore(); } }
function projectiles(ctx, state) { for (const p of state.projectiles) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1)); if (p.type === 'grenade') { dot(ctx, 0, 0, 8, '#5d6876'); ctx.strokeStyle = '#f3d66f'; ctx.lineWidth = 2; ctx.stroke(); } else if (p.type === 'shuriken') { ctx.strokeStyle = '#ecf4ff'; ctx.lineWidth = 3; line(ctx, -10, 0, 10, 0); line(ctx, 0, -10, 0, 10); } else { ctx.fillStyle = p.type === 'arrow' ? '#e8f2fd' : '#caa76f'; ctx.fillRect(-12, -2, 24, 4); ctx.fillRect(5, -5, 9, 10); } ctx.restore(); } }

function fighter(ctx, f, preview) {
  const stage = stageFor(f);
  const final = f.incapacitated || f.defeated || f.extracted;
  const pal = palette(f, stage, final, preview);
  const poseName = preview ? f.pose : f.currentMove?.id || f.pose || 'idle_guard';
  const pose = makePose(poseName, f.anim || 0, f);
  ctx.save(); ctx.translate(f.x, f.y); ctx.rotate((f.facing || 0) + pose.turn); ctx.globalAlpha = f.extracted ? 0.18 : f.shadowHidden ? 0.46 : 1;
  if (pose.flat) ctx.rotate(Math.PI / 2);
  if (f.defeated) ctx.rotate(0.28);
  shadow(ctx, pose.flat ? 34 : 26, pose.flat ? 13 : 11);
  drawRig(ctx, pose, pal, f);
  if (!preview) combatCue(ctx, f.currentMove, pal);
  ctx.rotate(-(f.facing || 0) - pose.turn); ctx.globalAlpha = 1;
  if (!preview) labels(ctx, f, stage);
  ctx.restore();
}

function drawRig(ctx, pose, pal, f) {
  limb(ctx, pose.leftLeg, pal.pants, pal.outline, 9, f.limbs?.leftLeg?.t > 0); limb(ctx, pose.rightLeg, pal.pants, pal.outline, 9, f.limbs?.rightLeg?.t > 0);
  pelvis(ctx, pal); torso(ctx, pose, pal); straps(ctx, pal); neck(ctx, pal); head(ctx, pose, pal);
  limb(ctx, pose.leftArm, pal.sleeve, pal.outline, 7, f.limbs?.leftArm?.t > 0); limb(ctx, pose.rightArm, pal.sleeve, pal.outline, 7, f.limbs?.rightArm?.t > 0);
  glove(ctx, pose.leftArm.hx, pose.leftArm.hy, pal); glove(ctx, pose.rightArm.hx, pose.rightArm.hy, pal); boot(ctx, pose.leftLeg.hx, pose.leftLeg.hy, pal); boot(ctx, pose.rightLeg.hx, pose.rightLeg.hy, pal); weapon(ctx, f, pose, pal);
}

function makePose(name, anim, f = {}) {
  const walk = Math.sin(anim) || 0;
  const running = ['walk','run','rush','limp_run','stagger_limp','crouchWalk'].includes(name || f.pose);
  const p = basePose(running ? walk : walk * 0.2);
  p.turn = running ? walk * 0.055 : 0; p.flat = false;
  if (['down','prone','crawl'].includes(name) || f.prone || f.incapacitated) return flatPose(p);
  if (['roll','combat_roll','dive_roll','somersault_dive','flat_dive'].includes(name)) return rollPose(p);
  if (f.crouch || name === 'duck' || name === 'crouchWalk') crouchPose(p);
  if (name === 'left_jab' || name === 'leftJab') p.leftArm = seg(9, 16, 31, 13, 58, 9);
  if (name === 'right_cross' || name === 'rightCross') { p.rightArm = seg(9, -16, 33, -11, 61, -6); p.turn = -0.12; }
  if (name === 'left_elbow') { p.leftArm = seg(9, 16, 31, 21, 24, 5); p.turn = 0.08; }
  if (name === 'right_elbow') { p.rightArm = seg(9, -16, 31, -21, 24, -5); p.turn = -0.08; }
  if (name === 'left_knee') { p.leftLeg = seg(-13, 10, 7, 22, 25, 12); p.turn = 0.06; }
  if (name === 'right_knee') { p.rightLeg = seg(-13, -10, 7, -22, 25, -12); p.turn = -0.06; }
  if (name === 'left_kick') { p.leftLeg = seg(-13, 10, 15, 22, 57, 28); p.turn = 0.1; }
  if (name === 'right_kick' || name === 'roundhouse') { p.rightLeg = seg(-13, -10, 15, -22, 57, -28); p.turn = -0.1; }
  if (name === 'block_leftArm' || name === 'block_leftLeg') p.leftArm = seg(8, 16, 23, 25, 28, 4);
  if (name === 'block_rightArm' || name === 'block_rightLeg') p.rightArm = seg(8, -16, 23, -25, 28, -4);
  if (name === 'dodge' || name === 'slipLeft') { p.turn = 0.24; p.leftArm = seg(5, 16, 18, 22, 29, 15); }
  if (name === 'grapple' || name === 'clinch') { p.leftArm = seg(10, 16, 31, 18, 42, 7); p.rightArm = seg(10, -16, 31, -18, 42, -7); }
  if (name === 'short_slash' || name === 'wide_slash' || name === 'reverse_slash' || name === 'thrust_slash') p.rightArm = seg(8, -15, 34, -27, 60, -20);
  return p;
}

function basePose(s) { return { flat:false, turn:0, leftArm:seg(8,17,0,30 - s*7,-12,34 - s*11), rightArm:seg(8,-17,0,-30 + s*7,-12,-34 + s*11), leftLeg:seg(-15,10,-31,17 + s*9,-45,24 + s*13), rightLeg:seg(-15,-10,-31,-17 - s*9,-45,-24 - s*13) }; }
function crouchPose(p) { p.leftLeg = seg(-14,10,-27,25,-36,38); p.rightLeg = seg(-14,-10,-27,-25,-36,-38); p.leftArm = seg(7,16,18,24,28,19); p.rightArm = seg(7,-16,18,-24,28,-19); }
function flatPose(p) { p.flat = true; p.leftArm = seg(8,15,31,21,51,24); p.rightArm = seg(8,-15,31,-21,51,-24); p.leftLeg = seg(-16,11,-39,16,-60,18); p.rightLeg = seg(-16,-11,-39,-16,-60,-18); return p; }
function rollPose(p) { p.flat = true; p.leftArm = seg(4,12,15,20,27,13); p.rightArm = seg(4,-12,15,-20,27,-13); p.leftLeg = seg(-10,8,-23,15,-33,7); p.rightLeg = seg(-10,-8,-23,-15,-33,-7); return p; }
function seg(sx,sy,ex,ey,hx,hy){ return {sx,sy,ex,ey,hx,hy}; }

function limb(ctx, s, fill, outline, w, hit) { ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle=outline; ctx.lineWidth=w+5; ctx.beginPath(); ctx.moveTo(s.sx,s.sy); ctx.lineTo(s.ex,s.ey); ctx.lineTo(s.hx,s.hy); ctx.stroke(); ctx.strokeStyle=hit ? '#ffe47c' : fill; ctx.lineWidth=w; ctx.stroke(); joint(ctx, s.ex, s.ey, w * 0.58, hit ? '#ffe47c' : fill, outline); }
function torso(ctx, pose, p) { ctx.fillStyle=p.outline; poly(ctx, [[-18,-14],[2,-25],[24,-18],[31,0],[24,18],[2,25],[-18,14]]); ctx.fillStyle=p.vest; poly(ctx, [[-14,-11],[2,-21],[22,-15],[27,0],[22,15],[2,21],[-14,11]]); ctx.fillStyle=p.shirt; poly(ctx, [[-12,-8],[5,-16],[19,-10],[23,0],[19,10],[5,16],[-12,8]]); }
function pelvis(ctx, p) { oval(ctx, -17,0,16,12,p.pants,p.outline,3); }
function neck(ctx,p){ oval(ctx,21,0,7,8,p.skin,p.outline,2); }
function head(ctx, pose, p) { oval(ctx,31,0,12,13,p.skin,p.outline,3); ctx.fillStyle=p.hair; ctx.beginPath(); ctx.ellipse(32,-1,9,10,0,-1.2,1.2); ctx.fill(); ctx.fillStyle=p.face; ctx.fillRect(36,-5,2,3); ctx.fillRect(36,3,2,3); }
function straps(ctx,p){ ctx.strokeStyle=p.gear; ctx.lineWidth=4; line(ctx,-14,-14,20,15); line(ctx,-14,14,20,-15); ctx.fillStyle=p.gear; ctx.fillRect(-19,-7,10,14); ctx.fillRect(1,-23,9,7); ctx.fillRect(1,16,9,7); }
function glove(ctx,x,y,p){ oval(ctx,x,y,5,5,p.glove,p.outline,2); }
function boot(ctx,x,y,p){ oval(ctx,x,y,8,5,p.boot,p.outline,2); }
function weapon(ctx,f,pose,p){ ctx.save(); ctx.strokeStyle=p.weapon; ctx.lineWidth=4; ctx.lineCap='round'; if(f.weapon==='rifle'||f.archetypeId==='marine') line(ctx,16,-20,55,-30); else if(f.weapon==='bow'||f.archetypeId==='archer'){ctx.strokeStyle='#c79f66'; line(ctx,6,22,43,31); ctx.strokeStyle='#e6eef8'; line(ctx,5,24,45,33);} else if(f.melee==='sword'||f.archetypeId==='ninja'){ctx.strokeStyle='#dce8f5'; line(ctx,14,-20,52,-25);} ctx.restore(); }
function combatCue(ctx,m,p){ if(!m) return; ctx.strokeStyle=m.kind==='sword'?'#eef7ff':'#f1d36b'; ctx.lineWidth=m.kind==='sword'?4:6; ctx.globalAlpha=.58; ctx.beginPath(); ctx.arc(24,0,m.reach||44,-.5,.5); ctx.stroke(); ctx.globalAlpha=1; }
function labels(ctx,f,stage){ ctx.textAlign='center'; ctx.font='800 12px system-ui'; ctx.fillStyle=stage.color; ctx.fillText(stage.label,0,-50); meter(ctx,-32,-43,64,5,f.hp,stage.color); if(f.intent){ctx.fillStyle='#b9c7db'; ctx.font='700 10px system-ui'; ctx.fillText(String(f.intent).replace('coach_',''),0,-59);} if(f.bleed?.rate>0) meter(ctx,-32,-35,64,4,f.bleed.pool||0,'#b22d35'); if(f.spottedT>0){ctx.fillStyle='#ffe66d'; ctx.font='900 26px system-ui'; ctx.fillText('!',0,-73);} }
function palette(f,stage,final,preview){ const fade=final?.78:Math.max(0,1-(stage.saturation??1)); return {outline:'#070b10', skin: final?'#9a9a9a':'#b87f5b', face:'#f1caaa', hair:'#15171d', shirt:mix(f.accent||'#3b5a7d','#8f98a5',fade), pants:mix(f.color||'#546a82','#89919b',fade), vest:'#1d252f', gear:'#796d4a', glove:'#11161d', boot:'#0d1117', sleeve:mix(f.color||'#546a82','#89919b',fade*.8), weapon:'#1b2028'}; }

function effects(ctx,state,over){ for(const e of state.effects){ const top=['tracer','alert','command','bandage'].includes(e.type); if(top!==over) continue; ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,e.ttl*6)); if(e.type==='tracer'){ctx.strokeStyle='#dff7ff';ctx.lineWidth=6;ctx.shadowColor='#75d7ff';ctx.shadowBlur=16;line(ctx,e.x,e.y,e.x2,e.y2);ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=2;line(ctx,e.x,e.y,e.x2,e.y2);dot(ctx,e.x,e.y,9,'#f7d96a');dot(ctx,e.x2,e.y2,7,'#eaf8ff');} else if(e.type==='explosion') dot(ctx,e.x,e.y,(e.radius||80)*(1-e.ttl/.7),'#f3b24d55'); else if(e.type==='smoke') dot(ctx,e.x,e.y,55*(1-e.ttl/.9),'#cfd8e655'); else if(e.type==='alert'){ctx.fillStyle='#ffe66d';ctx.font='900 28px system-ui';ctx.textAlign='center';ctx.fillText('!',e.x,e.y);} else if(e.type==='command'){ctx.strokeStyle='#f0d36a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,18,0,TAU);ctx.stroke();} else dot(ctx,e.x,e.y,15,e.type==='block'?'#f4db73':e.type==='dodge'||e.type==='dive'?'#7bd0ff':'#f15d56'); ctx.restore(); } }
function hud(ctx,state){ ctx.fillStyle='#0b111bcc'; ctx.fillRect(980,0,300,720); ctx.fillStyle='#eef6ff'; ctx.font='900 26px system-ui'; ctx.fillText('TOP SHOT',1000,38); ctx.fillStyle='#aebbd0'; ctx.font='700 13px system-ui'; ctx.fillText('AI fighters. Coach commands only.',1000,60); state.fighters.forEach((f,i)=>card(ctx,f,1000,92+i*162)); poseStrip(ctx,1002,418); ctx.fillStyle='#d6e2f2'; ctx.font='800 13px system-ui'; ctx.fillText(`State: ${state.matchState}`,1000,598); ctx.fillText(`Trust: ${Math.round(state.trust)}`,1000,619); ctx.fillText(`Clock: ${state.clock.toFixed(1)}s`,1000,640); let y=664; ctx.fillStyle='#9fb0c6'; ctx.font='700 11px system-ui'; for(const l of state.log.slice(0,2)){ctx.fillText(l,1000,y);y+=18;} }
function card(ctx,f,x,y){ const s=stageFor(f); ctx.fillStyle='#121b28'; ctx.fillRect(x,y,250,140); ctx.strokeStyle=f.color; ctx.strokeRect(x,y,250,140); ctx.fillStyle='#eff5ff'; ctx.font='900 15px system-ui'; ctx.fillText(f.name,x+12,y+23); ctx.fillStyle=s.color; ctx.font='800 12px system-ui'; ctx.fillText(s.label,x+185,y+23); labelMeter(ctx,'VIT',f.hp,x+12,y+42,s.color); labelMeter(ctx,'STA',f.stamina,x+12,y+65,'#7ad99a'); labelMeter(ctx,'DODGE',f.dodge,x+12,y+88,'#b894ff'); labelMeter(ctx,'BLOCK',f.block,x+12,y+111,'#f0d36a'); ctx.fillStyle='#aebbd0'; ctx.font='700 10px system-ui'; ctx.fillText(`${f.intent||'thinking'} / ${f.pose}`,x+12,y+133); }
function poseStrip(ctx,x,y){ ctx.fillStyle='#111a27'; ctx.fillRect(x,y,256,158); ctx.strokeStyle='#26384d'; ctx.strokeRect(x,y,256,158); ctx.fillStyle='#d7e2f2'; ctx.font='900 11px system-ui'; ctx.fillText('POSE RIG PREVIEW',x+10,y+18); const palF={color:'#506f92',accent:'#9b7c4a',limbs:{leftLeg:{},rightLeg:{},leftArm:{},rightArm:{}},pose:'idle',facing:0,anim:0,hp:100,stamina:100,dodge:100,block:100}; POSE_STRIP.slice(0,10).forEach((pose,i)=>{ctx.save();ctx.translate(x+24+(i%5)*46,y+48+Math.floor(i/5)*48);ctx.scale(.55,.55); fighter(ctx,{...palF,pose,currentMove:{id:pose,kind:'punch',reach:38},archetypeId:i%2?'martial_artist':'marine'},true);ctx.restore();}); }
function result(ctx,state){ if(state.matchState!=='finished') return; ctx.save(); ctx.fillStyle='#05080dcc';ctx.fillRect(120,250,720,150);ctx.strokeStyle='#f0d36a';ctx.lineWidth=3;ctx.strokeRect(120,250,720,150);ctx.textAlign='center';ctx.fillStyle='#f5f0d0';ctx.font='900 34px system-ui';ctx.fillText('MATCH COMPLETE',480,305);ctx.fillStyle='#edf4ff';ctx.font='800 20px system-ui';ctx.fillText(state.result||'Match finished.',480,340);ctx.restore(); }
function labelMeter(ctx,label,value,x,y,color){ ctx.fillStyle='#aebbd0';ctx.font='800 10px system-ui';ctx.fillText(label,x,y+8); meter(ctx,x+48,y,170,8,value,color); }
function meter(ctx,x,y,w,h,value,color){ctx.fillStyle='#091018';ctx.fillRect(x,y,w,h);ctx.fillStyle=color;ctx.fillRect(x,y,w*Math.max(0,Math.min(100,value))/100,h);}function poly(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill();}function oval(ctx,x,y,rx,ry,fill,stroke,w=2){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();if(stroke&&w>0){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke();}}function joint(ctx,x,y,r,fill,stroke){oval(ctx,x,y,r,r,fill,stroke,2);}function shadow(ctx,rx,ry){ctx.fillStyle='#0009';ctx.beginPath();ctx.ellipse(-4,18,rx,ry,0,0,TAU);ctx.fill();}function line(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}function dot(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}function mix(a,b,t){const ca=parse(a),cb=parse(b);return`rgb(${Math.round(ca.r+(cb.r-ca.r)*t)}, ${Math.round(ca.g+(cb.g-ca.g)*t)}, ${Math.round(ca.b+(cb.b-ca.b)*t)})`;}function parse(hex){const v=Number.parseInt(String(hex).replace('#','').slice(0,6),16)||0;return{r:v>>16&255,g:v>>8&255,b:v&255};}
