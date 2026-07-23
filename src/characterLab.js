// Character Lab — standalone preview of the modular top-down character. Does NOT touch game runtime.
import { buildCharacterSVG, DIRECTIONS, POSES, DEFAULT_APPEARANCE } from './character/modularCharacter.js';

const root = document.getElementById('lab');
function cell(svg,label){ const d=document.createElement('div'); d.className='cell'; d.innerHTML=`<div class="art">${svg}</div><div class="lbl">${label}</div>`; return d; }
function section(title,note){ const h=document.createElement('h2'); h.textContent=title; root.appendChild(h);
  if(note){ const p=document.createElement('p'); p.className='note'; p.textContent=note; root.appendChild(p); }
  const g=document.createElement('div'); g.className='grid'; root.appendChild(g); return g; }

// 1) 8 directions
const g1=section('8 directions (idle) — required for all characters');
for(const d of DIRECTIONS) g1.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE,d,'idle',104),d));

// 2) Pose states
const g2=section('Pose / activity states (south)');
for(const p of POSES) g2.appendChild(cell(buildCharacterSVG(DEFAULT_APPEARANCE,'south',p,104),p));

// 3) Base underwear layer (never nude) — swim/shower ready
const g3=section('Base body layer (never nude) — swim / shower / undressed states',
  'Clothing is optional over an always-present base. Male = briefs (+socks); female = sports two-piece.');
g3.appendChild(cell(buildCharacterSVG({build:'male',skin:'tan',hairStyle:'short',hairColor:'black',top:'none',bottom:'none',socks:'white',shoes:'none',baseColor:'charcoal'},'south','idle',104),'male base (briefs+socks)'));
g3.appendChild(cell(buildCharacterSVG({build:'female',skin:'light',hairStyle:'ponytail',hairColor:'auburn',top:'none',bottom:'none',shoes:'none',baseColor:'crimson'},'south','idle',104),'female base (two-piece)'));
g3.appendChild(cell(buildCharacterSVG({build:'male',skin:'brown',hairStyle:'short',hairColor:'black',facialHair:'beard',top:'none',bottom:'shorts',bottomColor:'denim',shoes:'none',baseColor:'black'},'south','idle',104),'+ swim shorts'));

// 4) Facial hair (faceless otherwise)
const g4=section('Faceless + facial hair only (small-scale rotoscope look)');
for(const fh of ['none','stubble','mustache','goatee','beard'])
  g4.appendChild(cell(buildCharacterSVG({build:'male',skin:'tan',hairStyle:'short',hairColor:'brown',facialHair:fh,top:'tee',topColor:'slate'},'south','idle',104),fh));

// 5) Wardrobe swaps over base
const outfits=[
  {name:'Resident',a:DEFAULT_APPEARANCE},
  {name:'Hoodie / denim / boots',a:{build:'male',skin:'light',hairStyle:'short',hairColor:'brown',facialHair:'stubble',top:'hoodie',topColor:'noir',bottom:'pants',bottomColor:'denim',socks:'black',shoes:'boots',shoesColor:'black'}},
  {name:'Girlfriend — ponytail / skirt',a:{build:'female',skin:'light',hairStyle:'ponytail',hairColor:'auburn',top:'tee',topColor:'crimson',bottom:'skirt',bottomColor:'black',shoes:'flats',shoesColor:'red',baseColor:'crimson'}},
  {name:'Tank / shorts',a:{build:'male',skin:'brown',hairStyle:'buzz',hairColor:'black',facialHair:'goatee',top:'tank',topColor:'mustard',bottom:'shorts',bottomColor:'khaki',shoes:'sneakers',shoesColor:'white'}},
  {name:'Jacket / long teal hair',a:{build:'female',skin:'deep',hairStyle:'long',hairColor:'teal',top:'jacket',topColor:'violet',bottom:'pants',bottomColor:'charcoal',shoes:'sneakers',shoesColor:'white',baseColor:'violet'}}
];
const g5=section('Wardrobe swaps over base (Fire Pro-style layering)');
for(const o of outfits) g5.appendChild(cell(buildCharacterSVG(o.a,'south','idle',104),o.name));

// 6) Render modes (Blade Runner noir + B&W outline concept)
const g6=section('Render modes — color / noir (Blade Runner) / B&W outline (race-neutral fallback)');
const sample={build:'male',skin:'tan',hairStyle:'short',hairColor:'black',facialHair:'stubble',top:'jacket',topColor:'slate',bottom:'pants',bottomColor:'denim',shoes:'boots',shoesColor:'black'};
for(const mode of ['color','noir','lineart']) g6.appendChild(cell(buildCharacterSVG({...sample,mode},'south','idle',104),mode));
