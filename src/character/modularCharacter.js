// Modular top-down character system — Fire Pro-style layered, swappable-part sprite.
//
// Direction (per Kam, 2026-07-23):
//  - 8 facing directions (S, SE, E, NE, N, NW, W, SW) for ALL current + future characters.
//  - FACELESS sprites (small-scale, late-'80s/early-'90s rotoscope look à la Flashback / Out of This
//    World; 80s/90s anime + Blade Runner noir). The only facial detail allowed is facial hair
//    (stubble / mustache / goatee / beard). No eyes/nose/mouth.
//  - Deep layering like Fire Pro Wrestling: every part is its own swappable layer over a BASE BODY.
//  - BASE UNDERWEAR LAYER always present so a character is never fully nude: male = briefs (+ optional
//    socks) over bare chest; female = sports two-piece. Clothing layers draw OVER the base, so swim /
//    shower / undressed states are covered by design.
//  - Render modes: 'color' (default), 'noir' (desaturated Blade Runner mood), 'lineart' (B&W concept).
//
// Pure functions -> SVG string. No runtime coupling. Safe fallbacks for unknown values.
// First-pass interpretation, iterated with Kam.

let __uid = 0;

export const SKIN_TONES = { light:'#e9c3a0', tan:'#cf9a6d', brown:'#9c6238', deep:'#5f3b23' };
export const HAIR_STYLES = ['short','buzz','bob','ponytail','long','bald'];
export const HAIR_COLORS = { black:'#1d1a20', brown:'#402c1e', blonde:'#c2a049', auburn:'#722f1c', ash:'#7f858f', teal:'#2c6560', magenta:'#8d2f63' };
export const FACIAL_HAIR = ['none','stubble','mustache','goatee','beard'];
export const BUILDS = ['male','female'];

export const TOP_STYLES = ['none','tee','jacket','hoodie','tank'];
export const BOTTOM_STYLES = ['none','pants','shorts','skirt'];
export const SHOE_STYLES = ['none','sneakers','boots','flats'];

export const PALETTE = {
  base:    { charcoal:'#2b2f38', crimson:'#7c2b33', teal:'#2b5f5c', violet:'#4a3d6b', black:'#191b21' },
  tops:    { slate:'#3a4353', crimson:'#8a2f37', forest:'#345c3c', mustard:'#bf8a2e', violet:'#564785', cream:'#ddd2b8', noir:'#20242e' },
  bottoms: { charcoal:'#282d37', denim:'#374d63', khaki:'#8f7a4e', black:'#181b22' },
  shoes:   { white:'#e2ddd2', black:'#1d2027', red:'#8f2c2c', tan:'#7f6240' },
  socks:   { none:null, white:'#d8d3c6', black:'#22252d', gray:'#6b7079' }
};

export const DEFAULT_APPEARANCE = {
  build:'male', skin:'tan',
  hairStyle:'short', hairColor:'black', facialHair:'none',
  baseColor:'charcoal',            // briefs / sports two-piece color
  top:'tee', topColor:'slate',
  bottom:'pants', bottomColor:'charcoal',
  socks:'none', shoes:'sneakers', shoesColor:'white',
  mode:'color'
};

// 8 compass directions with screen-space facing vectors (y down). South faces the viewer.
export const DIRECTIONS = ['south','southeast','east','northeast','north','northwest','west','southwest'];
const FACE_VEC = {
  south:[0,1], southeast:[0.7,0.7], east:[1,0], northeast:[0.7,-0.7],
  north:[0,-1], northwest:[-0.7,-0.7], west:[-1,0], southwest:[-0.7,0.7]
};
export const POSES = ['idle','walk','sit','sleep','computer','yoga'];

const pick = (v,list,fb)=> list.includes(v)?v:fb;

function resolve(a={}){
  const m = { ...DEFAULT_APPEARANCE, ...a };
  return {
    build: pick(m.build,BUILDS,'male'),
    skinHex: SKIN_TONES[m.skin]||SKIN_TONES.tan,
    hairStyle: pick(m.hairStyle,HAIR_STYLES,'short'),
    hairHex: HAIR_COLORS[m.hairColor]||HAIR_COLORS.black,
    facialHair: pick(m.facialHair,FACIAL_HAIR,'none'),
    baseHex: PALETTE.base[m.baseColor]||PALETTE.base.charcoal,
    top: pick(m.top,TOP_STYLES,'tee'),
    topHex: PALETTE.tops[m.topColor]||PALETTE.tops.slate,
    bottom: pick(m.bottom,BOTTOM_STYLES,'pants'),
    bottomHex: PALETTE.bottoms[m.bottomColor]||PALETTE.bottoms.charcoal,
    socksHex: PALETTE.socks[m.socks]||null,
    shoes: pick(m.shoes,SHOE_STYLES,'sneakers'),
    shoesHex: PALETTE.shoes[m.shoesColor]||PALETTE.shoes.white,
    mode: pick(m.mode,['color','noir','lineart'],'color')
  };
}

// ---------- geometry per pose ----------
const HEAD_RX=6.6, HEAD_RY=7.2;
function buildRig(pose){
  const rig = {
    headY:21, torso:{y:27,h:19,shoulderW:25,waistW:18}, hip:{y:45,w:16,h:12},
    legs:[{x:27.5,y:45,len:13},{x:36.5,y:45,len:13}],
    arms:[{x:20.5,y:30,len:15,rot:6,hx:20,hy:45},{x:43.5,y:30,len:15,rot:-6,hx:44,hy:45}]
  };
  switch(pose){
    case 'walk':
      rig.legs=[{x:27.5,y:45,len:15},{x:36.5,y:45,len:11}];
      rig.arms=[{x:20.5,y:30,len:15,rot:20,hx:19,hy:46},{x:43.5,y:30,len:15,rot:-20,hx:45,hy:44}]; break;
    case 'sit':
      rig.legs=[{x:27.5,y:44,len:8},{x:36.5,y:44,len:8}]; rig.hip.h=9;
      rig.arms=[{x:22,y:31,len:11,rot:30,hx:26,hy:44},{x:42,y:31,len:11,rot:-30,hx:38,hy:44}]; break;
    case 'sleep':
      rig.headY=20; rig.torso.h=16; rig.torso.waistW=19; rig.hip.h=13;
      rig.legs=[{x:28,y:45,len:15},{x:36,y:45,len:15}];
      rig.arms=[{x:20,y:31,len:12,rot:-12,hx:19,hy:31},{x:44,y:31,len:12,rot:12,hx:45,hy:31}]; break;
    case 'computer':
      rig.legs=[{x:27.5,y:44,len:9},{x:36.5,y:44,len:9}];
      rig.arms=[{x:23,y:32,len:11,rot:55,hx:30,hy:43},{x:41,y:32,len:11,rot:-55,hx:34,hy:43}]; break;
    case 'yoga':
      rig.legs=[{x:24,y:45,len:7},{x:40,y:45,len:7}]; rig.hip.w=20;
      rig.arms=[{x:19,y:33,len:13,rot:70,hx:26,hy:47},{x:45,y:33,len:13,rot:-70,hx:38,hy:47}]; break;
    default: break; // idle
  }
  return rig;
}

// ---------- part builders ----------
function shadow(){ return `<ellipse cx="32" cy="56" rx="14" ry="4.5" fill="rgba(0,0,0,0.22)"/>`; }

function legsBase(rig,ap){ // thighs+calves as skin (Fire Pro: base body always present)
  return rig.legs.map(l=>`<rect x="${l.x-3}" y="${l.y}" width="6" height="${l.len}" rx="3" fill="${ap.skinHex}"/>`).join('');
}
function socksPart(rig,ap){
  if(!ap.socksHex) return '';
  return rig.legs.map(l=>`<rect x="${l.x-3}" y="${l.y+l.len-5}" width="6" height="5" rx="2.4" fill="${ap.socksHex}"/>`).join('');
}
function shoesPart(rig,ap){
  if(ap.shoes==='none') return '';
  const h = ap.shoes==='boots'?5:ap.shoes==='flats'?3:4;
  return rig.legs.map(l=>`<rect x="${l.x-3.2}" y="${l.y+l.len-2}" width="6.4" height="${h}" rx="2.4" fill="${ap.shoesHex}" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>`).join('');
}
function hipsBase(rig,ap){ // briefs (male) / bikini bottom (female) — ALWAYS drawn
  const {hip}=rig, y=hip.y;
  return `<path d="M ${32-hip.w/2} ${y} L ${32+hip.w/2} ${y} L ${32+hip.w/2-1} ${y+6} Q 32 ${y+8} ${32-hip.w/2+1} ${y+6} Z" fill="${ap.baseHex}"/>`;
}
function bottomClothing(rig,ap){
  if(ap.bottom==='none') return '';
  const {hip}=rig,y=hip.y;
  if(ap.bottom==='skirt') return `<path d="M ${32-hip.w/2-2} ${y} Q 32 ${y+hip.h+5} ${32+hip.w/2+2} ${y} Z" fill="${ap.bottomHex}"/>`;
  const len = ap.bottom==='shorts'?hip.h*0.55:hip.h;
  return `<rect x="${32-hip.w/2}" y="${y}" width="${hip.w}" height="${len}" rx="3.5" fill="${ap.bottomHex}"/>`;
}
function torsoBase(rig,ap){ // bare chest (male) / sports bra (female) — ALWAYS
  const t=rig.torso, sw=t.shoulderW, ww=t.waistW, top=t.y, bot=t.y+t.h;
  const shape = (fill)=>`<path d="M ${32-sw/2} ${top+3} Q ${32-sw/2-2} ${top} 32 ${top} Q ${32+sw/2+2} ${top} ${32+sw/2} ${top+3} L ${32+ww/2} ${bot} Q 32 ${bot+2.5} ${32-ww/2} ${bot} Z" fill="${fill}"/>`;
  let g = shape(ap.skinHex);
  if(ap.build==='female'){ // sports two-piece top band
    g += `<path d="M ${32-sw/2+1} ${top+4} L ${32+sw/2-1} ${top+4} L ${32+ww/2} ${top+t.h*0.5} Q 32 ${top+t.h*0.5+2} ${32-ww/2} ${top+t.h*0.5} Z" fill="${ap.baseHex}"/>`;
    g += `<path d="M ${31} ${top+5} Q 32 ${top+8} 33 ${top+5}" stroke="rgba(0,0,0,0.12)" stroke-width="1.4" fill="none"/>`; // subtle bust read (implied, no detail)
  } else {
    g += `<path d="M 30 ${top+5} Q 32 ${top+7} 34 ${top+5}" stroke="rgba(0,0,0,0.10)" stroke-width="1" fill="none"/>`; // pec line
  }
  return g;
}
function topClothing(rig,ap){
  if(ap.top==='none') return '';
  const t=rig.torso, sw=t.shoulderW, ww=t.waistW, top=t.y, bot=t.y+t.h;
  let g = `<path d="M ${32-sw/2} ${top+3} Q ${32-sw/2-2} ${top} 32 ${top} Q ${32+sw/2+2} ${top} ${32+sw/2} ${top+3} L ${32+ww/2} ${bot} Q 32 ${bot+2.5} ${32-ww/2} ${bot} Z" fill="${ap.topHex}" stroke="rgba(0,0,0,0.18)" stroke-width="0.6"/>`;
  if(ap.top==='hoodie'){ g+=`<ellipse cx="32" cy="${top+2}" rx="5" ry="3" fill="rgba(0,0,0,0.22)"/><rect x="31.2" y="${top+4}" width="1.6" height="${t.h-6}" fill="rgba(0,0,0,0.18)"/>`; }
  else if(ap.top==='jacket'){ g+=`<rect x="31.4" y="${top+3}" width="1.2" height="${t.h-4}" fill="rgba(0,0,0,0.28)"/>`; }
  else if(ap.top==='tank'){ g=`<path d="M ${32-sw/3} ${top+2} L ${32-ww/2} ${bot} Q 32 ${bot+2.5} ${32+ww/2} ${bot} L ${32+sw/3} ${top+2} Q 32 ${top+5} ${32-sw/3} ${top+2} Z" fill="${ap.topHex}"/>`; }
  return g;
}
function armsPart(rig,ap){
  const sleeve = ap.top==='none'||ap.top==='tank' ? ap.skinHex : ap.topHex;
  return rig.arms.map(a=>`<g><rect x="${a.x-2.3}" y="${a.y}" width="4.6" height="${a.len}" rx="2.3" fill="${sleeve}" transform="rotate(${a.rot} ${a.x} ${a.y})"/><circle cx="${a.hx}" cy="${a.hy}" r="2.5" fill="${ap.skinHex}"/></g>`).join('');
}
function headPart(rig,ap){ return `<ellipse cx="32" cy="${rig.headY}" rx="${HEAD_RX}" ry="${HEAD_RY}" fill="${ap.skinHex}"/>`; }

function facialHairPart(rig,ap,fv){
  if(ap.facialHair==='none') return '';
  const c = ap.hairHex, y=rig.headY;
  const fx=32+fv[0]*HEAD_RX*0.7, fy=y+fv[1]*HEAD_RY*0.7; // front of head toward facing
  switch(ap.facialHair){
    case 'stubble': return `<ellipse cx="${fx}" cy="${fy}" rx="4" ry="3" fill="${c}" opacity="0.28"/>`;
    case 'mustache': return `<rect x="${fx-2.4}" y="${fy-0.6}" width="4.8" height="1.6" rx="0.8" fill="${c}"/>`;
    case 'goatee': return `<ellipse cx="${fx}" cy="${fy+0.8}" rx="1.8" ry="2.4" fill="${c}"/><rect x="${fx-2.2}" y="${fy-0.8}" width="4.4" height="1.4" rx="0.7" fill="${c}"/>`;
    case 'beard': return `<path d="M ${fx-4.2} ${fy-2} Q ${fx} ${fy+4.5} ${fx+4.2} ${fy-2} Q ${fx} ${fy+1} ${fx-4.2} ${fy-2} Z" fill="${c}"/>`;
    default: return '';
  }
}
function hairPart(rig,ap,fv){
  if(ap.hairStyle==='bald') return '';
  const c=ap.hairHex, y=rig.headY;
  const cap=(rx,ry)=>`<ellipse cx="32" cy="${y-0.6}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
  // hairline recedes toward the facing edge (so the "front" face-area is bare)
  const backX=32-fv[0]*2.4, backY=y-fv[1]*2.4;
  const styles={
    short: cap(HEAD_RX+0.8,HEAD_RY+0.8),
    buzz:  cap(HEAD_RX+0.3,HEAD_RY+0.3),
    bob:   cap(HEAD_RX+1.6,HEAD_RY+1.6),
    ponytail: cap(HEAD_RX+0.8,HEAD_RY+0.8)+`<ellipse cx="${backX}" cy="${backY}" rx="3.2" ry="4" fill="${c}"/>`,
    long:  cap(HEAD_RX+1.1,HEAD_RY+1.1)+`<ellipse cx="${backX}" cy="${backY+1}" rx="4.6" ry="6" fill="${c}"/>`
  };
  // carve the facing side so the face area (front) shows skin (faceless but oriented)
  const carve = `<ellipse cx="${32+fv[0]*4.2}" cy="${y+fv[1]*4.2}" rx="3.6" ry="3.2" fill="${ap.skinHex}"/>`;
  return (styles[ap.hairStyle]||styles.short) + (ap.hairStyle==='buzz'?'':carve);
}

function modeDefs(mode,id){
  if(mode==='noir') return `<defs><filter id="${id}"><feColorMatrix type="saturate" values="0.28"/><feComponentTransfer><feFuncR type="linear" slope="0.8" intercept="-0.02"/><feFuncG type="linear" slope="0.8" intercept="-0.02"/><feFuncB type="linear" slope="0.85" intercept="0.02"/></feComponentTransfer></filter></defs>`;
  if(mode==='lineart') return `<defs><filter id="${id}"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 1"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 1 1"/></feComponentTransfer><feFlood flood-color="#12141a"/><feComposite operator="out" in2="SourceGraphic"/></filter></defs>`;
  return '';
}

/**
 * Build a full modular character as an SVG string.
 * @param {object} appearance @param {string} direction (8-way) @param {string} pose @param {number} size
 */
export function buildCharacterSVG(appearance={},direction='south',pose='idle',size=110){
  const dir=pick(direction,DIRECTIONS,'south');
  const p=pick(pose,POSES,'idle');
  const ap=resolve(appearance);
  const rig=buildRig(p);
  const fv=FACE_VEC[dir];
  // subtle body turn toward facing (small; avoids the "lying down" read of full rotation)
  const skew = fv[0]*12;
  const body=[
    legsBase(rig,ap), socksPart(rig,ap), shoesPart(rig,ap),
    hipsBase(rig,ap), bottomClothing(rig,ap),
    torsoBase(rig,ap), topClothing(rig,ap),
    armsPart(rig,ap),
    headPart(rig,ap), facialHairPart(rig,ap,fv), hairPart(rig,ap,fv)
  ].join('');
  const id='m'+(++__uid);
  const defs=modeDefs(ap.mode,id);
  const filtered = ap.mode==='color' ? `<g transform="rotate(${skew} 32 40)">${body}</g>`
                                     : `<g filter="url(#${id})"><g transform="rotate(${skew} 32 40)">${body}</g></g>`;
  const bg = ap.mode==='lineart' ? '<rect x="0" y="0" width="64" height="64" fill="#f4f1e8"/>' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${defs}${bg}${shadow()}${filtered}</svg>`;
}

export function characterDataUri(a,d,p,s){ return 'data:image/svg+xml;utf8,'+encodeURIComponent(buildCharacterSVG(a,d,p,s)); }
