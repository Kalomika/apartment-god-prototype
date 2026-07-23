// Bridge: render live game actors with the modular character system.
// Rasterizes modular character SVGs to cached images and draws them at the actor's canvas origin.
// Designed to be called from renderEntities.js behind a safe fallback — if a sprite isn't ready or
// anything throws, the caller falls back to the original procedural renderer, so boot never breaks.
import { characterDataUri } from './modularCharacter.js';

const RASTER = 256;   // offscreen raster resolution (crisp)
const DISPLAY = 62;   // on-canvas draw size (px), tuned so feet/shadow sit at the actor origin
const cache = new Map();

// actor.id -> appearance record (flat anime cel look; single soft shadow comes from the SVG itself)
function appearanceFor(actor, female) {
  switch (actor.id) {
    case 'girlfriend':
      return { build:'female', skin:'light', hairStyle:'ponytail', hairColor:'auburn',
               top:'tee', topColor:'crimson', bottom:'skirt', bottomColor:'black',
               shoes:'flats', shoesColor:'red', baseColor:'crimson' };
    case 'lab_test_woman':
      return { build:'female', skin:'tan', hairStyle:'bob', hairColor:'teal',
               top:'tank', topColor:'forest', bottom:'shorts', bottomColor:'khaki',
               shoes:'sneakers', shoesColor:'white', baseColor:'teal' };
    case 'lab_test_subject':
      return { build:'male', skin:'brown', hairStyle:'buzz', hairColor:'black', facialHair:'goatee',
               top:'tank', topColor:'mustard', bottom:'shorts', bottomColor:'denim',
               shoes:'sneakers', shoesColor:'white' };
    default: // resident + fallback
      return female
        ? { build:'female', skin:'tan', hairStyle:'long', hairColor:'brown',
            top:'tee', topColor:'violet', bottom:'pants', bottomColor:'charcoal', shoes:'flats', shoesColor:'tan', baseColor:'violet' }
        : { build:'male', skin:'tan', hairStyle:'short', hairColor:'black', facialHair:'stubble',
            top:'tee', topColor:'slate', bottom:'pants', bottomColor:'charcoal', shoes:'sneakers', shoesColor:'white' };
  }
}

const DIR8 = ['east','southeast','south','southwest','west','northwest','north','northeast'];
function directionFor(actor) {
  let dx = actor.vx || (actor.target ? actor.target.x - actor.x : 0);
  let dy = actor.vy || (actor.target ? actor.target.y - actor.y : 0);
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return actor._modularDir || 'south';
  const idx = ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8;
  const d = DIR8[idx];
  actor._modularDir = d;
  return d;
}

function poseFor(actor, key, moving) {
  if (moving) return 'walk';
  if (/sleep|nap|bed together|king bed|waking/.test(key)) return 'sleep';
  if (/desk|study|computer|laptop|work|type/.test(key)) return 'computer';
  if (/yoga|stretch/.test(key)) return 'yoga';
  if (/couch|sofa|watch|tv|read|eat|table|toilet|sit|seat|study|book/.test(key)) return 'sit';
  return 'idle';
}

function sprite(appearance, dir, pose) {
  const k = appearance._k + '|' + dir + '|' + pose;
  let e = cache.get(k);
  if (!e) {
    e = { ready: false, img: (typeof Image !== 'undefined' ? new Image() : null) };
    if (e.img) {
      e.img.onload = () => { e.ready = true; };
      e.img.onerror = () => { e.ready = false; e.failed = true; };
      e.img.src = characterDataUri(appearance, dir, pose, RASTER);
    }
    cache.set(k, e);
  }
  return e;
}

/**
 * Draw an actor with the modular character. Returns true if it drew a ready sprite,
 * false if the caller should fall back to the procedural renderer.
 * Caller has already translated ctx to the actor origin (unrotated).
 */
export function drawModularActor(ctx, actor, female, key, moving) {
  const ap = appearanceFor(actor, female);
  ap._k = actor.id + (female ? 'F' : 'M');
  const dir = directionFor(actor);
  const pose = poseFor(actor, key, moving);
  const e = sprite(ap, dir, pose);
  if (!e || !e.ready) return false;
  ctx.drawImage(e.img, -DISPLAY / 2, 6 - 52 * DISPLAY / 64, DISPLAY, DISPLAY);
  return true;
}

// Optional: pre-warm common sprites so first frames aren't blank (best-effort, browser only).
export function prewarmModularActors() {
  if (typeof Image === 'undefined') return;
  const ids = [{ id:'resident' }, { id:'girlfriend' }];
  for (const a of ids) {
    const ap = appearanceFor(a, a.id === 'girlfriend');
    ap._k = a.id + (a.id === 'girlfriend' ? 'F' : 'M');
    for (const d of ['south','north','east','west']) for (const p of ['idle','walk']) sprite(ap, d, p);
  }
}
