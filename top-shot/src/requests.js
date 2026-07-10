import { COACH_COMMANDS } from './config.js';
import { stageFor } from './state.js';

export function fighterRequest(state, fighter) {
  if (!fighter || fighter.team !== 'A') return null;
  const cap = fighter.vitalityCap ?? 100;
  const stage = stageFor(fighter);

  if (fighter.extracted) return makeRequest('extract', 'Extracted', 'Off board. Alive.', 'EX', '#b9c4d6', false, 'extract', 'extraction');
  if (fighter.extracting) return makeRequest('extract', 'Extraction', 'Pulling clear.', 'EX', '#d7dff0', true, 'extract', 'extraction');
  if (fighter.incapacitated || fighter.defeated || fighter.hp <= 18 || cap <= 34) {
    return makeRequest('extract', 'Extract?', 'Need a save call.', 'EX', '#ff7d66', true, 'danger', 'extraction approval');
  }
  if (fighter.bleed?.bandaging) {
    return makeRequest('med', 'Medical', 'Bandaging. Cover me.', '+', '#78e0a0', false, 'medical', 'medical cover');
  }
  if ((fighter.bleed?.rate || 0) > 0 || (fighter.bleed?.pool || 0) > 0) {
    return makeRequest('med', 'Medical', 'Bleeding. Need med.', '+', '#78e0a0', true, 'medical', 'medical help');
  }
  if (fighter.hp < 38 || (stage.id !== 'green' && fighter.hp < 52)) {
    return makeRequest('med', 'Medical', 'Hurt. Med kit?', '+', '#78e0a0', true, 'medical', 'a medical item');
  }

  const ammo = ammoRequest(fighter);
  if (ammo) return ammo;

  if (fighter.memory.command) {
    const command = COACH_COMMANDS[fighter.memory.command.type]?.label || 'call';
    return makeRequest('approval', 'Confirmed', `Executing ${command}.`, 'OK', '#93c7ff', false, 'approval', 'approval');
  }
  if (fighter.helpT > 0) return makeRequest('help', 'Need call', 'Looking for direction.', '?', '#f0d36a', true, 'help', 'a command');
  if (fighter.stamina < 18 || fighter.dodge < 12 || fighter.block < 12) {
    return makeRequest('help', 'Need call', 'Low guard. Direct me.', '?', '#f0d36a', true, 'help', 'help');
  }
  if (fighter.commandCd > 0) return makeRequest('approval', 'Processing', 'Taking the call.', 'OK', '#93c7ff', false, 'approval', 'approval');
  return makeRequest('command', 'Awaiting call', 'Watching for your opening.', 'CMD', '#f0d36a', false, 'command', 'a command');
}

function ammoRequest(fighter) {
  if (['marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(fighter.archetypeId)) {
    const ammo = (fighter.resources.rifle || 0) + (fighter.resources.pistol || 0);
    if (ammo <= 8) return makeRequest('ammo', ammo <= 0 ? 'Ammo empty' : 'Ammo low', ammo <= 0 ? 'Need ammo cache.' : `${ammo} rounds left.`, 'AM', '#f0cf68', ammo <= 4, 'ammo', 'ammunition');
  }
  if (['ninja', 'shadow_ninja'].includes(fighter.archetypeId) && (fighter.resources.shuriken || 0) <= 1) {
    return makeRequest('ammo', 'Ammo low', 'Need blades to throw.', 'AM', '#f0cf68', true, 'ammo', 'ammunition');
  }
  if (fighter.archetypeId === 'archer' && (fighter.resources.arrows || 0) <= 3) {
    return makeRequest('ammo', 'Ammo low', 'Need arrows.', 'AM', '#f0cf68', true, 'ammo', 'ammunition');
  }
  if (fighter.archetypeId === 'martial_artist' && (fighter.resources.debris || 0) <= 0) {
    return makeRequest('ammo', 'Improvised', 'Need throwable debris.', 'AM', '#f0cf68', false, 'ammo', 'a projectile');
  }
  return null;
}

function makeRequest(id, label, detail, icon, color, urgent, tone, callout) {
  return { id, label, detail, icon, color, urgent, tone, callout };
}
