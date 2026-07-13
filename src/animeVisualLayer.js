import { getAnimeVisualAsset } from './animeVisualAssets.js';

const GARAGE_ROOM = Object.freeze({ x: 24, y: 36, w: 912, h: 648 });

export function drawAnimeEnvironmentUnderlay(ctx, state) {
  if (state.floor !== 3) return false;
  const image = getAnimeVisualAsset('garageFloor');
  if (!image) return false;

  const inset = 12;
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    GARAGE_ROOM.x + inset,
    GARAGE_ROOM.y + inset,
    GARAGE_ROOM.w - inset * 2,
    GARAGE_ROOM.h - inset * 2
  );
  ctx.clip();
  ctx.globalAlpha = state.roomLights?.garage === false ? 0.58 : 0.88;
  ctx.drawImage(
    image,
    GARAGE_ROOM.x + inset,
    GARAGE_ROOM.y + inset,
    GARAGE_ROOM.w - inset * 2,
    GARAGE_ROOM.h - inset * 2
  );
  ctx.restore();
  return true;
}
