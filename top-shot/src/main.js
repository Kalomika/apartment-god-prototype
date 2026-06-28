import { archetypeList } from './archetypes.js';
import { COACH_DROPS } from './config.js';
import { createBattle, stageFor } from './state.js';
import { draw } from './render.js';
import { updateBattle, placeCoachDrop } from './systems.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ui = {
  fighterA: document.getElementById('fighterA'), fighterB: document.getElementById('fighterB'),
  start: document.getElementById('startMatch'), pause: document.getElementById('pauseMatch'), hud: document.getElementById('hud'), log: document.getElementById('log'), overlay: document.getElementById('overlay')
};

for (const fighter of archetypeList()) {
  ui.fighterA.append(new Option(fighter.name, fighter.id));
  ui.fighterB.append(new Option(fighter.name, fighter.id));
}
ui.fighterA.value = 'marine'; ui.fighterB.value = 'ninja';
let state = createBattle(ui.fighterA.value, ui.fighterB.value);
let last = performance.now();

ui.start.addEventListener('click', () => { state = createBattle(ui.fighterA.value, ui.fighterB.value); });
ui.pause.addEventListener('click', () => { state.paused = !state.paused; ui.pause.textContent = state.paused ? 'Resume' : 'Pause'; });
document.querySelectorAll('[data-drop]').forEach(button => {
  button.addEventListener('click', () => { state.selectedDrop = button.dataset.drop; ui.overlay.textContent = `Click arena to place ${COACH_DROPS[state.selectedDrop].label}`; });
});
canvas.addEventListener('click', event => {
  if (!state.selectedDrop) return;
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * canvas.width / rect.width;
  const y = (event.clientY - rect.top) * canvas.height / rect.height;
  if (x < 960 && placeCoachDrop(state, state.selectedDrop, x, y)) { state.selectedDrop = null; ui.overlay.textContent = ''; }
});

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateBattle(state, dt);
  draw(ctx, state);
  renderDomHud();
  requestAnimationFrame(frame);
}

function renderDomHud() {
  ui.hud.innerHTML = state.fighters.map(f => {
    const stage = stageFor(f);
    return `<article class="fighter-card"><h3><span>${f.name}</span><small>${stage.label}</small></h3>${bar('HP', f.hp)}${bar('Stamina', f.stamina)}${bar('Dodge', f.dodge)}${bar('Block', f.block)}<small>${f.intent} / ${f.pose}</small></article>`;
  }).join('') + `<article class="fighter-card"><h3>Drops</h3>${Object.entries(state.dropsLeft).map(([id, left]) => `<small>${COACH_DROPS[id].label}: ${left}</small>`).join('<br>')}</article>`;
  ui.log.innerHTML = state.log.map(item => `<li>${item}</li>`).join('');
}
function bar(label, value) { return `<div>${label}</div><div class="meter"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`; }

requestAnimationFrame(frame);
