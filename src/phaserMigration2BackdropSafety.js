import { PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

const FLOOR_PALETTES = {
  0: { canvas: '#708078', floor: 0x8f9a8e, room: 0xb0aa96, border: 0x4a5b56 },
  1: { canvas: '#777680', floor: 0x99949c, room: 0xb7ada8, border: 0x554f5b },
  2: { canvas: '#59666d', floor: 0x6e7c82, room: 0x879197, border: 0x39484f },
  3: { canvas: '#626b70', floor: 0x7d8587, room: 0x989b96, border: 0x424a4c },
  4: { canvas: '#70856f', floor: 0x879b79, room: 0x9fb489, border: 0x415d42 }
};

export function installPhaserMigration2BackdropSafety(game, canvas = document.getElementById('game')) {
  if (canvas) canvas.style.background = FLOOR_PALETTES[0].canvas;
  if (!game) return () => {};

  let lastSignature = '';
  let disposed = false;

  const sync = () => {
    if (disposed) return;
    const scene = game.scene?.getScene?.('ApartmentGodNativeScene');
    if (!scene?.sys || scene.runtimeFailed || !scene.state) return;

    const floorId = Number.isInteger(scene.state.floor) ? scene.state.floor : 0;
    const palette = FLOOR_PALETTES[floorId] || FLOOR_PALETTES[0];
    const floor = floors.find(candidate => candidate.id === floorId);
    const roomSignature = (floor?.rooms || []).map(room => `${room.id}:${room.x}:${room.y}:${room.w}:${room.h}`).join('|');
    const signature = `${floorId}|${roomSignature}`;

    scene.cameras?.main?.setBackgroundColor?.(palette.canvas);
    if (canvas && canvas.style.background !== palette.canvas) canvas.style.background = palette.canvas;

    if (!scene.pm2BackdropSurface) {
      scene.pm2BackdropSurface = scene.add.rectangle(PLAY_W / 2, PLAY_H / 2, PLAY_W, PLAY_H, palette.floor, 1);
      scene.pm2BackdropSurface.setDepth(-20000);
      scene.pm2BackdropSurface.pm2SafetyFallback = true;
    }
    scene.pm2BackdropSurface.setFillStyle(palette.floor, 1);

    if (!scene.pm2FallbackRoomGraphics) {
      scene.pm2FallbackRoomGraphics = scene.add.graphics();
      scene.pm2FallbackRoomGraphics.setDepth(-19000);
      scene.pm2FallbackRoomGraphics.pm2SafetyFallback = true;
    }

    if (signature === lastSignature) return;
    lastSignature = signature;
    const graphics = scene.pm2FallbackRoomGraphics;
    graphics.clear();
    graphics.fillStyle(palette.floor, 1);
    graphics.fillRect(0, 0, PLAY_W, PLAY_H);

    for (const room of floor?.rooms || []) {
      graphics.fillStyle(palette.room, .98);
      graphics.fillRoundedRect(room.x, room.y, room.w, room.h, 8);
      graphics.lineStyle(3, palette.border, .72);
      graphics.strokeRoundedRect(room.x, room.y, room.w, room.h, 8);
      graphics.lineStyle(1, 0xf4ead1, .18);
      graphics.strokeRoundedRect(room.x + 5, room.y + 5, Math.max(1, room.w - 10), Math.max(1, room.h - 10), 6);
    }
  };

  sync();
  const interval = window.setInterval(sync, 250);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.clearInterval(interval);
  };
  game.events?.once?.('destroy', dispose);
  window.addEventListener('beforeunload', dispose, { once: true });
  return dispose;
}
