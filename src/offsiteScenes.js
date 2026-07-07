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
  else if (scene === 'theater') drawTheater(ctx, job, label);
  else if (scene === 'beach') drawBeach(ctx, job, label);
  else if (scene === 'alps') drawAlps(ctx, job, label);
  else if (scene === 'camping') drawCamping(ctx, job, label);
  else if (scene === 'safari') drawSafari(ctx, job, label);
  else if (scene === 'cruise') drawCruise(ctx, job, label);
  else if (scene === 'desert') drawDesert(ctx, job, label);
  else if (scene === 'city' || scene === 'mall' || scene === 'date') drawCity(ctx, job, label);
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
  ctx.fillText(label, PLAY_W / 2, 66);
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

function drawPlane(ctx, job) {
  ctx.fillStyle = '#1d2636';
  ctx.fillRect(150, 128, 660, 500);
  ctx.fillStyle = '#2d384d';
  ctx.fillRect(202, 164, 556, 420);
  ctx.fillStyle = '#90d8ff';
  for (let y = 184; y < 560; y += 54) { ctx.fillRect(172, y, 28, 18); ctx.fillRect(760, y, 28, 18); }
  ctx.fillStyle = '#394761';
  for (let row = 0; row < 6; row++) for (let col = 0; col < 4; col++) roundSeat(ctx, 270 + col * 115, 190 + row * 58);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 16px system-ui';
  ctx.fillText('HOSTESS', 425, 154);
  ctx.fillStyle = '#f8fbff';
  ctx.fillRect(455, 160, 50, 18);
  drawParty(ctx, job, 332, 492);
}

function roundSeat(ctx, x, y) { ctx.beginPath(); ctx.roundRect?.(x, y, 42, 34, 8); if (ctx.roundRect) ctx.fill(); else ctx.fillRect(x, y, 42, 34); }
function drawTheater(ctx, job) { ctx.fillStyle = '#170d1e'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#d8e8ff'; ctx.fillRect(190, 130, 580, 120); ctx.fillStyle = '#10141b'; ctx.font = '900 22px system-ui'; ctx.textAlign = 'center'; ctx.fillText(randomMovie(job), PLAY_W / 2, 198); ctx.textAlign = 'left'; ctx.fillStyle = '#3a1528'; for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) { ctx.fillRect(170 + c * 70, 330 + r * 44, 44, 28); } drawParty(ctx, job, 362, 420); }
function drawBeach(ctx, job) { ctx.fillStyle = '#1f9ed4'; ctx.fillRect(0, 0, PLAY_W, 320); ctx.fillStyle = '#e8ca83'; ctx.fillRect(0, 320, PLAY_W, 400); ctx.strokeStyle = 'rgba(255,255,255,.7)'; for (let y = 270; y < 350; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(220, y - 28, 440, y); ctx.quadraticCurveTo(660, y + 28, 960, y); ctx.stroke(); } ctx.fillStyle = '#f1c66a'; ctx.font = '900 16px system-ui'; ctx.fillText('Surf • Relax • Treasure Search', 340, 610); drawParty(ctx, job, 420, 492); }
function drawAlps(ctx, job) { ctx.fillStyle = '#dae8f4'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#7d8fa5'; mountain(ctx, 80, 560, 260); mountain(ctx, 330, 560, 320); mountain(ctx, 620, 560, 250); drawParty(ctx, job, 420, 520); }
function mountain(ctx, x, y, h) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 130, y - h); ctx.lineTo(x + 260, y); ctx.closePath(); ctx.fill(); }
function drawCamping(ctx, job) { ctx.fillStyle = '#173322'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#315b38'; for (let i = 0; i < 18; i++) ctx.fillRect((i * 73) % 920, 140 + (i * 91) % 450, 38, 86); ctx.fillStyle = '#f1c66a'; ctx.beginPath(); ctx.arc(480, 420, 26, 0, Math.PI * 2); ctx.fill(); drawParty(ctx, job, 420, 510); }
function drawSafari(ctx, job) { ctx.fillStyle = '#d6a94e'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#6b542a'; for (let i = 0; i < 8; i++) ctx.fillRect(110 + i * 98, 260 + (i % 3) * 44, 56, 20); drawParty(ctx, job, 420, 500); }
function drawCruise(ctx, job) { ctx.fillStyle = '#0e5278'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#f8fbff'; ctx.fillRect(250, 250, 460, 180); ctx.fillStyle = '#74e6ff'; ctx.fillRect(300, 280, 360, 40); drawParty(ctx, job, 420, 500); }
function drawDesert(ctx, job) { ctx.fillStyle = '#ca8c48'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#e4b66b'; for (let y = 280; y < 620; y += 58) { ctx.beginPath(); ctx.moveTo(0, y); ctx.quadraticCurveTo(240, y - 45, 480, y); ctx.quadraticCurveTo(720, y + 45, 960, y); ctx.stroke(); } drawParty(ctx, job, 420, 500); }
function drawCity(ctx, job) { ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? '#28344a' : '#20293b'; ctx.fillRect(80 + i * 92, 170, 58, 330); ctx.fillStyle = '#f1c66a'; ctx.fillRect(94 + i * 92, 205, 10, 10); ctx.fillRect(116 + i * 92, 250, 10, 10); } drawParty(ctx, job, 420, 540); }
function drawGeneric(ctx, job, label) { ctx.fillStyle = '#1f2937'; ctx.fillRect(0, 0, PLAY_W, PLAY_H); ctx.fillStyle = '#f8fbff'; ctx.font = '900 42px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label, PLAY_W / 2, 350); ctx.textAlign = 'left'; drawParty(ctx, job, 420, 440); }
function randomMovie(job) { return job.movieTitle || 'NEON TENANTS'; }
