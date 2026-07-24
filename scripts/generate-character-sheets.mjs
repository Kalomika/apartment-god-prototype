// Generate the Phaser character sheet SVGs from the modular character system.
// Layout expected by phaserCharacterAnimationSystem.js: 512x512, a 4x4 grid of 128px cells,
// rows = [south, west, east, north], columns 0..3 = walk-cycle frames (frame 1 = passing/idle).
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { characterMarkup } from '../src/character/modularCharacter.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROWS = ['south','west','east','north'];

// Appearances must match the actors (resident / girlfriend / lab subject).
const SHEETS = {
  'assets/sprites/characters/resident/resident_8fps_sheet.svg': {
    build:'male', skin:'tan', hairStyle:'short', hairColor:'black', facialHair:'stubble',
    top:'tee', topColor:'slate', bottom:'pants', bottomColor:'charcoal', shoes:'sneakers', shoesColor:'white'
  },
  'assets/sprites/characters/girlfriend/girlfriend_8fps_sheet.svg': {
    build:'female', skin:'light', hairStyle:'ponytail', hairColor:'auburn',
    top:'tee', topColor:'crimson', bottom:'skirt', bottomColor:'black', shoes:'flats', shoesColor:'red', baseColor:'crimson'
  },
  'assets/sprites/characters/lab_test_subject/lab_subject_8fps_sheet.svg': {
    build:'male', skin:'brown', hairStyle:'buzz', hairColor:'black', facialHair:'goatee',
    top:'tank', topColor:'mustard', bottom:'shorts', bottomColor:'denim', shoes:'sneakers', shoesColor:'white'
  }
};

function buildSheet(appearance){
  let cells = '';
  ROWS.forEach((dir, row) => {
    for(let col=0; col<4; col++){
      const { content } = characterMarkup(appearance, dir, 'walk', col);
      // 64-space character -> 128 cell (scale 2), nudged up so the feet sit near the sprite origin
      cells += `<g transform="translate(${col*128} ${row*128 - 6}) scale(2)">${content}</g>`;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${cells}</svg>`;
}

for(const [rel, appearance] of Object.entries(SHEETS)){
  const svg = buildSheet(appearance);
  writeFileSync(join(root, rel), svg);
  console.log('wrote', rel, svg.length + 'b');
}
console.log('character sheets generated from modular system.');
