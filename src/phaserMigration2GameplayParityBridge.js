import { syncCameraNavigationUi, navigateView } from './cameraNavigation.js';
import { syncPhoneUi } from './phoneUI.js';
import { floors } from './world.js';

const GAME_SCENE_KEY = 'ApartmentGodNativeScene';
const HEADBOARD_ROTATIONS = { north: 0, up: 0, east: Math.PI / 2, south: Math.PI, down: Math.PI, west: -Math.PI / 2 };
const FACING_ROTATIONS = { south: 0, down: 0, west: Math.PI / 2, north: Math.PI, up: Math.PI, east: -Math.PI / 2 };

export function objectVisualRotation(object) {
  const explicit = Number(object?.renderAngle);
  if (Number.isFinite(explicit)) return explicit;
  const headboard = String(object?.headboard || '').toLowerCase();
  if (headboard) return HEADBOARD_ROTATIONS[headboard] ?? 0;
  return FACING_ROTATIONS[String(object?.facing || 'down').toLowerCase()] ?? 0;
}

export function objectVisualDisplaySize(object) {
  const rotation = objectVisualRotation(object);
  const quarterTurn = Math.abs(Math.sin(rotation)) > 0.5;
  const width = Math.max(18, Number(object?.w) || 18);
  const height = Math.max(18, Number(object?.h) || 18);
  return quarterTurn ? { width: height, height: width } : { width, height };
}

export function installPhaserMigration2GameplayParityBridge(game) {
  if (!game || game.__pm2GameplayParityBridgeInstalled) return game;
  game.__pm2GameplayParityBridgeInstalled = true;

  const waitForScene = window.setInterval(() => {
    const scene = game.scene?.getScene?.(GAME_SCENE_KEY);
    if (!scene?.state || !scene?.events) return;
    window.clearInterval(waitForScene);
    installSceneBridge(scene);
  }, 40);

  window.setTimeout(() => window.clearInterval(waitForScene), 15000);
  return game;
}

function installSceneBridge(scene) {
  if (scene.__pm2GameplayParityBridgeInstalled) return;
  scene.__pm2GameplayParityBridgeInstalled = true;
  scene.__pm2GameplayParityFailures = new Set();
  scene.__pm2ParityArchitecture = scene.add.graphics().setDepth(10);
  scene.__pm2ParityFloor = null;

  const sync = () => {
    if (!scene.state) return;
    syncDomGameplaySystems(scene);
    ensureCriticalHud(scene.state);
    syncResourceHud(scene.state);
    syncRoomArchitecture(scene);
    syncObjectOrientation(scene);
  };

  scene.events.on('postupdate', sync);
  scene.events.once('shutdown', () => scene.events.off('postupdate', sync));
  scene.events.once('destroy', () => scene.events.off('postupdate', sync));
  sync();
}

function syncDomGameplaySystems(scene) {
  if (!scene.__pm2GameplayParityFailures.has('phone')) {
    try {
      syncPhoneUi(scene.state);
    } catch (error) {
      scene.__pm2GameplayParityFailures.add('phone');
      console.error('[Apartment God] P2 phone and vertical navigation UI failed safely.', error);
    }
  }

  if (!scene.__pm2GameplayParityFailures.has('camera')) {
    try {
      syncCameraNavigationUi(scene.state);
    } catch (error) {
      scene.__pm2GameplayParityFailures.add('camera');
      console.error('[Apartment God] P2 map and locator UI failed safely.', error);
    }
  }
}

function ensureCriticalHud(state) {
  const hud = document.getElementById('hud');
  if (!hud) return;

  document.getElementById('hud-resource-strip')?.remove();

  if (!document.getElementById('utility-state')) {
    const section = document.createElement('section');
    section.className = 'panel utility-panel';
    section.innerHTML = '<h2>Money, Utilities & Navigation</h2><div id="utility-state"></div>';
    const needsPanel = [...hud.querySelectorAll('.panel')].find(panel => panel.querySelector('h2')?.textContent?.trim() === 'Needs');
    if (needsPanel) hud.insertBefore(section, needsPanel);
    else hud.prepend(section);
  }

  if (!document.getElementById('floor-5')) {
    const grid = hud.querySelector('.compact-grid');
    if (grid) {
      const button = document.createElement('button');
      button.id = 'floor-5';
      button.type = 'button';
      button.textContent = 'Secret Lab';
      button.onclick = () => navigateView(state, 5, floors[5]?.name || 'Secret Lab', 'hud-control');
      grid.insertBefore(button, grid.querySelector('#speed-1'));
    }
  }

  ensureParityStyles();
}

function syncResourceHud(state) {
  const money = Math.round(state.money ?? 0);
  const electric = Math.max(0, Math.round(state.bill ?? 0));
  const tidy = Math.round(state.tidiness?.score ?? 100);
  const moneyPill = document.getElementById('hud-money-pill');
  const panel = document.getElementById('utility-state');

  if (moneyPill) moneyPill.textContent = `$${money}`;
  if (panel) panel.innerHTML = `<div class="utility-grid"><span><strong>Money</strong>$${money}</span><span><strong>Electric</strong>$${electric}</span><span><strong>Tidiness</strong>${tidy}%</span><span><strong>Autonomy</strong>${state.autonomyMode}</span></div><p class="utility-note">Use ↑ Up and ↓ Down, or Map and Phone in the control bar.</p>`;
}

function syncRoomArchitecture(scene) {
  const floorId = scene.state.floor;
  const floor = floors.find(candidate => candidate.id === floorId);
  if (!floor) return;

  const roomPanels = (scene.roomLayer?.list || []).filter(child => String(child?.texture?.key || '').startsWith('pm2-room-'));
  roomPanels.forEach((panel, index) => {
    const room = floor.rooms?.[index];
    if (!room) return;
    if (typeof panel.setCrop === 'function') panel.setCrop(6, 6, 116, 116);
    panel.setDisplaySize(room.w, room.h);
  });

  if (scene.__pm2ParityFloor === floorId) return;
  scene.__pm2ParityFloor = floorId;
  const graphics = scene.__pm2ParityArchitecture;
  graphics.clear();
  const rooms = floor.rooms || [];

  graphics.fillStyle(0x101820, 0.98);
  for (const room of rooms) graphics.fillRect(room.x - 7, room.y - 7, room.w + 14, room.h + 14);

  for (const room of rooms) {
    graphics.lineStyle(4, 0x17232d, 0.98);
    graphics.strokeRect(room.x, room.y, room.w, room.h);
    graphics.lineStyle(1.5, 0x91a9b7, 0.2);
    graphics.strokeRect(room.x + 3, room.y + 3, room.w - 6, room.h - 6);

    const topOuter = !hasNeighbor(rooms, room, 'top');
    const bottomOuter = !hasNeighbor(rooms, room, 'bottom');
    const leftOuter = !hasNeighbor(rooms, room, 'left');
    const rightOuter = !hasNeighbor(rooms, room, 'right');
    graphics.lineStyle(6, 0x0b141c, 0.98);
    if (topOuter) graphics.lineBetween(room.x, room.y, room.x + room.w, room.y);
    if (bottomOuter) graphics.lineBetween(room.x, room.y + room.h, room.x + room.w, room.y + room.h);
    if (leftOuter) graphics.lineBetween(room.x, room.y, room.x, room.y + room.h);
    if (rightOuter) graphics.lineBetween(room.x + room.w, room.y, room.x + room.w, room.y + room.h);

    if (topOuter && room.w > 240 && !room.id.includes('garage')) {
      const windowColor = room.id.includes('bath') ? 0x8ee7ee : 0x72b9d1;
      graphics.lineStyle(5, windowColor, 0.5);
      graphics.lineBetween(room.x + room.w * 0.36, room.y + 2, room.x + room.w * 0.64, room.y + 2);
    }
  }
}

function hasNeighbor(rooms, room, side) {
  const tolerance = 18;
  return rooms.some(other => {
    if (other === room) return false;
    const overlapX = Math.min(room.x + room.w, other.x + other.w) - Math.max(room.x, other.x) > 12;
    const overlapY = Math.min(room.y + room.h, other.y + other.h) - Math.max(room.y, other.y) > 12;
    if (side === 'top') return overlapX && Math.abs(other.y + other.h - room.y) <= tolerance;
    if (side === 'bottom') return overlapX && Math.abs(room.y + room.h - other.y) <= tolerance;
    if (side === 'left') return overlapY && Math.abs(other.x + other.w - room.x) <= tolerance;
    return overlapY && Math.abs(room.x + room.w - other.x) <= tolerance;
  });
}

function syncObjectOrientation(scene) {
  for (const sprite of scene.nativeObjects || []) {
    const object = sprite.pm2Object;
    if (!object || !sprite.visible) continue;
    const rotation = objectVisualRotation(object);
    const size = objectVisualDisplaySize(object);
    sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
    sprite.setDisplaySize(size.width, size.height);
    sprite.setRotation(rotation);
    sprite.setDepth(object.y + object.h);
  }
}

function ensureParityStyles() {
  if (document.getElementById('pm2-gameplay-parity-styles')) return;
  const style = document.createElement('style');
  style.id = 'pm2-gameplay-parity-styles';
  style.textContent = `
    .utility-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.utility-grid span{display:flex;flex-direction:column;gap:3px;padding:8px 10px;border:1px solid rgba(142,169,184,.2);border-radius:10px;background:rgba(5,11,17,.3);font-size:13px}.utility-grid strong{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#d6b36c}.utility-note{margin:9px 0 0;color:#9cabb4;font-size:11px;line-height:1.35}.utility-panel{border-color:rgba(214,179,108,.32)!important}
    @media(max-width:899px){.compact-grid{position:static!important}}
  `;
  document.head.appendChild(style);
}
