const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('interaction-menu');
const $ = id => document.getElementById(id);

const ui = {
  selectedName: $('selected-name'),
  currentAction: $('current-action'),
  needs: $('needs'),
  worldState: $('world-state'),
  log: $('log'),
  floor0: $('floor-0'),
  floor1: $('floor-1'),
  speed1: $('speed-1'),
  speed3: $('speed-3'),
  pause: $('pause'),
  reset: $('reset')
};

const needKeys = ['hunger', 'hygiene', 'energy', 'fun', 'bladder', 'social', 'stamina'];
const colors = { bg:'#171a22', room:'#303848', room2:'#384154', obj:'#59647a', hot:'#f1c66a', text:'#f0f2f7', mute:'#aab2c5' };
const view = { x: 0, y: 0, scale: 1 };
let lastTap = { time: 0, x: -9999, y: -9999, objectId: null };

const floors = [
  {
    name: 'Floor 1',
    rooms: [r(80,70,430,230,'Living Room'), r(535,70,360,230,'Kitchen'), r(80,330,360,230,'Bathroom'), r(465,330,430,230,'Entry')],
    objects: [
      o('couch','Couch',170,150,120,50,['watchTv','relax']), o('tv','TV',335,115,80,50,['watchTv']),
      o('fridge','Fridge',600,120,75,85,['snack','cook']), o('stove','Stove',735,120,90,65,['cook']),
      o('sink','Sink',605,225,90,50,['clean']), o('shower','Shower',125,380,100,85,['shower','clean']),
      o('toilet','Toilet',275,390,70,65,['toilet']), o('door','Front Door',780,430,95,65,['work','leave']),
      o('stairs','Stairs Up',505,410,105,90,['stairsUp'],1)
    ]
  },
  {
    name: 'Floor 2',
    rooms: [r(95,85,405,250,'Bedroom'), r(530,85,350,250,'Office'), r(95,365,360,170,'Pet Corner'), r(485,365,395,170,'Hall')],
    objects: [
      o('bed','Bed',175,170,170,90,['sleep','relax']), o('desk','Desk',600,155,140,75,['workHome','play']),
      o('dogbowl','Dog Bowl',170,420,82,50,['feedDog']), o('stairs2','Stairs Down',530,410,105,90,['stairsDown'],0)
    ]
  }
];

const actionInfo = {
  shower:['Taking shower',5,{hygiene:38,fun:4,stamina:8}], clean:['Cleaning',4,{hygiene:-3,fun:-2,stamina:-7}], toilet:['Using toilet',2,{bladder:45}],
  watchTv:['Watching TV',6,{fun:28,social:2,energy:-3,stamina:8}], relax:['Relaxing',5,{energy:12,fun:8,stamina:16}], snack:['Getting snack',3,{hunger:26,fun:2,stamina:4}],
  cook:['Cooking meal',6,{hunger:44,fun:5,energy:-5,stamina:-6}], sleep:['Sleeping',9,{energy:45,hunger:-8,bladder:-8,stamina:55}],
  work:['At work',14,{energy:-22,fun:-12,social:4,stamina:-22},35], leave:['Stepping outside',4,{fun:8,social:4,stamina:-4}],
  stairsUp:['Going upstairs',1,{stamina:-4}], stairsDown:['Going downstairs',1,{stamina:-3}], workHome:['Working at desk',8,{energy:-12,fun:-5,stamina:-8},12],
  play:['Playing game',5,{fun:25,energy:-3,stamina:5}], feedDog:['Feeding dog',3,{social:12,fun:5,stamina:-2}]
};

function r(x,y,w,h,label){return {x,y,w,h,label};}
function o(id,label,x,y,w,h,actions,toFloor=null){return {id,label,x,y,w,h,actions,toFloor,ix:x+w/2,iy:y+h+34};}
function person(id,name,x,y,floor,color){
  return {id,name,x,y,floor,color,radius:18,target:null,action:null,selected:false,off:false,bubble:'',bubbleT:0,pending:null,remote:null,moveMode:'walk',facing:-Math.PI/2,step:0,needs:{hunger:72,hygiene:70,energy:76,fun:62,bladder:70,social:62,stamina:82}};
}

let state, last = performance.now();
function fresh(){
  return {
    floor:0, selected:'resident', day:1, mins:8*60, speed:1, paused:false, money:48, hover:null,
    logs:['Prototype loaded. Tap to walk, double tap to run.'],
    entities:{
      resident:person('resident','Resident',170,420,0,'#67b7ff'),
      girlfriend:person('girlfriend','Girlfriend',255,180,0,'#ff93c8'),
      dog:{...person('dog','Dog',205,440,0,'#d9a15f'),radius:13,needs:{hunger:70,hygiene:80,energy:72,fun:80,bladder:80,social:78,stamina:90}}
    }
  };
}
state = fresh();

function selected(){return state.entities[state.selected];}
function clamp(v,a=0,b=100){return Math.max(a,Math.min(b,v));}
function cap(s){return s[0].toUpperCase()+s.slice(1);}
function timeText(){const m=Math.floor(state.mins%(24*60)); const h=Math.floor(m/60); const min=String(m%60).padStart(2,'0'); return `D${state.day} ${h%12||12}:${min}${h>=12?'p':'a'}`;}
function log(msg){state.logs.unshift(`${timeText()} ${msg}`); state.logs=state.logs.slice(0,8);}

function screenToGame(e){
  const b = canvas.getBoundingClientRect();
  const cx = (e.clientX - b.left) * canvas.width / b.width;
  const cy = (e.clientY - b.top) * canvas.height / b.height;
  return {x: cx / view.scale - view.x, y: cy / view.scale - view.y, sx:e.clientX-b.left, sy:e.clientY-b.top};
}
function objectAt(x,y){return floors[state.floor].objects.find(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);}
function entityAt(x,y){return Object.values(state.entities).find(e=>!e.off&&e.floor===state.floor&&Math.hypot(e.x-x,e.y-y)<e.radius+10);}
function currentStair(floor){return floors[floor].objects.find(obj=>obj.toFloor !== null);}
function objectOnFloor(floor,id){return floors[floor].objects.find(obj=>obj.id===id);}
function smart(e,obj){
  if(obj.id.includes('stairs'))return obj.actions[0];
  if(obj.id==='shower')return e.needs.hygiene<55?'shower':'clean';
  if(obj.id==='fridge')return e.needs.hunger<60?'snack':'cook';
  if(obj.id==='stove')return 'cook';
  if(obj.id==='bed')return e.needs.energy<65?'sleep':'relax';
  if(obj.id==='tv'||obj.id==='couch')return e.needs.fun<70?'watchTv':'relax';
  if(obj.id==='toilet')return 'toilet';
  if(obj.id==='door')return 'work';
  if(obj.id==='dogbowl')return 'feedDog';
  return obj.actions[0];
}
function isDoubleTap(p,obj){
  const now = performance.now();
  const sameSpot = Math.hypot(p.x-lastTap.x,p.y-lastTap.y) < 46;
  const sameObj = (obj?.id || null) === lastTap.objectId;
  const doubleTap = now - lastTap.time < 340 && sameSpot && sameObj;
  lastTap = {time:now,x:p.x,y:p.y,objectId:obj?.id || null};
  return doubleTap;
}

function moveTo(e,x,y,run=false){
  if(e.off)return;
  const wantsRun = run && e.needs.stamina > 12;
  e.target={x:clamp(x,90,890),y:clamp(y,80,560),run:wantsRun};
  e.moveMode=wantsRun?'run':'walk';
  e.action=null;
  e.bubble=wantsRun?'Running':'On it';
  e.bubbleT=1.1;
  hideMenu();
  if(run && !wantsRun){log(`${e.name} is too winded to run.`);}
}
function routeToViewedFloor(e,destFloor,run=false){
  if(e.floor === destFloor)return false;
  const stair = currentStair(e.floor);
  if(!stair)return false;
  moveTo(e,stair.ix,stair.iy,run);
  e.pending={obj:stair,key:stair.actions[0],run};
  return true;
}
function commandObj(e,obj,forced,run=false){
  const key=forced||smart(e,obj);
  if(e.floor !== state.floor){
    e.remote={floor:state.floor,objId:obj.id,key,run};
    routeToViewedFloor(e,state.floor,run);
    log(`${e.name} is coming to ${floors[state.floor].name} for ${obj.label}.`);
    return;
  }
  moveTo(e,obj.ix,obj.iy,run);
  e.pending={obj,key,run};
  log(`${e.name} ${run?'runs':'walks'} to ${obj.label}.`);
}
function startAction(e,key,obj){
  const info=actionInfo[key]||['Working',3,{}];
  e.action={key,label:info[0],t:info[1],total:info[1],effects:info[2],pay:info[3]||0,obj};
  e.target=null; e.pending=null; e.bubble=info[0]; e.bubbleT=1.8; e.moveMode='walk';
  if(key==='work'){e.off=true; e.floor=-1;}
  if(key==='stairsUp'||key==='stairsDown'){
    e.floor=obj.toFloor;
    e.x=obj.toFloor===1?585:555;
    e.y=455;
    e.action=null;
    log(`${e.name} changed floors.`);
    if(e.remote && e.remote.floor===e.floor){
      const targetObj=objectOnFloor(e.remote.floor,e.remote.objId);
      const remote=e.remote;
      e.remote=null;
      if(targetObj)commandObj(e,targetObj,remote.key,remote.run);
    }
  }
}
function finishAction(e){
  const a=e.action; if(!a)return;
  for(const [k,v] of Object.entries(a.effects)){e.needs[k]=clamp((e.needs[k]||50)+v);}
  if(a.pay){state.money+=a.pay; log(`${e.name} came back from work with $${a.pay}.`); e.off=false; e.floor=0; e.x=810; e.y=500;}
  else log(`${e.name} finished ${a.label.toLowerCase()}.`);
  if(a.key==='feedDog'){const d=state.entities.dog; d.needs.hunger=clamp(d.needs.hunger+35); d.bubble='Food!'; d.bubbleT=2;}
  e.action=null;
}
function tickNeeds(e,dt){
  if(e.off)return;
  const m=dt*0.55;
  e.needs.hunger=clamp(e.needs.hunger-m*.8);
  e.needs.hygiene=clamp(e.needs.hygiene-m*.35);
  e.needs.energy=clamp(e.needs.energy-m*.45);
  e.needs.fun=clamp(e.needs.fun-m*.32);
  e.needs.bladder=clamp(e.needs.bladder-m*.65);
  e.needs.social=clamp(e.needs.social-m*.24);
  if(!e.target && !e.action)e.needs.stamina=clamp(e.needs.stamina+m*4.4);
  if(e.target && e.moveMode==='walk')e.needs.stamina=clamp(e.needs.stamina+m*1.2);
}
function updateMove(e,dt){
  if(!e.target||e.off)return;
  const dx=e.target.x-e.x, dy=e.target.y-e.y, d=Math.hypot(dx,dy);
  const running=e.target.run && e.needs.stamina>1;
  const speedBase=e.id==='dog'?122:running?178:92;
  const stepDist=speedBase*dt;
  if(d>0.01)e.facing=Math.atan2(dy,dx);
  if(running){
    e.moveMode='run';
    e.needs.stamina=clamp(e.needs.stamina-dt*18);
    e.needs.hunger=clamp(e.needs.hunger-dt*1.8);
    e.needs.energy=clamp(e.needs.energy-dt*1.4);
    if(e.needs.stamina<=1){e.target.run=false; e.moveMode='walk'; e.bubble='Winded'; e.bubbleT=1.4;}
  } else e.moveMode='walk';
  e.step += dt*(running?11:6);
  if(d<=stepDist){
    e.x=e.target.x; e.y=e.target.y; e.target=null; e.moveMode='walk';
    if(e.pending)startAction(e,e.pending.key,e.pending.obj);
  } else {e.x+=dx/d*stepDist; e.y+=dy/d*stepDist;}
}
function npc(e,dt){
  if(e.id==='resident'||e.action||e.target||e.off)return;
  if(Math.random()<dt*.08){
    let obj=null;
    if(e.id==='dog'){
      obj=objectOnFloor(e.floor,'dogbowl')||floors[e.floor].objects[0];
      if(e.needs.hunger<45)commandObj(e,obj,'feedDog'); else moveTo(e,e.x+(Math.random()*120-60),e.y+(Math.random()*100-50));
      return;
    }
    if(e.needs.hunger<40){e.floor=0; obj=objectOnFloor(0,'fridge');}
    else if(e.needs.fun<45){e.floor=0; obj=objectOnFloor(0,'tv');}
    else if(e.needs.energy<35){e.floor=1; obj=objectOnFloor(1,'bed');}
    if(obj)commandObj(e,obj);
  }
}
function update(dt){
  if(state.paused)return;
  const scaled=dt*state.speed;
  state.mins+=scaled*10;
  if(state.mins>=24*60){state.mins-=24*60;state.day++;log(`Day ${state.day} begins.`);}
  Object.values(state.entities).forEach(e=>{tickNeeds(e,scaled);updateMove(e,scaled); if(e.action){e.action.t-=scaled; if(e.action.t<=0)finishAction(e);} if(e.bubbleT>0)e.bubbleT-=scaled; npc(e,scaled);});
}

function rr(x,y,w,h,r,fill){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
function updateView(){view.scale=Math.min(canvas.width/1000,canvas.height/640); view.x=(canvas.width/view.scale-1000)/2; view.y=(canvas.height/view.scale-640)/2;}
function draw(){
  updateView();
  ctx.clearRect(0,0,1280,720);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,1280,720);
  ctx.save(); ctx.scale(view.scale,view.scale); ctx.translate(view.x,view.y);
  rr(55,45,900,560,24,'#1d2230');ctx.strokeStyle='#4b5369';ctx.lineWidth=4;ctx.stroke();
  const f=floors[state.floor];
  f.rooms.forEach(room=>{rr(room.x,room.y,room.w,room.h,16,room.label.includes('Kitchen')||room.label.includes('Office')?colors.room2:colors.room);ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.22)';ctx.font='700 16px system-ui';ctx.fillText(room.label,room.x+16,room.y+28);});
  f.objects.forEach(obj=>{const hot=state.hover===obj;rr(obj.x,obj.y,obj.w,obj.h,10,hot?'#7c6a3b':colors.obj);ctx.strokeStyle=hot?colors.hot:'rgba(255,255,255,.18)';ctx.lineWidth=hot?3:1.5;ctx.stroke();ctx.fillStyle=colors.text;ctx.font='700 13px system-ui';ctx.textAlign='center';ctx.fillText(obj.label,obj.x+obj.w/2,obj.y+obj.h/2+5);ctx.textAlign='left';});
  Object.values(state.entities).forEach(e=>{if(e.target&&!e.off&&e.floor===state.floor){ctx.strokeStyle=e.moveMode==='run'?'#f1c66a':'#8fd3ff';ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.target.x,e.target.y);ctx.stroke();ctx.setLineDash([]);}});
  Object.values(state.entities).forEach(drawEnt);
  rr(690,35,255,90,16,'rgba(0,0,0,.36)');ctx.fillStyle=colors.text;ctx.font='900 22px system-ui';ctx.fillText(f.name,715,68);ctx.font='700 14px system-ui';ctx.fillStyle=colors.mute;ctx.fillText(timeText(),715,95);ctx.fillText(`Tap to walk, double tap to run`,715,118);
  const e=selected();
  if(e.floor!==state.floor && !e.off){ctx.fillStyle='rgba(0,0,0,.45)';rr(280,288,430,58,16,'rgba(0,0,0,.45)');ctx.fillStyle=colors.text;ctx.font='800 15px system-ui';ctx.textAlign='center';ctx.fillText(`${e.name} is on ${floors[e.floor].name}. Tap an object here to call them.`,495,323);ctx.textAlign='left';}
  ctx.restore();
}
function limb(x1,y1,x2,y2,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function drawEnt(e){
  if(e.off||e.floor!==state.floor)return;
  const moving=!!e.target;
  const phase=moving?Math.sin(e.step*Math.PI*2):0;
  const fx=Math.cos(e.facing), fy=Math.sin(e.facing), rx=-fy, ry=fx;
  const cx=e.x, cy=e.y;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(cx,cy+e.radius*.95,e.radius*1.25,e.radius*.45,0,0,Math.PI*2);ctx.fill();
  if(e.id==='dog'){
    drawDog(e,fx,fy,rx,ry,phase);
    ctx.restore();
    return;
  }
  const leftFoot={x:cx-fx*(15+phase*7)-rx*7,y:cy-fy*(15+phase*7)-ry*7};
  const rightFoot={x:cx-fx*(15-phase*7)+rx*7,y:cy-fy*(15-phase*7)+ry*7};
  const leftHand={x:cx+fx*(3+phase*8)-rx*17,y:cy+fy*(3+phase*8)-ry*17};
  const rightHand={x:cx+fx*(3-phase*8)+rx*17,y:cy+fy*(3-phase*8)+ry*17};
  limb(cx-rx*5,cy-ry*5,leftFoot.x,leftFoot.y,'#151923',5);
  limb(cx+rx*5,cy+ry*5,rightFoot.x,rightFoot.y,'#151923',5);
  limb(cx-rx*9,cy-ry*9,leftHand.x,leftHand.y,e.color,5);
  limb(cx+rx*9,cy+ry*9,rightHand.x,rightHand.y,e.color,5);
  ctx.fillStyle=e.color;ctx.beginPath();ctx.ellipse(cx,cy,e.radius*.78,e.radius*1.02,e.facing,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e8d5b8';ctx.beginPath();ctx.arc(cx+fx*17,cy+fy*17,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#11131a';ctx.beginPath();ctx.arc(cx+fx*21-rx*3,cy+fy*21-ry*3,1.8,0,Math.PI*2);ctx.arc(cx+fx*21+rx*3,cy+fy*21+ry*3,1.8,0,Math.PI*2);ctx.fill();
  if(e.id===state.selected){ctx.strokeStyle=colors.hot;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,e.radius+14,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle=colors.text;ctx.font='700 13px system-ui';ctx.textAlign='center';ctx.fillText(e.name,cx,cy+e.radius+26);ctx.textAlign='left';
  drawStatus(e,cx,cy);
  ctx.restore();
}
function drawDog(e,fx,fy,rx,ry,phase){
  const cx=e.x, cy=e.y;
  for(const side of [-1,1]){
    limb(cx-rx*side*4-fx*7,cy-ry*side*4-fy*7,cx-rx*side*8-fx*(15+phase*4),cy-ry*side*8-fy*(15+phase*4),'#5b351e',3);
    limb(cx-rx*side*4+fx*6,cy-ry*side*4+fy*6,cx-rx*side*8+fx*(14-phase*4),cy-ry*side*8+fy*(14-phase*4),'#5b351e',3);
  }
  ctx.fillStyle=e.color;ctx.beginPath();ctx.ellipse(cx,cy,e.radius*.9,e.radius*1.25,e.facing,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx+fx*15,cy+fy*15,7,0,Math.PI*2);ctx.fill();
  if(e.id===state.selected){ctx.strokeStyle=colors.hot;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,e.radius+12,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle=colors.text;ctx.font='700 13px system-ui';ctx.textAlign='center';ctx.fillText(e.name,cx,cy+e.radius+24);ctx.textAlign='left';
  drawStatus(e,cx,cy);
}
function drawStatus(e,cx,cy){
  if(e.action){const p=1-e.action.t/e.action.total;rr(cx-27,cy-e.radius-26,54,8,4,'rgba(0,0,0,.55)');rr(cx-27,cy-e.radius-26,54*p,8,4,colors.hot);}
  if(e.bubbleT>0){ctx.font='700 12px system-ui';ctx.textAlign='center';const w=Math.min(185,ctx.measureText(e.bubble).width+22);rr(cx-w/2,cy-e.radius-60,w,28,12,'rgba(17,19,26,.92)');ctx.strokeStyle='rgba(255,255,255,.18)';ctx.stroke();ctx.fillStyle=colors.text;ctx.fillText(e.bubble,cx,cy-e.radius-42);ctx.textAlign='left';}
}
function hideMenu(){menu.classList.add('hidden');menu.innerHTML='';}
function showMenu(obj,p,run=false){
  const e=selected();
  menu.innerHTML=`<div class="menu-title">${e.name} → ${obj.label}${run?' · run queued':''}</div>`;
  const add=(label,key)=>{const b=document.createElement('button');b.className='menu-option';b.textContent=label;b.onclick=()=>commandObj(e,obj,key,run);menu.appendChild(b);};
  add(`Smart: ${actionInfo[smart(e,obj)]?.[0]||smart(e,obj)}`,smart(e,obj));
  obj.actions.forEach(a=>add(actionInfo[a]?.[0]||a,a));
  const rect=canvas.getBoundingClientRect();
  menu.style.left=`${Math.min(p.sx+12,rect.width-220)}px`;
  menu.style.top=`${Math.min(p.sy+12,rect.height-220)}px`;
  menu.classList.remove('hidden');
}
function sync(){
  const e=selected();
  Object.values(state.entities).forEach(x=>x.selected=x.id===state.selected);
  ui.selectedName.textContent=`${e.name}${e.off?' (away)':''}`;
  ui.currentAction.textContent=e.action?e.action.label:e.target?`${e.moveMode==='run'?'Running':'Walking'}${e.floor!==state.floor?' off-screen':''}`:'Idle';
  ui.needs.innerHTML=needKeys.map(n=>{const v=Math.round(e.needs[n] ?? 50);const c=v<25?'bad':v<50?'warn':'';return `<div class="need-row"><span>${cap(n)}</span><div class="need-bar"><div class="need-fill ${c}" style="width:${v}%"></div></div><span>${v}</span></div>`;}).join('');
  ui.worldState.innerHTML=`<strong>${timeText()}</strong><br>Money: $${state.money}<br>Viewing: ${floors[state.floor].name}<br>${e.off?`${e.name} is away.`:`${e.name} is on ${floors[e.floor].name}.`}<br>Speed: ${state.paused?'Paused':state.speed+'x'}`;
  ui.log.innerHTML=state.logs.map(x=>`<li>${x}</li>`).join('');
  ui.floor0.classList.toggle('active',state.floor===0);ui.floor1.classList.toggle('active',state.floor===1);ui.speed1.classList.toggle('active',state.speed===1&&!state.paused);ui.speed3.classList.toggle('active',state.speed===3&&!state.paused);ui.pause.classList.toggle('active',state.paused);
}

canvas.addEventListener('pointermove',e=>{const p=screenToGame(e);state.hover=objectAt(p.x,p.y)||null;});
canvas.addEventListener('pointerdown',e=>{
  const p=screenToGame(e);
  const obj=objectAt(p.x,p.y);
  const run=isDoubleTap(p,obj);
  const hit=entityAt(p.x,p.y);
  if(hit){state.selected=hit.id;hideMenu();sync();return;}
  if(obj){showMenu(obj,p,run);return;}
  moveTo(selected(),p.x,p.y,run);
});
ui.floor0.onclick=()=>{state.floor=0;hideMenu();sync();};
ui.floor1.onclick=()=>{state.floor=1;hideMenu();sync();};
ui.speed1.onclick=()=>{state.speed=1;state.paused=false;sync();};
ui.speed3.onclick=()=>{state.speed=3;state.paused=false;sync();};
ui.pause.onclick=()=>{state.paused=!state.paused;sync();};
ui.reset.onclick=()=>{state=fresh();hideMenu();sync();};
document.addEventListener('keydown',e=>{
  const ent=selected();
  if(e.key==='Escape')hideMenu();
  if(e.key==='1'){state.floor=0;sync();}
  if(e.key==='2'){state.floor=1;sync();}
  if(e.key===' '){state.paused=!state.paused;sync();}
  const step=35;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveTo(ent,ent.x+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0),ent.y+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0),e.shiftKey);}
});
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);draw();sync();requestAnimationFrame(loop);}
sync(); requestAnimationFrame(loop);
