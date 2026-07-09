import { archetypeList } from './archetypes.js';
import { createCqcLabState, toggleCqcSlowMo, triggerCqcAction, updateCqcLab } from './cqcLab.js';
import { installCameraAngleControls } from './cameraAngles.js';
import { COACH_COMMANDS, COACH_DROPS, ARENA_H, ARENA_W } from './config.js';
import { fighterRequest } from './requests.js';
import { beginBattle, createBattle, stageFor } from './state.js';
import { updateBattle, placeCoachDrop, suggestCommand, setCommanderEthos } from './systems.js';
import { createTopShot3D } from './three/topShot3D.js';
import { installTopShotEffects3D } from './three/effects3D.js';
import { VITALITY_STAGES } from './vitality.js';

const RECORD_KEY = 'topShotFightRecordsV1';
const canvas = document.getElementById('game');
const ui = {
  fighterA: document.getElementById('fighterA'), fighterB: document.getElementById('fighterB'), ethos: document.getElementById('commanderEthos'), start: document.getElementById('startMatch'), pause: document.getElementById('pauseMatch'), mainMode: document.getElementById('mainMode'), cqcLabMode: document.getElementById('cqcLabMode'), labControls: document.getElementById('labControls'), hud: document.getElementById('hud'), log: document.getElementById('log'), overlay: document.getElementById('overlay')
};

for (const fighter of archetypeList()) { ui.fighterA.append(new Option(fighter.name, fighter.id)); ui.fighterB.append(new Option(fighter.name, fighter.id)); }
ui.fighterA.value = 'suit_operative'; ui.fighterB.value = 'survival_commando'; ui.ethos.value = 'ai'; ui.start.textContent = 'Begin Sortie';
const cameraHelp = 'Camera: 1 Top Down, 2 High, 3 Oblique, 4 Isometric, V cycles.';
let world3D = null; let fallbackCtx = null; let records = loadRecords(); let lastRecordedKey = ''; let last = performance.now(); let lastTap = 0; let overlayMode = 'system';
ui.overlay.textContent = 'Desert industrial site loading.';
try { world3D = await createTopShot3D(canvas); installCameraAngleControls(world3D, ui.overlay); installTopShotEffects3D(world3D); ui.overlay.textContent = `Desert industrial site loaded. ${cameraHelp}`; } catch (error) { console.error('3D terrain failed to load, falling back to tactical map.', error); fallbackCtx = canvas.getContext('2d'); ui.overlay.textContent = 'Desert industrial site loaded in fallback view.'; }

const urlMode = new URLSearchParams(window.location.search).get('mode');
let state = urlMode === 'cqc' ? createCqcLabState(ui.fighterA.value, ui.fighterB.value) : createBattle(ui.fighterA.value, ui.fighterB.value);
updateUiMode();

ui.mainMode?.addEventListener('click', () => enterMainMode());
ui.cqcLabMode?.addEventListener('click', () => enterCqcLab());
ui.start.addEventListener('click', () => { if (state.mode === 'cqc') { enterCqcLab(); return; } state = createBattle(ui.fighterA.value, ui.fighterB.value); beginBattle(state, ui.fighterA.value, ui.fighterB.value); setCommanderEthos(state, ui.ethos.value); lastRecordedKey = ''; overlayMode = 'system'; ui.overlay.textContent = `Intro sequence. Parachutes inbound. ${cameraHelp}`; ui.start.textContent = 'Restart Sortie'; ui.pause.textContent = 'Pause'; updateUiMode(); });
ui.ethos.addEventListener('change', () => { if (state.mode !== 'cqc') setCommanderEthos(state, ui.ethos.value); });
ui.pause.addEventListener('click', () => { state.paused = !state.paused; ui.pause.textContent = state.paused ? 'Resume' : 'Pause'; });

document.querySelectorAll('[data-lab-action]').forEach(button => { button.addEventListener('click', () => { if (state.mode !== 'cqc') enterCqcLab(false); const action = button.dataset.labAction; if (action === 'slowmo') toggleCqcSlowMo(state); else triggerCqcAction(state, action); overlayMode = 'manual'; ui.overlay.textContent = `CQC Lab: ${actionLabel(action)}.`; }); });
document.querySelectorAll('[data-drop]').forEach(button => { button.addEventListener('click', () => { if (state.mode === 'cqc') { overlayMode = 'manual'; ui.overlay.textContent = 'Drops are disabled in CQC Lab. Use lab buttons to refine combat.'; return; } if (state.matchState !== 'running') { overlayMode = 'manual'; ui.overlay.textContent = 'Begin the sortie first. Drops unlock after landing.'; return; } state.selectedDrop = button.dataset.drop; state.selectedCommand = null; overlayMode = 'manual'; ui.overlay.textContent = `Click site to place ${COACH_DROPS[state.selectedDrop].label}`; }); });
document.querySelectorAll('[data-command]').forEach(button => { button.addEventListener('click', () => { if (state.mode === 'cqc') { overlayMode = 'manual'; ui.overlay.textContent = 'Main match commands are disabled in CQC Lab. Test moves one at a time.'; return; } if (state.matchState !== 'running') { overlayMode = 'manual'; ui.overlay.textContent = 'Begin the sortie first. Commands unlock after landing.'; return; } state.selectedCommand = button.dataset.command; state.selectedDrop = null; overlayMode = 'manual'; ui.overlay.textContent = `Click site to suggest: ${COACH_COMMANDS[state.selectedCommand].label}`; }); });

window.addEventListener('keydown', event => { const key = event.key.toLowerCase(); if (key === 'l') { state.mode === 'cqc' ? enterMainMode(false) : enterCqcLab(false); event.preventDefault(); return; } if (key === 'r' && state.mode === 'cqc') { triggerCqcAction(state, 'reset'); event.preventDefault(); return; } if (key !== 'c' || !world3D) return; const visible = world3D.toggleCollisionDebug(); overlayMode = 'manual'; ui.overlay.textContent = visible ? 'Collision map visible.' : 'Collision map hidden.'; });

canvas.addEventListener('click', event => {
  if (state.mode === 'cqc') { overlayMode = 'manual'; ui.overlay.textContent = 'CQC Lab is button-driven for now. Use Jab, Cross, Block, Parry, Slip, Step Back, or Reset.'; return; }
  if (state.matchState === 'finished') { overlayMode = 'manual'; ui.overlay.textContent = `${state.result || 'Match finished.'} Press Restart Sortie for a rematch.`; return; }
  if (state.matchState === 'ready') { overlayMode = 'manual'; ui.overlay.textContent = 'Site is quiet. Press Begin Sortie to bring fighters in.'; return; }
  if (state.matchState === 'deploying') { overlayMode = 'manual'; ui.overlay.textContent = 'Fighters are still parachuting into the site.'; return; }
  const point = arenaPoint(event); if (!point) return; const { x, y } = point; const now = performance.now(); const urgent = now - lastTap < 290; lastTap = now;
  if (state.selectedDrop) { if (placeCoachDrop(state, state.selectedDrop, x, y)) { state.selectedDrop = null; overlayMode = 'manual'; ui.overlay.textContent = ''; } return; }
  const command = urgent ? 'move' : state.selectedCommand || 'move';
  if (suggestCommand(state, command, x, y, urgent)) { overlayMode = 'manual'; ui.overlay.textContent = urgent ? 'Urgent run-there call sent.' : `${COACH_COMMANDS[command].label} suggestion sent.`; if (!urgent) state.selectedCommand = null; }
});

function enterMainMode(updateUrl = true) { state = createBattle(ui.fighterA.value, ui.fighterB.value); lastRecordedKey = ''; overlayMode = 'system'; ui.overlay.textContent = `Main Match ready. ${cameraHelp}`; if (updateUrl) history.replaceState(null, '', window.location.pathname); updateUiMode(); }
function enterCqcLab(updateUrl = true) { state = createCqcLabState(ui.fighterA.value, ui.fighterB.value); lastRecordedKey = ''; overlayMode = 'system'; ui.overlay.textContent = 'CQC Lab loaded. Drone camera is tight overhead. Test one move at a time.'; if (world3D?.setCameraMode) world3D.setCameraMode('topdown'); if (updateUrl) history.replaceState(null, '', `${window.location.pathname}?mode=cqc`); updateUiMode(); }
function updateUiMode() { const isLab = state.mode === 'cqc'; document.body.classList.toggle('cqc-mode', isLab); ui.labControls?.classList.toggle('hidden', !isLab); ui.mainMode?.classList.toggle('active-mode', !isLab); ui.cqcLabMode?.classList.toggle('active-mode', isLab); ui.start.textContent = isLab ? 'Reset Lab' : state.matchState === 'ready' ? 'Begin Sortie' : 'Restart Sortie'; ui.pause.textContent = state.paused ? 'Resume' : 'Pause'; }
function arenaPoint(event) { if (world3D) return world3D.arenaPointFromPointer(event); const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * ARENA_W / rect.width, y: (event.clientY - rect.top) * ARENA_H / rect.height }; }

function frame(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (state.mode === 'cqc') updateCqcLab(state, dt); else updateBattle(state, dt); saveFinishedMatchRecord(); if (world3D) world3D.update(dt, state); else drawFallbackTerrain(fallbackCtx, state); renderMatchOverlay(); renderDomHud(); updateUiMode(); requestAnimationFrame(frame); }

function renderMatchOverlay() {
  if (state.mode === 'cqc') { if (overlayMode === 'system') ui.overlay.textContent = `CQC Lab, ${formatTime(state.clock)}. Test moves one at a time.`; return; }
  if (state.matchState === 'ready') { overlayMode = 'system'; ui.overlay.textContent = `Desert industrial site loaded. Choose fighters, then Begin Sortie. ${cameraHelp}`; ui.start.textContent = 'Begin Sortie'; return; }
  if (state.matchState === 'deploying') { overlayMode = 'system'; ui.overlay.textContent = `INTRO: parachute entry. ${formatTime(state.clock)}`; return; }
  if (state.matchState === 'running' && overlayMode === 'system') { ui.overlay.textContent = ''; return; }
  if (state.matchState !== 'finished') return;
  ui.overlay.textContent = `OUTRO: ${state.result || 'Match finished.'} Press Restart Sortie for a rematch.`;
  ui.start.textContent = 'Restart Sortie';
}

function renderDomHud() {
  const cards = state.fighters.map(f => { const stage = stageFor(f); const request = state.mode === 'cqc' ? null : fighterRequest(state, f); const status = fighterStatus(f); return `<article class="fighter-card"><h3><span>${escapeHtml(f.name)}</span><small>${escapeHtml(stage.label)} ${Math.round(f.hp)}%</small></h3>${requestHtml(request)}<div class="action-pill">${escapeHtml(status.label)}</div><small class="action-detail">${escapeHtml(status.detail)}</small>${healthPanel(f, stage)}${bar('Stamina', f.stamina)}${bar('Dodge', f.dodge)}${bar('Block', f.block)}<small>${escapeHtml(fighterShortState(f))}</small></article>`; }).join('');
  const drops = Object.entries(state.dropsLeft || {}).map(([id, left]) => `<small>${escapeHtml(COACH_DROPS[id]?.label || id)}: ${left}</small>`).join('<br>');
  const modeCard = state.mode === 'cqc' ? labCard() : mainMatchCard(drops);
  ui.hud.innerHTML = `${cards}${commentaryCard()}${modeCard}${recordsCard()}`;
  ui.log.innerHTML = (state.log || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function commentaryCard() { const recent = (state.log || []).slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join(''); return `<article class="fighter-card commentary-card"><h3>Fight Commentary</h3><ol class="mini-log">${recent || '<li>No action yet.</li>'}</ol></article>`; }
function mainMatchCard(drops) { const cinematic = state.cinematic?.phase ? `<br><small>Cinematic: ${escapeHtml(state.cinematic.phase)} ${escapeHtml(state.cinematic.label || '')}</small>` : ''; return `<article class="fighter-card"><h3>Commander</h3>${bar('Trust', state.trust)}<small>Match Time: ${formatTime(state.clock)}</small><br><small>Ethos: ${escapeHtml(state.commanderEthos)}</small><br><small>${escapeHtml(state.result || state.matchState)}</small>${cinematic}<br><small>Map: desert industrial test site</small><br><small>${cameraHelp}</small><br>${drops}</article><article class="fighter-card"><h3>Terrain</h3><small>Fighters can climb and jump off boulders, containers, scrap, tanks, and raised catwalk/stair zones. Movement uses realistic human pacing.</small></article>`; }
function labCard() { return `<article class="fighter-card"><h3>CQC Lab</h3><small>Lab Time: ${formatTime(state.clock)}</small><br><small>Mode: one move at a time</small><br><small>Camera: close overhead drone</small><br><small>Last Action: ${escapeHtml(actionLabel(state.lab?.action || 'guard'))}</small><br><small>${state.lab?.slowMo ? 'Slow motion is on.' : 'Slow motion is off.'}</small></article>`; }
function recordsCard() { const top = Object.values(records.fighters || {}).sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses)).slice(0, 4); const last = records.matches?.[0]; const standings = top.map(r => `<li>${escapeHtml(r.name)}: ${r.wins}-${r.losses}</li>`).join('') || '<li>No completed matches yet.</li>'; const lastLine = last ? `<small>Last: ${escapeHtml(last.winner)} over ${escapeHtml(last.loser)} in ${formatTime(last.length)} by ${escapeHtml(last.method)}.</small>` : '<small>No result recorded yet.</small>'; return `<article class="fighter-card records-card"><h3>Records</h3>${lastLine}<ol class="mini-log">${standings}</ol></article>`; }

function saveFinishedMatchRecord() { if (state.mode === 'cqc' || state.matchState !== 'finished' || !state.result) return; const key = state.result; if (lastRecordedKey === key) return; lastRecordedKey = key; const active = state.fighters.filter(f => !f.incapacitated && !f.extracted); const winner = active[0] || state.fighters.find(f => state.result.includes(f.name)); const loser = state.fighters.find(f => f !== winner) || state.fighters[1]; const record = { at: new Date().toISOString(), length: Math.floor(state.clock), winner: winner?.name || 'Unknown', loser: loser?.name || 'Unknown', method: inferMethod(state), highlights: (state.log || []).slice(0, 8) }; records.matches.unshift(record); records.matches = records.matches.slice(0, 50); addFighterRecord(record.winner, 'win'); addFighterRecord(record.loser, 'loss'); saveRecords(records); }
function addFighterRecord(name, result) { if (!name) return; records.fighters[name] ||= { name, wins: 0, losses: 0 }; if (result === 'win') records.fighters[name].wins += 1; else records.fighters[name].losses += 1; }
function inferMethod(matchState) { const result = String(matchState.result || '').toLowerCase(); if (result.includes('extracted') || result.includes('forfeit')) return 'extraction forfeit'; if (result.includes('incapacitated')) return 'incapacitation'; if (result.includes('out')) return 'stoppage'; return 'decision'; }

function fighterStatus(f) {
  if (f.incapacitated) return { label: 'Down', detail: 'Incapacitated and no longer active.' };
  if (f.defeated) return { label: 'Dropped', detail: 'Dropped to a knee and vulnerable.' };
  if (f.extracted || f.extracting) return { label: 'Extracting', detail: 'Leaving the fight by rope or rescue.' };
  if (f.deploying || f.pose === 'parachute') return { label: 'Parachuting', detail: 'Descending into the site.' };
  if (f.bleed?.rate > 0) return { label: 'Bleeding', detail: `Blood trail active. Rate ${f.bleed.rate.toFixed(1)}.` };
  if (f.climbT > 0 || String(f.pose || '').includes('climb')) return { label: 'Climbing', detail: 'Getting onto an object for elevation or cover.' };
  if (f.jumpT > 0 || String(f.pose || '').includes('jump_down')) return { label: 'Jumping Down', detail: 'Dropping off elevation to avoid pressure.' };
  if (f.dizzyT > 0) return { label: 'Dizzy', detail: 'Momentarily stunned and trying to recover.' };
  const pose = String(f.pose || f.intent || 'idle');
  if (pose.includes('dive')) return { label: 'Diving Away', detail: 'Prioritizing cover under bullet pressure.' };
  if (pose.includes('crawl')) return { label: 'Crawling', detail: 'Low to the ground, moving while exposed.' };
  if (pose.includes('prone')) return { label: 'Prone', detail: 'Flat on the ground, harder to see.' };
  if (pose.includes('crouch') || f.crouch) return { label: 'Crouching', detail: 'Lowering profile for cover or defense.' };
  if (pose.includes('wall') || f.wallLean) return { label: 'Pinned to Cover', detail: 'Using a wall or object for protection.' };
  if (pose.includes('block')) return { label: 'Blocking', detail: 'Shelling up against the incoming strike.' };
  if (pose.includes('parry')) return { label: 'Parrying', detail: 'Redirecting the attack instead of absorbing it.' };
  if (pose.includes('slip')) return { label: 'Slipping', detail: 'Moving the head/body off the attack line.' };
  if (pose.includes('jab')) return { label: 'Jab', detail: 'Fast lead-hand range finder.' };
  if (pose.includes('cross')) return { label: 'Cross', detail: 'Committed rear-hand punch.' };
  if (pose.includes('hit') || pose.includes('shot')) return { label: 'Hit Stun', detail: 'Reacting to impact and giving ground.' };
  if (pose.includes('recover') || pose.includes('bandage')) return { label: 'Recovering', detail: 'Trying to regain function or patch damage.' };
  if (pose.includes('duck')) return { label: 'Ducking', detail: 'Dropping under pressure or incoming fire.' };
  if (pose.includes('run') || pose.includes('rush')) return { label: 'Moving', detail: 'Repositioning under pressure.' };
  if (pose.includes('hide') || f.hidden) return { label: 'Hiding', detail: 'Breaking vision and reducing exposure.' };
  if (pose.includes('victory')) return { label: 'Victory Hold', detail: 'Outro pose after the finish.' };
  return { label: 'Guarding', detail: 'Reading the opponent and staying ready.' };
}

function fighterShortState(f) { const parts = [f.intent || 'idle', f.pose || 'guard']; if (f.memory?.command?.type) parts.push(`command ${f.memory.command.type}`); if (f.onObject) parts.push(`on ${f.onObject}`); return parts.join(' / '); }
function healthPanel(f, stage) { return `<div class="health-readout"><strong>Health ${Math.round(f.hp)}%</strong><span>${escapeHtml(stage.label)} stage, cap ${Math.round(f.vitalityCap ?? 100)}%</span></div>${bar('Health', f.hp, stage.color)}${vitalityLadder(f)}`; }
function vitalityLadder(f) { return `<div class="vitality-ladder">${VITALITY_STAGES.filter(s => s.id !== 'incapacitated').map(stage => `<span class="${f.hp >= stage.min ? 'active' : ''}" style="--stage:${stage.color}">${escapeHtml(stage.label[0])}</span>`).join('')}<span class="${f.incapacitated || f.hp <= 0 ? 'active' : ''}" style="--stage:#7d8795">X</span></div>`; }
function requestHtml(request) { if (!request) return ''; const color = escapeHtml(request.color || '#f0d36a'); return `<div class="handler-request" style="--signal:${color};--accent:${color}">${portraitHtml(request)}<div class="request-copy"><strong>${escapeHtml(request.label)}</strong><span>${escapeHtml(request.detail)}</span></div></div>`; }
function portraitHtml(request) { return `<div class="handler-portrait" aria-hidden="true"><div class="portrait-shoulders"></div><div class="portrait-neck"></div><div class="portrait-face"></div><div class="portrait-hair"></div><div class="portrait-eyes"></div><div class="portrait-hand portrait-left"></div><div class="portrait-hand portrait-right"></div><div class="portrait-signal">${escapeHtml(request.icon || '?')}</div></div>`; }
function bar(label, value, color = null) { const safe = Math.max(0, Math.min(100, Number(value) || 0)); const style = color ? `width:${safe}%;background:${escapeHtml(color)}` : `width:${safe}%`; return `<div>${escapeHtml(label)} ${Math.round(safe)}%</div><div class="meter"><span style="${style}"></span></div>`; }
function formatTime(seconds) { const total = Math.max(0, Math.floor(seconds)); const min = String(Math.floor(total / 60)).padStart(2, '0'); const sec = String(total % 60).padStart(2, '0'); return `${min}:${sec}`; }
function actionLabel(action) { return String(action || 'guard').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

function drawFallbackTerrain(ctx, fallbackState) { if (!ctx) return; const w = ctx.canvas.width; const h = ctx.canvas.height; ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#a97843'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#6d533b'; for (const box of fallbackState.arena.walls) ctx.fillRect(box.x / ARENA_W * w, box.y / ARENA_H * h, box.w / ARENA_W * w, box.h / ARENA_H * h); ctx.fillStyle = '#00000055'; for (const shade of fallbackState.arena.shadows) ctx.fillRect(shade.x / ARENA_W * w, shade.y / ARENA_H * h, shade.w / ARENA_W * w, shade.h / ARENA_H * h); ctx.fillStyle = '#f0d36a'; ctx.font = '900 24px system-ui'; ctx.fillText(state.mode === 'cqc' ? 'TOP SHOT CQC LAB' : 'TOP SHOT', 24, 42); ctx.font = '900 18px system-ui'; ctx.fillText(`TIME ${formatTime(fallbackState.clock)}`, 24, 68); }
function loadRecords() { try { const parsed = JSON.parse(localStorage.getItem(RECORD_KEY) || '{}'); return { matches: Array.isArray(parsed.matches) ? parsed.matches : [], fighters: parsed.fighters || {} }; } catch { return { matches: [], fighters: {} }; } }
function saveRecords(nextRecords) { try { localStorage.setItem(RECORD_KEY, JSON.stringify(nextRecords)); } catch {} }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

requestAnimationFrame(frame);
