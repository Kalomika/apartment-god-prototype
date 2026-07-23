// Modular top-down character system (proving slice).
//
// Design goals (per Apartment God visual standard + Kam's swappable-parts requirement):
//  - TRUE top-down readable human anatomy (head+hair, shoulders, arms, torso, legs/feet)
//  - LAYERED, data-driven parts so clothes / hair / shoes / skin swap at runtime:
//        shadow -> legs(skin) -> shoes -> bottom(pants/skirt) -> torso(top) -> arms -> head(skin) -> hair
//  - Directional (south/north/east/west) + pose states (idle, walk, sit, sleep, computer)
//  - Pure functions returning SVG markup. No side effects, no runtime coupling.
//  - Safe fallback: unknown pose/direction degrades to idle/south instead of throwing.
//
// This is NOT a procedural blob: every part is authored anatomy with a defined silhouette,
// and appearance is a swappable data record. First-pass interpretation, meant to be iterated.

export const SKIN_TONES = {
  light: '#f2c9a6', tan: '#d69f74', brown: '#a56a43', deep: '#6b4326'
};

export const HAIR_STYLES = ['short', 'bob', 'ponytail', 'buzz', 'long'];
export const HAIR_COLORS = {
  black: '#211c24', brown: '#4d3524', blonde: '#c9a24b', auburn: '#7a3520',
  ash: '#8a8f99', teal: '#2f6f6a'
};

export const TOP_STYLES = ['tee', 'jacket', 'hoodie', 'tank'];
export const BOTTOM_STYLES = ['pants', 'shorts', 'skirt'];
export const SHOE_STYLES = ['sneakers', 'boots', 'flats'];

export const PALETTE = {
  tops:    { slate:'#3d4655', crimson:'#8f2f38', forest:'#37613f', mustard:'#c8912f', violet:'#5b4a86', cream:'#e7ddc7' },
  bottoms: { charcoal:'#2c313c', denim:'#3b5168', khaki:'#9d8455', black:'#1c1f27' },
  shoes:   { white:'#e9e6df', black:'#20232b', red:'#9d3030', tan:'#8a6a44' }
};

export const DEFAULT_APPEARANCE = {
  skin: 'tan',
  hairStyle: 'short', hairColor: 'black',
  top: 'tee', topColor: 'slate',
  bottom: 'pants', bottomColor: 'charcoal',
  shoes: 'sneakers', shoesColor: 'white'
};

export const DIRECTIONS = ['south', 'north', 'east', 'west'];
export const POSES = ['idle', 'walk', 'sit', 'sleep', 'computer'];

const clampChoice = (val, list, fallback) => (list.includes(val) ? val : fallback);

function resolveAppearance(a = {}) {
  const m = { ...DEFAULT_APPEARANCE, ...a };
  return {
    skinHex: SKIN_TONES[m.skin] || SKIN_TONES.tan,
    hairStyle: clampChoice(m.hairStyle, HAIR_STYLES, 'short'),
    hairHex: HAIR_COLORS[m.hairColor] || HAIR_COLORS.black,
    top: clampChoice(m.top, TOP_STYLES, 'tee'),
    topHex: PALETTE.tops[m.topColor] || PALETTE.tops.slate,
    bottom: clampChoice(m.bottom, BOTTOM_STYLES, 'pants'),
    bottomHex: PALETTE.bottoms[m.bottomColor] || PALETTE.bottoms.charcoal,
    shoes: clampChoice(m.shoes, SHOE_STYLES, 'sneakers'),
    shoesHex: PALETTE.shoes[m.shoesColor] || PALETTE.shoes.white
  };
}

// ---- part builders (all in a 64x64 viewbox, character centered ~32,32) ----
// Each returns an SVG fragment string. Limb positions come from a `rig` computed per pose.

function shadow() {
  return `<ellipse cx="32" cy="55" rx="15" ry="5" fill="rgba(0,0,0,0.20)"/>`;
}

function legPart(rig, ap) {
  // upper legs (skin peeking is minimal in true top-down; mostly covered by bottom)
  const { legs } = rig;
  return legs.map(l =>
    `<rect x="${l.x - 3.2}" y="${l.y}" width="6.4" height="${l.len}" rx="3" fill="${ap.skinHex}" opacity="0.0"/>`
  ).join('');
}

function shoePart(rig, ap) {
  const { legs } = rig;
  const shape = ap.shoes === 'boots' ? 4.6 : ap.shoes === 'flats' ? 3.2 : 4.0;
  return legs.map(l =>
    `<rect x="${l.x - 3.2}" y="${l.y + l.len - 2}" width="6.4" height="${shape}" rx="2.4" fill="${ap.shoesHex}" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>`
  ).join('');
}

function bottomPart(rig, ap) {
  const { hip } = rig;
  const skirt = ap.bottom === 'skirt';
  if (skirt) {
    return `<path d="M ${hip.x - hip.w/2 - 2} ${hip.y} Q 32 ${hip.y + hip.h + 5} ${hip.x + hip.w/2 + 2} ${hip.y} Z" fill="${ap.bottomHex}"/>`;
  }
  const legLen = ap.bottom === 'shorts' ? hip.h * 0.55 : hip.h;
  return `<rect x="${hip.x - hip.w/2}" y="${hip.y}" width="${hip.w}" height="${legLen}" rx="3.5" fill="${ap.bottomHex}"/>`;
}

function torsoPart(rig, ap) {
  const { torso } = rig;
  // rounded shoulder trapezoid narrowing to waist
  const sw = torso.shoulderW, ww = torso.waistW, t = torso.y, b = torso.y + torso.h;
  let body = `<path d="M ${32 - sw/2} ${t + 3}
      Q ${32 - sw/2 - 2} ${t} 32 ${t}
      Q ${32 + sw/2 + 2} ${t} ${32 + sw/2} ${t + 3}
      L ${32 + ww/2} ${b}
      Q 32 ${b + 2.5} ${32 - ww/2} ${b} Z"
      fill="${ap.topHex}" stroke="rgba(0,0,0,0.18)" stroke-width="0.6"/>`;
  // simple garment accents
  if (ap.top === 'hoodie') {
    body += `<ellipse cx="32" cy="${t + 2}" rx="5" ry="3" fill="rgba(0,0,0,0.22)"/>`; // hood
    body += `<rect x="31.2" y="${t + 4}" width="1.6" height="${torso.h - 6}" fill="rgba(0,0,0,0.18)"/>`; // zipper
  } else if (ap.top === 'jacket') {
    body += `<rect x="31.4" y="${t + 3}" width="1.2" height="${torso.h - 4}" fill="rgba(0,0,0,0.28)"/>`;
  } else if (ap.top === 'tank') {
    body += `<path d="M ${32 - sw/4} ${t + 2} L ${32 - sw/6} ${t + torso.h*0.5}
             M ${32 + sw/4} ${t + 2} L ${32 + sw/6} ${t + torso.h*0.5}"
             stroke="${ap.skinHex}" stroke-width="2.4"/>`;
  }
  return body;
}

function armsPart(rig, ap) {
  const { arms } = rig;
  const sleeve = ap.top === 'tank' ? ap.skinHex : ap.topHex;
  return arms.map(arm => {
    // upper arm (sleeve color) + hand (skin)
    return `<g>
      <rect x="${arm.x - 2.4}" y="${arm.y}" width="4.8" height="${arm.len}" rx="2.4"
            fill="${sleeve}" transform="rotate(${arm.rot} ${arm.x} ${arm.y})"/>
      <circle cx="${arm.hx}" cy="${arm.hy}" r="2.6" fill="${ap.skinHex}"/>
    </g>`;
  }).join('');
}

// facing offset for the head/face cue (adult proportion: head is small)
const HEAD_RX = 7, HEAD_RY = 7.5;
function faceOffset(dir) {
  return { south:{x:0,y:2.4}, north:{x:0,y:0}, east:{x:3.2,y:0.6}, west:{x:-3.2,y:0.6} }[dir] || {x:0,y:2.4};
}

function headPart(rig, ap, dir) {
  const { head } = rig;
  const skin = ap.skinHex;
  let g = `<ellipse cx="32" cy="${head.y}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="${skin}"/>`;
  const f = faceOffset(dir);
  // face is only drawn where it would be visible (not from directly behind = north)
  if (dir !== 'north') {
    const fx = 32 + f.x, fy = head.y + f.y;
    if (dir === 'south') {
      g += `<circle cx="${fx-2.2}" cy="${fy}" r="0.8" fill="rgba(30,20,20,0.7)"/>`;
      g += `<circle cx="${fx+2.2}" cy="${fy}" r="0.8" fill="rgba(30,20,20,0.7)"/>`;
    } else {
      // profile-ish single eye + a small nose nub pointing the facing way
      g += `<circle cx="${fx}" cy="${fy-0.5}" r="0.85" fill="rgba(30,20,20,0.7)"/>`;
      g += `<circle cx="${32 + f.x*1.35}" cy="${head.y + 1.2}" r="1.4" fill="${skin}"/>`; // nose/brow nub
    }
  }
  return g;
}

function hairPart(rig, ap, dir) {
  const { head } = rig;
  const c = ap.hairHex;
  const y = head.y, f = faceOffset(dir);
  // hair sits on the crown; for south a fringe rings the face, for north it covers fully
  const crownCx = 32 - f.x * 0.5;
  const cap = (rx, ry) => `<ellipse cx="${crownCx}" cy="${y - 0.6}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
  // fringe: a partial ring that recedes toward the facing side (so the face shows through)
  const fringe = dir === 'north'
    ? cap(HEAD_RX + 1.2, HEAD_RY + 1.2)
    : `<path d="M ${32 - HEAD_RX - 1} ${y + 1} Q 32 ${y - HEAD_RY - 2} ${32 + HEAD_RX + 1} ${y + 1}
         L ${32 + HEAD_RX + 1} ${y - 1} Q 32 ${y - HEAD_RY - 3} ${32 - HEAD_RX - 1} ${y - 1} Z" fill="${c}"/>`;
  // ponytail = soft rounded hair mass gathered at the back of the crown (never a stiff antenna)
  const tail = () => {
    const ty = dir === 'south' ? y - HEAD_RY - 2.5 : y + HEAD_RY + 1.5; // back of head relative to facing
    return `<ellipse cx="${crownCx}" cy="${ty}" rx="3.4" ry="4.2" fill="${c}"/>`;
  };
  const styles = {
    short:    cap(HEAD_RX + 0.8, HEAD_RY + 0.8) + fringe,
    buzz:     cap(HEAD_RX + 0.3, HEAD_RY + 0.3),
    bob:      cap(HEAD_RX + 1.6, HEAD_RY + 1.6) + `<path d="M ${crownCx-HEAD_RX-1.6} ${y} Q ${crownCx-HEAD_RX-1.6} ${y+7} ${crownCx-HEAD_RX+2} ${y+8} L ${crownCx+HEAD_RX-2} ${y+8} Q ${crownCx+HEAD_RX+1.6} ${y+7} ${crownCx+HEAD_RX+1.6} ${y} Z" fill="${c}"/>`,
    ponytail: cap(HEAD_RX + 0.8, HEAD_RY + 0.8) + fringe + tail(),
    long:     cap(HEAD_RX + 1.2, HEAD_RY + 1.2) + `<path d="M ${crownCx-HEAD_RX-1.4} ${y} Q ${crownCx-2} ${y+15} ${crownCx} ${y+16} Q ${crownCx+2} ${y+15} ${crownCx+HEAD_RX+1.4} ${y} Z" fill="${c}"/>`
  };
  return styles[ap.hairStyle] || styles.short;
}

// ---- rig (limb geometry) per pose ----
function buildRig(pose) {
  // baseline standing rig — adult proportions (small head, broad shoulders)
  const rig = {
    head:  { y: 21 },
    torso: { y: 27, h: 19, shoulderW: 25, waistW: 18 },
    hip:   { x: 32, y: 45, w: 16, h: 12 },
    legs:  [ { x: 27.5, y: 45, len: 13 }, { x: 36.5, y: 45, len: 13 } ],
    arms:  [ { x: 21, y: 30, len: 15, rot: 6, hx: 20, hy: 45 },
             { x: 43, y: 30, len: 15, rot: -6, hx: 44, hy: 45 } ]
  };
  switch (pose) {
    case 'walk':
      rig.legs = [ { x: 27, y: 44, len: 15 }, { x: 37, y: 44, len: 11 } ]; // stride
      rig.arms = [ { x: 22, y: 32, len: 13, rot: 20, hx: 20, hy: 46 },
                   { x: 42, y: 32, len: 13, rot: -20, hx: 44, hy: 44 } ];
      break;
    case 'sit':
      rig.legs = [ { x: 27, y: 43, len: 8 }, { x: 37, y: 43, len: 8 } ]; // knees up/short
      rig.hip.h = 9;
      rig.arms = [ { x: 23, y: 33, len: 10, rot: 30, hx: 26, hy: 44 },
                   { x: 41, y: 33, len: 10, rot: -30, hx: 38, hy: 44 } ];
      break;
    case 'sleep':
      rig.head.y = 20; rig.torso.h = 16; rig.torso.waistW = 18;
      rig.legs = [ { x: 28, y: 45, len: 15 }, { x: 36, y: 45, len: 15 } ];
      rig.arms = [ { x: 21, y: 33, len: 12, rot: -10, hx: 20, hy: 33 },
                   { x: 43, y: 33, len: 12, rot: 10, hx: 44, hy: 33 } ]; // arms up-ish
      break;
    case 'computer':
      rig.arms = [ { x: 24, y: 34, len: 11, rot: 55, hx: 30, hy: 43 },
                   { x: 40, y: 34, len: 11, rot: -55, hx: 34, hy: 43 } ]; // hands forward to desk
      rig.legs = [ { x: 27, y: 44, len: 9 }, { x: 37, y: 44, len: 9 } ];
      break;
    case 'idle':
    default:
      break;
  }
  return rig;
}

/**
 * Build a full modular character as an SVG string.
 * @param {object} appearance - swappable parts record (see DEFAULT_APPEARANCE)
 * @param {string} direction  - 'south'|'north'|'east'|'west' (fallback south)
 * @param {string} pose       - POSES (fallback idle)
 * @param {number} size       - output px (viewBox is 64)
 */
export function buildCharacterSVG(appearance = {}, direction = 'south', pose = 'idle', size = 96) {
  const dir = clampChoice(direction, DIRECTIONS, 'south');
  const p = clampChoice(pose, POSES, 'idle');
  const ap = resolveAppearance(appearance);
  const rig = buildRig(p);

  // Facing is authored (head/face cue + arm asymmetry), NOT a naive full-body rotation,
  // so E/W/N read as "standing, facing X" rather than "lying down".
  if (dir === 'east') { rig.arms[1].len += 2; rig.arms[1].hy -= 3; rig.arms[0].hy += 1; }
  else if (dir === 'west') { rig.arms[0].len += 2; rig.arms[0].hy -= 3; rig.arms[1].hy += 1; }

  const inner = [
    shadow(),
    legPart(rig, ap),
    shoePart(rig, ap),
    bottomPart(rig, ap),
    torsoPart(rig, ap),
    armsPart(rig, ap),
    headPart(rig, ap, dir),
    hairPart(rig, ap, dir)
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${inner}</svg>`;
}

/** Convenience: data-URI for <img src> or Phaser load.svg. */
export function characterDataUri(appearance, direction, pose, size) {
  const svg = buildCharacterSVG(appearance, direction, pose, size);
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
