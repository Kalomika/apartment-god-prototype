import { archetypeList } from './archetypes.js';
import { COACH_COMMANDS, COACH_DROPS } from './config.js';
import { createBattle, stageFor } from './state.js';
import { draw } from './render.js';
import { fighterRequest } from './requests.js';
import { updateBattle, placeCoachDrop, suggestCommand, setCommanderEthos } from './systems.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ui = {
  fighterA: document.getElementById('fighterA'), fighterB: document.getElementById('fighterB'), ethos: document.getElementById('commanderEthos'),
  start: document.getElementById('startMatch'), pause: document.getElementById('pauseMatch'), hud: document.getElementById('hud'), log: document.getElementById('log'), overlay: document.getElementById('overlay')
};

for (const fighter of archetypeList()) {
  ui.fighterA.append(new Option(fighter.name, fighter.id));
  ui.fighterB.append(new Option(fighter.name, fighter.id));
}
ui.fighterA.value = 'marine'; ui.fighterB.value = 'ninja'; ui.ethos.value = 'ai';
let state = createBattle(ui.fighterA.value, ui.fighterB.value);
let last = performance.now();
let lastTap = 0;

ui.start.addEventListener('click', () => { state = createBattle(ui.fighterA.value, ui.fighterB.value); setCommanderEthos(state, ui.ethos.value); ui.overlay.textContent = ''; ui.start.textContent = 'Start Match'; });
ui.ethos.addEventListener('change', () => setCommanderEthos(state, ui.ethos.value));
ui.pause.addEventListener('click', () => { state.paused = !state.paused; ui.pause.textContent = state.paused ? 'Resume' : 'Pause'; });
document.querySelectorAll('[data-drop]').forEach(button => {
  button.addEventListener('click', () => { state.selectedDrop = button.dataset.drop; state.selectedCommand = null; ui.overlay.textContent = `Click arena to place ${COACH_DROPS[state.selectedDrop].label}`; });
});
document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => { state.selectedCommand = button.dataset.command; state.selectedDrop = null; ui.overlay.textContent = `Click arena to suggest: ${COACH_COMMANDS[state.selectedCommand].label}`; });
});
canvas.addEventListener('click', event => {
  if (state.matchState === 'finished') { ui.overlay.textContent = `${state.result || 'Match finished.'} Press Start Match for a rematch.`; return; }
  const { x, y } = arenaPoint(event);
  if (x >= 960) return;
  const now = performance.now();
  const urgent = now - lastTap < 290;
  lastTap = now;
  if (state.selectedDrop) {
    if (placeCoachDrop(state, state.selectedDrop, x, y)) { state.selectedDrop = null; ui.overlay.textContent = ''; }
    return;
  }
  const command = urgent ? 'move' : state.selectedCommand || 'move';
  if (suggestCommand(state, command, x, y, urgent)) {
    ui.overlay.textContent = urgent ? 'Urgent run-there call sent.' : `${COACH_COMMANDS[command].label} suggestion sent.`;
    if (!urgent) state.selectedCommand = null;
  }
});

function arenaPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateBattle(state, dt);
  draw(ctx, state);
  renderMatchOverlay();
  renderDomHud();
  requestAnimationFrame(frame);
}

function renderMatchOverlay() {
  if (state.matchState !== 'finished') return;
  ui.overlay.textContent = `${state.result || 'Match finished.'} Press Start Match for a rematch.`;
  ui.start.textContent = 'Rematch';
}

function renderDomHud() {
  ui.hud.innerHTML = state.fighters.map(f => {
    const stage = stageFor(f);
    const request = fighterRequest(state, f);
    return `<article class="fighter-card"><h3><span>${f.name}</span><small>${stage.label}</small></h3>${requestMarkup(f, request)}${bar('HP', f.hp)}${bar('Stamina', f.stamina)}${bar('Dodge', f.dodge)}${bar('Block', f.block)}<small>${f.memory.command ? `Command: ${f.memory.command.type}` : `${f.intent} / ${f.pose}`}</small><br><small>Prestige ${Math.round(f.prestige)} / Ruthless ${Math.round(f.ruthless)}</small></article>`;
  }).join('') + `<article class="fighter-card"><h3>Commander</h3>${bar('Trust', state.trust)}<small>Ethos: ${state.commanderEthos}</small><br><small>${state.result || state.matchState}</small><br>${Object.entries(state.dropsLeft).map(([id, left]) => `<small>${COACH_DROPS[id].label}: ${left}</small>`).join('<br>')}</article>`;
  ui.log.innerHTML = state.log.map(item => `<li>${item}</li>`).join('');
}
function bar(label, value) { return `<div>${label}</div><div class="meter"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`; }
function requestMarkup(f, request) {
  if (!request) return '';
  return `<div class="handler-request request-${request.tone}" style="--fighter:${f.color};--accent:${f.accent};--signal:${request.color};"><div class="handler-portrait" aria-hidden="true"><span class="portrait-shoulders"></span><span class="portrait-neck"></span><span class="portrait-face"></span><span class="portrait-hair"></span><span class="portrait-eyes"></span><span class="portrait-hand portrait-left"></span><span class="portrait-hand portrait-right"></span><span class="portrait-signal">${request.icon}</span></div><div class="request-copy"><strong>${request.label}</strong><span>${request.detail}</span></div></div>`;
}

requestAnimationFrame(frame);
