import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { destinationFor } from './travelLocations.js';

export function drawOffsiteScene(ctx, state) {
  const job = state.offsite;
  if (!job) return false;
  const scene = job.scene || job.destinationScene || job.actionId;
  const label = job.label || destinationFor(job.actionId)?.label || job.actionId.replaceAll('_', ' ');
  ctx.save();
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  if (scene === 'plane') drawPlane(ctx, job, label);
  else if (scene === 'theater') drawTheater(ctx, job);
  else if (scene === 'beach_resort') drawBeachResort(ctx, job);
  else if (scene === 'private_island') drawPrivateIsland(ctx, job);
  else if (scene === 'alps') drawAlps(ctx, job);
  else if (scene === 'camping') drawCamping(ctx, job);
  else if (scene === 'tokyo') drawTokyo(ctx, job);
  else if (scene === 'paris') drawParis(ctx, job);
  else if (scene === 'safari') drawSafari(ctx, job);
  else if (scene === 'vegas') drawVegas(ctx, job);
  else if (scene === 'cruise') drawCruise(ctx, job);
  else if (scene === 'desert_spa') drawDesertSpa(ctx, job);
  else if (scene === 'mall' || scene === 'date') drawCity(ctx, job, scene);
  else drawGeneric(ctx, job, label);
  drawProgress(ctx, job, label);
  ctx.restore();
  return true;
}

function drawProgress(ctx, job, label) {
  ctx.fillStyle = 'rgba(8,10,15,.78)';
  ctx.fillRect(210, 34, 540, 66);
  ctx.strokeStyle = 'rgba(241,198,106,.75)';
  ctx.strokeRect(210, 34, 540, 66);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 24px system-ui';
  ctx.textAlign = 'center';
  const stage = job.stage === 'plane' ? 'Outbound Flight' : job.stage === 'return_plane' ? 'Return Flight' : label;
  ctx.fillText(stage, PLAY_W / 2, 66);
  ctx.fillStyle = 'rgba(255,255,255,.15)';
  ctx.fillRect(260, 78, 440, 10);
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(260, 78, 440 * Math.max(0.02, Math.min(1, job.progress || 0)), 10);
  ctx.textAlign = 'left';
}

function drawParty(ctx, job, x, y) {
  const ids = job.actors || [];
  ids.forEach((id, i) => {
    ctx.fillStyle = id === 'girlfriend' ? '#f2a3d7' : id === 'dog' ? '#d7a66a' : '#79b7ff';
    ctx.beginPath();
    ctx.arc(x + i * 34, y, id === 'dog' ? 11 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10141b';
    ctx.font = '900 8px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(id.slice(0, 3).toUpperCase(), x + i * 34, y + 3);
    ctx.textAlign = 'left';
  });
}

function rr(ctx, x, y, w, h, r = 8, fill = '#394761') { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); ctx.fillStyle = fill; ctx.fill(); }
function marker(ctx, text, x, y) { rr(ctx, x, y, 132, 34, 10, 'rgba(8,10,15,.7)'); ctx.fillStyle = '#f8fbff'; ctx.font = '900 12px system-ui'; ctx.fillText(text, x + 10, y + 22); }
function waterWaves(ctx, y1, y2) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; for (let y = y1; y < y2; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(220, y - 28, 440, y); ctx.quadraticCurveTo(660, y + 28, 960, y); ctx.stroke(); } }

function drawPlane(ctx, job) {
  ctx.fillStyle = '#1d2636';
  ctx.fillRect(150, 128, 660, 500);
  rr(ctx, 202, 164, 556, 420, 28, '#2d384d');
  ctx.fillStyle = '#90d8ff';
  for (let y = 184; y < 560; y += 54) { ctx.fillRect(172, y, 28, 18); ctx.fillRect(760, y, 28, 18); }
  ctx.fillStyle = '#20283a';
  ctx.fillRect(458, 174, 44, 382);
  for (let row = 0; row < 6; row++) for (let col = 0; col < 4; col++) roundSeat(ctx, 270 + col * 115, 190 + row * 58);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 16px system-ui';
  ctx.fillText('ATTENDANT', 410, 154);
  ctx.fillStyle = '#f8fbff';
  ctx.fillRect(455 + Math.sin((job.progress || 0) * Math.PI * 4) * 120, 160 + (job.progress || 0) * 360, 50, 18);
  ctx.fillStyle = '#74e6ff';
  ctx.font = '800 13px system-ui';
  ctx.fillText(`Destination: ${job.label}`, 330, 610);
  drawParty(ctx, job, 332, 492);
}
function roundSeat(ctx, x, y) { rr(ctx, x, y, 42, 34, 8, '#394761'); ctx.fillStyle = '#121722'; ctx.fillRect(x + 8, y + 8, 26, 7); }
function drawTheater(ctx, job) { ctx.fillStyle = '#170d1e'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#d8e8ff'; ctx.fillRect(190, 130, 580, 120); ctx.fillStyle = '#10141b'; ctx.font = '900 22px system-ui'; ctx.textAlign = 'center'; ctx.fillText('NEON TENANTS', PLAY_W / 2, 198); ctx.textAlign = 'left'; ctx.fillStyle = '#3a1528'; for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) rr(ctx, 170 + c * 70, 330 + r * 44, 44, 28, 7, '#3a1528'); drawParty(ctx, job, 362, 420); }
function drawBeachResort(ctx, job) { ctx.fillStyle = '#1f9ed4'; ctx.fillRect(0, 0, PLAY_W, 315); ctx.fillStyle = '#e8ca83'; ctx.fillRect(0, 315, PLAY_W, 405); waterWaves(ctx, 252, 350); marker(ctx, 'SURF AREA', 92, 352); marker(ctx, 'RELAX CABANAS', 390, 456); marker(ctx, 'TREASURE SEARCH', 650, 604); drawParty(ctx, job, 420, 520); }
function drawPrivateIsland(ctx, job) { ctx.fillStyle = '#0f91c6'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#f0d68f'; ctx.beginPath(); ctx.ellipse(480, 384, 330, 210, 0, 0, Math.PI * 2); ctx.fill(); waterWaves(ctx, 110, 650); marker(ctx, 'SNORKEL WATER', 140, 208); marker(ctx, 'PRIVATE RELAX', 390, 360); marker(ctx, 'TREASURE COVE', 610, 506); drawParty(ctx, job, 420, 430); }
function drawAlps(ctx, job) { ctx.fillStyle = '#dae8f4'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#7d8fa5'; mountain(ctx, 80, 560, 260); mountain(ctx, 330, 560, 320); mountain(ctx, 620, 560, 250); ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(504, 214); ctx.bezierCurveTo(420, 310, 584, 376, 480, 536); ctx.stroke(); marker(ctx, 'SKI PATH', 520, 300); marker(ctx, 'LODGE COCOA', 190, 572); drawParty(ctx, job, 420, 520); }
function mountain(ctx, x, y, h) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 130, y - h); ctx.lineTo(x + 260, y); ctx.closePath(); ctx.fill(); }
function drawCamping(ctx, job) { ctx.fillStyle = '#173322'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#315b38'; for (let i = 0; i < 22; i++) ctx.fillRect((i * 73) % 920, 120 + (i * 91) % 490, 38, 86); ctx.fillStyle = '#aa6b42'; ctx.beginPath(); ctx.moveTo(300, 440); ctx.lineTo(380, 330); ctx.lineTo(460, 440); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#f1c66a'; ctx.beginPath(); ctx.arc(560, 430, 26, 0, Math.PI * 2); ctx.fill(); marker(ctx, 'TENT', 260, 456); marker(ctx, 'CAMPFIRE', 514, 464); marker(ctx, 'STARGAZE', 650, 160); drawParty(ctx, job, 420, 510); }
function drawTokyo(ctx, job) { ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#28344a' : '#20293b'; ctx.fillRect(80 + i * 92, 150, 58, 360); ctx.fillStyle = i % 3 ? '#f1c66a' : '#ff75df'; ctx.fillRect(90 + i * 92, 190, 38, 16); ctx.fillRect(94 + i * 92, 260, 10, 10); ctx.fillRect(116 + i * 92, 302, 10, 10); } marker(ctx, 'ARCADE', 150, 558); marker(ctx, 'RAMEN BAR', 398, 558); marker(ctx, 'NEON WALK', 640, 558); drawParty(ctx, job, 420, 540); }
function drawParis(ctx, job) { ctx.fillStyle = '#202838'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#b8976c'; ctx.fillRect(120, 360, 220, 130); ctx.fillStyle = '#d8e8ff'; ctx.fillRect(560, 210, 220, 190); ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(440, 560); ctx.lineTo(480, 240); ctx.lineTo(520, 560); ctx.moveTo(420, 420); ctx.lineTo(540, 420); ctx.stroke(); marker(ctx, 'CAFE', 150, 506); marker(ctx, 'MUSEUM', 604, 416); marker(ctx, 'LANDMARK WALK', 390, 604); drawParty(ctx, job, 420, 520); }
function drawSafari(ctx, job) { ctx.fillStyle = '#d6a94e'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.strokeStyle = '#6b542a'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(90, 560); ctx.bezierCurveTo(300, 420, 330, 280, 600, 240); ctx.bezierCurveTo(780, 220, 810, 410, 890, 510); ctx.stroke(); rr(ctx, 170, 408, 110, 54, 12, '#3d3526'); marker(ctx, 'SAFARI TRAIL', 360, 314); marker(ctx, 'ANIMAL LOOKOUT', 646, 210); marker(ctx, 'PHOTO STOP', 160, 474); drawParty(ctx, job, 420, 500); }
function drawVegas(ctx, job) { ctx.fillStyle = '#100d20'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); for (let i = 0; i < 10; i++) { rr(ctx, 54 + i * 86, 180 + (i % 2) * 42, 58, 290, 8, i % 2 ? '#30184b' : '#26315f'); ctx.fillStyle = i % 3 ? '#f1c66a' : '#ff75df'; ctx.fillRect(66 + i * 86, 210, 34, 14); } marker(ctx, 'SHOW AREA', 190, 540); marker(ctx, 'BUFFET', 420, 540); marker(ctx, 'NIGHTLIFE', 640, 540); drawParty(ctx, job, 420, 500); }
function drawCruise(ctx, job) { ctx.fillStyle = '#0e5278'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); rr(ctx, 220, 200, 520, 270, 42, '#f8fbff'); ctx.fillStyle = '#74e6ff'; ctx.fillRect(300, 250, 360, 42); ctx.fillStyle = '#2d384d'; ctx.fillRect(330, 350, 300, 54); marker(ctx, 'DECK WALK', 246, 490); marker(ctx, 'BUFFET', 430, 490); marker(ctx, 'SHOW', 604, 490); drawParty(ctx, job, 420, 500); }
function drawDesertSpa(ctx, job) { ctx.fillStyle = '#2d2430'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#ca8c48'; ctx.fillRect(0, 250, PLAY_W, 470); ctx.strokeStyle = '#e4b66b'; ctx.lineWidth = 4; for (let y = 280; y < 620; y += 58) { ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(240, y - 45, 480, y); ctx.quadraticCurveTo(720, y + 45, 960, y); ctx.stroke(); } marker(ctx, 'SPA POOLS', 310, 420); marker(ctx, 'DUNES', 120, 520); marker(ctx, 'NIGHT SKY', 650, 160); drawParty(ctx, job, 420, 500); }
function drawCity(ctx, job, scene) { ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#28344a' : '#20293b'; ctx.fillRect(80 + i * 92, 170, 58, 330); ctx.fillStyle = '#f1c66a'; ctx.fillRect(94 + i * 92, 205, 10, 10); ctx.fillRect(116 + i * 92, 250, 10, 10); } marker(ctx, scene === 'mall' ? 'SHOPS' : 'DINNER', 290, 540); marker(ctx, scene === 'mall' ? 'FOOD COURT' : 'DATE WALK', 500, 540); drawParty(ctx, job, 420, 540); }
function drawGeneric(ctx, job, label) { ctx.fillStyle = '#1f2937'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#f8fbff'; ctx.font = '900 42px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, PLAY_W / 2, 350); ctx.textAlign = 'left'; drawParty(ctx, job, 420, 440); }
