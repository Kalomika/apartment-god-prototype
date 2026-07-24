// Modular TRUE-TOP-DOWN character — Fire Pro-style layered, swappable-part sprite.
//
// Plan view (camera looks straight DOWN): the head-crown + shoulders dominate the silhouette, the
// body is foreshortened, arms hang at the sides, feet poke out toward the facing direction. The whole
// figure is compact and rotates to face 8 ways — it is NOT a full standing front-view paper-doll
// (that read as "lying on the floor" from a top-down camera). The elongated body is used only for the
// SLEEP pose, where a person really is seen at full length lying in bed.
//
// Direction (Kam, 2026-07-23): 8 facings; FACELESS (facial hair only); deep swappable layering over an
// always-present base body (never nude); flat-anime cel look (ink cut-lines + single-source shade);
// color / noir / lineart render modes. Pure functions -> SVG string. Safe fallbacks. Iterated art.

let __uid = 0;
const INK = '#16181f', SHADE = 'rgba(20,16,26,0.17)';

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
  build:'male', skin:'tan', hairStyle:'short', hairColor:'black', facialHair:'none',
  baseColor:'charcoal', top:'tee', topColor:'slate', bottom:'pants', bottomColor:'charcoal',
  socks:'none', shoes:'sneakers', shoesColor:'white', mode:'color'
};

export const DIRECTIONS = ['south','southeast','east','northeast','north','northwest','west','southwest'];
const FACE_VEC = {
  south:[0,1], southeast:[0.7,0.7], east:[1,0], northeast:[0.7,-0.7],
  north:[0,-1], northwest:[-0.7,-0.7], west:[-1,0], southwest:[-0.7,0.7]
};
export const POSES = ['idle','walk','sit','sleep','computer','yoga'];
const pick = (v,l,f)=> l.includes(v)?v:f;

function resolve(a={}){
  const m = { ...DEFAULT_APPEARANCE, ...a };
  return {
    build:pick(m.build,BUILDS,'male'), skinHex:SKIN_TONES[m.skin]||SKIN_TONES.tan,
    hairStyle:pick(m.hairStyle,HAIR_STYLES,'short'), hairHex:HAIR_COLORS[m.hairColor]||HAIR_COLORS.black,
    facialHair:pick(m.facialHair,FACIAL_HAIR,'none'), baseHex:PALETTE.base[m.baseColor]||PALETTE.base.charcoal,
    top:pick(m.top,TOP_STYLES,'tee'), topHex:PALETTE.tops[m.topColor]||PALETTE.tops.slate,
    bottom:pick(m.bottom,BOTTOM_STYLES,'pants'), bottomHex:PALETTE.bottoms[m.bottomColor]||PALETTE.bottoms.charcoal,
    socksHex:PALETTE.socks[m.socks]||null, shoes:pick(m.shoes,SHOE_STYLES,'sneakers'), shoesHex:PALETTE.shoes[m.shoesColor]||PALETTE.shoes.white,
    mode:pick(m.mode,['color','noir','lineart'],'color')
  };
}

// ===== UPRIGHT top-down rig (base faces SOUTH = forward +y). Center ~ (32,33). =====
// feet poke toward +y (front); shoulders are WIDE in x (perpendicular to facing); head-crown on top.
const HEAD_R = 8;
function uprightRig(pose, phase=0){
  const rig = {
    head:[32,31], shoulder:[32,33.5], shRX:13, shRY:9.6, hip:[32,39.5], hipRX:8, hipRY:5.2,
    arms:[ {s:[21,33], h:[18.5,42]}, {s:[43,33], h:[45.5,42]} ],
    feet:[ [28.6,45], [35.4,45] ], footR:3
  };
  switch(pose){
    case 'walk': { // 4-frame cycle: strideL, passing, strideR, passing
      if(phase===0){ rig.feet=[ [28.6,47.5], [35.4,42.5] ]; rig.arms=[ {s:[21,33], h:[18,44]}, {s:[43,33], h:[45,40]} ]; }
      else if(phase===2){ rig.feet=[ [28.6,42.5], [35.4,47.5] ]; rig.arms=[ {s:[21,33], h:[18,40]}, {s:[43,33], h:[45,44]} ]; }
      else { rig.feet=[ [29.5,45.5], [34.5,45.5] ]; } // passing (also serves as idle frame 1)
      break;
    }
    case 'computer': // hands reach forward (+y) to a desk
      rig.arms=[ {s:[24,34], h:[29,46]}, {s:[40,34], h:[35,46]} ];
      rig.feet=[ [28.6,43], [35.4,43] ]; break;
    case 'sit': // compact, feet tucked forward
      rig.feet=[ [29,43.5], [35,43.5] ]; rig.hip=[32,40]; break;
    case 'yoga': // arms out to the sides, stance wide
      rig.arms=[ {s:[21,33], h:[13,46]}, {s:[43,33], h:[51,46]} ];
      rig.feet=[ [25,45], [39,45] ]; break;
    default: break; // idle
  }
  return rig;
}

const ellipse=(cx,cy,rx,ry,fill,stroke)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke?` stroke="${INK}" stroke-width="0.8"`:''}/>`;
const limb=(x1,y1,x2,y2,w,fill)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w+1.4}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

function bentArm(sx,sy,hx,hy,out,sleeve,skin){
  const ex = sx + out*2.6, ey = sy + (hy-sy)*0.5 + 1; // elbow pushed outward
  const pts = `${sx},${sy} ${ex},${ey} ${hx},${hy}`;
  return `<polyline points="${pts}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<polyline points="${pts}" fill="none" stroke="${sleeve}" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<circle cx="${hx}" cy="${hy}" r="2.2" fill="${skin}" stroke="${INK}" stroke-width="0.7"/>`;
}

function uprightBody(ap, pose, phase){
  const r = uprightRig(pose, phase);
  const sleeve = (ap.top==='none'||ap.top==='tank') ? ap.skinHex : ap.topHex;
  const topFill = ap.top==='none' ? ap.skinHex : ap.topHex;
  const botFill = ap.bottom==='none' ? ap.baseHex : ap.bottomHex;
  const skin = ap.skinHex;
  let s = '';

  // ---- legs + crafted shoes (feet point toward facing = +y) ----
  for(const [fx,fy] of r.feet){
    const kneeX = 32 + (fx-32)*0.55;
    s += `<polyline points="${kneeX},42 ${fx},${fy-1.5}" fill="none" stroke="${INK}" stroke-width="4.8" stroke-linecap="round"/>`;
    s += `<polyline points="${kneeX},42 ${fx},${fy-1.5}" fill="none" stroke="${botFill}" stroke-width="3.2" stroke-linecap="round"/>`;
    if(ap.shoes==='none'){ s += ellipse(fx,fy,2.4,3,skin,true); }
    else { s += `<ellipse cx="${fx}" cy="${fy}" rx="2.7" ry="3.5" fill="${ap.shoesHex}" stroke="${INK}" stroke-width="0.7"/>`
                + `<line x1="${fx-2}" y1="${fy+1.1}" x2="${fx+2}" y2="${fy+1.1}" stroke="${INK}" stroke-width="0.5" opacity="0.5"/>`; }
  }

  // ---- bent arms (behind the torso yoke) ----
  for(const a of r.arms){ s += bentArm(a.s[0],a.s[1],a.h[0],a.h[1], a.s[0]<32?-1:1, sleeve, skin); }

  // ---- torso: shoulder yoke narrowing to the waist (crafted, not an oval) ----
  const wf = ap.build==='female' ? 0.92 : 1;      // slightly narrower shoulders for female
  const SL=32-9.4*wf, SR=32+9.4*wf, WL=32-6.1, WR=32+6.1;
  s += `<path d="M ${SL} 31 Q ${SL-0.6} 28.4 ${SL+2.6} 27.5 L 28.6 26.9 Q 32 26.3 35.4 26.9 L ${SR-2.6} 27.5 Q ${SR+0.6} 28.4 ${SR} 31 L ${WR} 43.7 Q 32 45.6 ${WL} 43.7 Z" fill="${topFill}" stroke="${INK}" stroke-width="0.9"/>`;
  // crisp single-source cel shade (right half) + soft highlight (upper-left)
  s += `<path d="M 32 27 L 35.4 26.9 L ${SR-2.6} 27.5 Q ${SR+0.6} 28.4 ${SR} 31 L ${WR} 43.7 Q 32 45.1 32 44.8 Z" fill="${SHADE}"/>`;
  s += `<path d="M 28.6 26.9 Q ${SL+2.6} 27.5 ${SL} 31 L ${SL+1.6} 35 Q 30 29.5 30.4 27.2 Z" fill="rgba(255,255,255,0.09)"/>`;
  // collar (neck skin), spine, shoulder seams, waist hem — the linework that reads as "drawn"
  s += `<path d="M 29.4 27.1 Q 32 29.7 34.6 27.1 Q 32 26.4 29.4 27.1 Z" fill="${skin}"/>`;
  s += `<line x1="32" y1="29.8" x2="32" y2="43.4" stroke="${INK}" stroke-width="0.55" opacity="0.45"/>`;
  s += `<path d="M 29.6 27.5 Q 26 28.6 ${SL+1.4} 31" fill="none" stroke="${INK}" stroke-width="0.55" opacity="0.4"/>`;
  s += `<path d="M 34.4 27.5 Q 38 28.6 ${SR-1.4} 31" fill="none" stroke="${INK}" stroke-width="0.55" opacity="0.4"/>`;
  s += `<path d="M ${WL} 43.7 Q 32 45.4 ${WR} 43.7" fill="none" stroke="${INK}" stroke-width="0.55" opacity="0.4"/>`;
  // garment specifics
  if(ap.top==='hoodie') s += `<path d="M 29.4 27 Q 32 24.6 34.6 27" fill="none" stroke="${INK}" stroke-width="1.1" opacity="0.5"/>`;
  if(ap.build==='female' && (ap.top==='none'||ap.top==='tank'))
    s += `<path d="M ${SL+1} 30 Q 32 33.8 ${SR-1} 30 L ${WR-0.5} 36 Q 32 37.6 ${WL+0.5} 36 Z" fill="${ap.baseHex}"/>`;

  // ---- head (smaller than shoulders) ----
  s += ellipse(32, 24.5, 6, 6.6, skin, true);
  s += facialHair(ap, 32, 28.2);
  // ---- crafted hair: rounded crown, sideburn dips, face gap at front, part line ----
  if(ap.hairStyle!=='bald'){
    const c=ap.hairHex;
    if(ap.hairStyle==='buzz'){
      s += `<path d="M 26.4 25 Q 26 19.6 32 19.3 Q 38 19.6 37.6 25 Q 37 27.4 32 27.2 Q 27 27.4 26.4 25 Z" fill="${c}" opacity="0.9"/>`;
    } else {
      s += `<path d="M 26 25.4 Q 25.6 19.2 32 18.9 Q 38.4 19.2 38 25.4 Q 37.7 28 35.3 28.9 Q 34 26.7 32 26.7 Q 30 26.7 28.7 28.9 Q 26.3 28 26 25.4 Z" fill="${c}" stroke="${INK}" stroke-width="0.6"/>`;
      s += `<path d="M 32 19.4 Q 33.6 22 32 24.4" fill="none" stroke="${INK}" stroke-width="0.5" opacity="0.5"/>`;
      s += `<path d="M 28.4 20.4 Q 27.7 22.8 28.6 25" fill="none" stroke="${INK}" stroke-width="0.4" opacity="0.4"/>`;
      s += `<path d="M 35.6 20.4 Q 36.3 22.8 35.4 25" fill="none" stroke="${INK}" stroke-width="0.4" opacity="0.4"/>`;
      if(ap.hairStyle==='ponytail') s += `<path d="M 29.5 19.6 Q 32 17 34.5 19.6 Q 33 22 32 27 Q 31 22 29.5 19.6 Z" fill="${c}" stroke="${INK}" stroke-width="0.5"/>`;
      if(ap.hairStyle==='long') s += `<path d="M 25.6 24 Q 24 30 26 33 L 38 33 Q 40 30 38.4 24 Q 38 28 35 28.8 Q 32 27 29 28.8 Q 26 28 25.6 24 Z" fill="${c}" stroke="${INK}" stroke-width="0.5"/>`;
      if(ap.hairStyle==='bob') s += `<path d="M 25.4 24.5 Q 25 29.5 27.5 30.5 L 36.5 30.5 Q 39 29.5 38.6 24.5 Q 38 28 35 28.8 Q 32 27 29 28.8 Q 26 28 25.4 24.5 Z" fill="${c}" stroke="${INK}" stroke-width="0.5"/>`;
    }
  }
  return s;
}

function facialHair(ap, fx, fy){
  if(ap.facialHair==='none') return '';
  const c=ap.hairHex;
  switch(ap.facialHair){
    case 'stubble': return `<ellipse cx="${fx}" cy="${fy}" rx="3.4" ry="2.4" fill="${c}" opacity="0.30"/>`;
    case 'mustache': return `<rect x="${fx-2.2}" y="${fy-0.7}" width="4.4" height="1.5" rx="0.7" fill="${c}"/>`;
    case 'goatee': return `<ellipse cx="${fx}" cy="${fy+0.8}" rx="1.7" ry="2.2" fill="${c}"/><rect x="${fx-2}" y="${fy-0.7}" width="4" height="1.3" rx="0.6" fill="${c}"/>`;
    case 'beard': return `<path d="M ${fx-3.8} ${fy-1.6} Q ${fx} ${fy+4} ${fx+3.8} ${fy-1.6} Q ${fx} ${fy+1} ${fx-3.8} ${fy-1.6} Z" fill="${c}"/>`;
    default: return '';
  }
}

// ===== SLEEP: elongated lying body (seen at full length in bed) =====
function lyingBody(ap){
  const sleeve = (ap.top==='none'||ap.top==='tank') ? ap.skinHex : ap.topHex;
  const topFill = ap.top==='none' ? ap.skinHex : ap.topHex;
  let s = '';
  s += ellipse(32,52,4.4,6,ap.bottom==='none'?ap.baseHex:ap.bottomHex,true); // legs/lower
  s += `<line x1="24" y1="34" x2="22" y2="44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="24" y1="34" x2="22" y2="44" stroke="${sleeve}" stroke-width="3.6" stroke-linecap="round"/>`;
  s += `<line x1="40" y1="34" x2="42" y2="44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="34" x2="42" y2="44" stroke="${sleeve}" stroke-width="3.6" stroke-linecap="round"/>`;
  s += ellipse(32,36,8.5,13,topFill,true);        // torso
  s += ellipse(32,22,7.2,7.6,ap.skinHex,true);     // head
  if(ap.hairStyle!=='bald') s += ellipse(32,20.5,7.8,7.6,ap.hairHex,false);
  return s;
}

function modeDefs(mode,id){
  if(mode==='noir') return `<defs><filter id="${id}"><feColorMatrix type="saturate" values="0.3"/><feComponentTransfer><feFuncR type="linear" slope="0.82" intercept="-0.02"/><feFuncG type="linear" slope="0.82" intercept="-0.02"/><feFuncB type="linear" slope="0.88" intercept="0.02"/></feComponentTransfer></filter></defs>`;
  if(mode==='lineart') return `<defs><filter id="${id}"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 1"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 1 1"/></feComponentTransfer><feFlood flood-color="#14161c"/><feComposite operator="out" in2="SourceGraphic"/></filter></defs>`;
  return '';
}

// Core content in the 64x64 viewBox space (no <svg> wrapper). phase = walk-cycle frame 0..3.
export function characterMarkup(appearance={},direction='south',pose='idle',phase=0){
  const dir=pick(direction,DIRECTIONS,'south');
  const p=pick(pose,POSES,'idle');
  const ap=resolve(appearance);
  const fv=FACE_VEC[dir];
  const shadow = p==='sleep'
    ? `<ellipse cx="32" cy="38" rx="10" ry="17" fill="rgba(0,0,0,0.16)"/>`
    : `<ellipse cx="32" cy="45" rx="13" ry="4.4" fill="rgba(0,0,0,0.22)"/>`;
  let inner;
  if(p==='sleep'){
    inner = lyingBody(ap); // orientation handled by the bed anchor / activity transform
  } else {
    const rot = Math.atan2(-fv[0], fv[1]) * 180/Math.PI; // rotate compact body to face 8 ways
    inner = `<g transform="rotate(${rot} 32 33)">${uprightBody(ap,p,phase)}</g>`;
  }
  const id='m'+(++__uid), defs=modeDefs(ap.mode,id);
  const filtered = ap.mode==='color' ? inner : `<g filter="url(#${id})">${inner}</g>`;
  const bg = ap.mode==='lineart' ? '<rect x="0" y="0" width="64" height="64" fill="#f4f1e8"/>' : '';
  return { defs, content: `${bg}${shadow}${filtered}` };
}

export function buildCharacterSVG(appearance={},direction='south',pose='idle',size=110,phase=0){
  const { defs, content } = characterMarkup(appearance,direction,pose,phase);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${defs}${content}</svg>`;
}

export function characterDataUri(a,d,p,s,phase){ return 'data:image/svg+xml;utf8,'+encodeURIComponent(buildCharacterSVG(a,d,p,s,phase)); }
