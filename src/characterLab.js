// Character Lab — standalone preview of the modular top-down character.
// Renders directions x poses and a wardrobe-swap row. Does NOT touch the game runtime.
import {
  buildCharacterSVG, DIRECTIONS, POSES, DEFAULT_APPEARANCE
} from './character/modularCharacter.js';

const root = document.getElementById('lab');

function cell(svg, label) {
  const d = document.createElement('div');
  d.className = 'cell';
  d.innerHTML = `<div class="art">${svg}</div><div class="lbl">${label}</div>`;
  return d;
}

function section(title) {
  const h = document.createElement('h2');
  h.textContent = title;
  root.appendChild(h);
  const grid = document.createElement('div');
  grid.className = 'grid';
  root.appendChild(grid);
  return grid;
}

// 1) Directions (idle) — base figure readability from every facing
const g1 = section('Base figure — 4 directions (idle)');
for (const dir of DIRECTIONS) {
  g1.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE, dir, 'idle', 110), dir));
}

// 2) Pose states (facing south) — activity identities
const g2 = section('Pose states (south) — activity identities');
for (const pose of POSES) {
  g2.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE, 'south', pose, 110), pose));
}

// 3) Walk cycle frames
const g3 = section('Walk cycle (south) — frames');
g3.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE, 'south', 'idle', 110), 'frame 0 (idle)'));
g3.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE, 'south', 'walk', 110), 'frame 1 (stride)'));

// 4) Wardrobe swaps — SAME base body, different swappable parts
const outfits = [
  { name: 'Resident (default)', a: DEFAULT_APPEARANCE },
  { name: 'Hoodie / denim / black boots', a: { skin:'light', hairStyle:'short', hairColor:'brown', top:'hoodie', topColor:'slate', bottom:'pants', bottomColor:'denim', shoes:'boots', shoesColor:'black' } },
  { name: 'Girlfriend — ponytail / skirt / flats', a: { skin:'light', hairStyle:'ponytail', hairColor:'auburn', top:'tee', topColor:'crimson', bottom:'skirt', bottomColor:'black', shoes:'flats', shoesColor:'red' } },
  { name: 'Tank / shorts / sneakers', a: { skin:'brown', hairStyle:'buzz', hairColor:'black', top:'tank', topColor:'mustard', bottom:'shorts', bottomColor:'khaki', shoes:'sneakers', shoesColor:'white' } },
  { name: 'Jacket / long hair / teal', a: { skin:'deep', hairStyle:'long', hairColor:'teal', top:'jacket', topColor:'violet', bottom:'pants', bottomColor:'charcoal', shoes:'sneakers', shoesColor:'white' } },
  { name: 'Bob / cream tee / tan flats', a: { skin:'tan', hairStyle:'bob', hairColor:'blonde', top:'tee', topColor:'cream', bottom:'pants', bottomColor:'khaki', shoes:'flats', shoesColor:'tan' } }
];
const g4 = section('Wardrobe swaps — same rig, swappable hair / top / bottom / shoes / skin');
for (const o of outfits) {
  g4.appendChild(cell(buildCharacterSVG(o.a, 'south', 'idle', 110), o.name));
}
