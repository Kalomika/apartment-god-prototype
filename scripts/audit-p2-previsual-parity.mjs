import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [baselineRootArg,currentRootArg] = process.argv.slice(2);
if (!baselineRootArg || !currentRootArg) throw new Error('Usage: node scripts/audit-p2-previsual-parity.mjs <baselineRoot> <currentRoot>');
const baselineRoot=path.resolve(baselineRootArg);
const currentRoot=path.resolve(currentRootArg);
const BASELINE='c8941bbe16e5725ad02eb20596ee5a07868303b8';

const importModule = async (root,file) => import(`${pathToFileURL(path.join(root,file)).href}?audit=${Date.now()}-${Math.random()}`);
const normalize = value => JSON.parse(JSON.stringify(value,(key,item)=>typeof item==='function'?`[Function:${item.name||'anonymous'}]`:item));
const stable = value => JSON.stringify(normalize(value),Object.keys(normalize(value)||{}).sort());
const read = (root,file) => fs.readFileSync(path.join(root,file),'utf8');
const sameFile = file => read(baselineRoot,file)===read(currentRoot,file);

const baselineWorld=await importModule(baselineRoot,'src/world.js');
const currentWorld=await importModule(currentRoot,'src/world.js');
const baselineFront=await importModule(baselineRoot,'src/frontYardDriveway.js');
const currentFront=await importModule(currentRoot,'src/frontYardDriveway.js');
baselineFront.installFrontYardWorld();
currentFront.installFrontYardWorld();

const normalizeRoom=room=>({id:room.id,name:room.name,x:room.x,y:room.y,w:room.w,h:room.h});
const normalizeFloor=floor=>({id:floor.id,name:floor.name,rooms:(floor.rooms||[]).map(normalizeRoom).sort((a,b)=>String(a.id).localeCompare(String(b.id)))});
const normalizeObject=object=>{
  const copy={};
  for(const key of Object.keys(object).sort()){
    const value=object[key];
    if(typeof value!=='function')copy[key]=value;
  }
  return copy;
};
const baselineFloors=baselineWorld.floors.map(normalizeFloor).sort((a,b)=>a.id-b.id);
const currentFloors=currentWorld.floors.map(normalizeFloor).sort((a,b)=>a.id-b.id);
const baselineObjects=baselineWorld.objects.map(normalizeObject).sort((a,b)=>a.id.localeCompare(b.id));
const currentObjects=currentWorld.objects.map(normalizeObject).sort((a,b)=>a.id.localeCompare(b.id));

const currentCatalog=await importModule(currentRoot,'src/phaserMigration2VisualCatalog.js');
const visualCoverage=baselineObjects.map(object=>({id:object.id,kind:object.kind,texture:currentCatalog.textureForObject(object),covered:Boolean(currentCatalog.PM2_OBJECT_TEXTURES[object.kind])&&currentCatalog.textureForObject(object)!=='pm2-object-generic'}));
const roomCoverage=baselineFloors.flatMap(floor=>floor.rooms.map(room=>({floor:floor.id,id:room.id,texture:currentCatalog.textureForRoom(room),covered:currentCatalog.textureForRoom(room)!=='pm2-room-neutral'||['neutral'].includes(room.id)})));

const exactGameplayFiles=[
  'src/actions.js','src/autoHooks.js','src/autonomy.js','src/basketballSystem.js','src/calendarRuntime.js','src/cameraNavigation.js','src/frontYardDriveway.js','src/gateTraversalGuard.js','src/lifeQualitySystem.js','src/mainFloorLayoutPolish.js','src/movement.js','src/offsiteOverlay.js','src/phoneUI.js','src/poolActivitySystem.js','src/runtimeObjectCorrections.js','src/runtimeRegressionGuards.js','src/saveSystem.js','src/state.js','src/tidinessSystem.js','src/timeSystem.js','src/ui.js','src/world.js'
];
const gameplayFileParity=exactGameplayFiles.map(file=>({file,identical:sameFile(file)}));

const baselineIndex=read(baselineRoot,'index.html');
const currentIndex=read(currentRoot,'index.html');
const baselineControlIds=[...baselineIndex.matchAll(/id="([^"]+)"/g)].map(match=>match[1]);
const missingControlIds=baselineControlIds.filter(id=>!currentIndex.includes(`id="${id}"`));

const baselineRuntime=read(baselineRoot,'src/phaserMigration2Runtime.js');
const currentRuntime=read(currentRoot,'src/phaserMigration2Runtime.js');
const requiredRuntimeCalls=[...baselineRuntime.matchAll(/\b(update[A-Z][A-Za-z0-9_]*|advanceSimulation|runSimulationStep|resolveArrival|installCameraSwipeNavigation|createUi|loadRefreshStateSafely|applyRuntimeRegressionGuards)\(/g)].map(match=>match[1]);
const uniqueRuntimeCalls=[...new Set(requiredRuntimeCalls)];
const missingRuntimeCalls=uniqueRuntimeCalls.filter(name=>!currentRuntime.includes(`${name}(`));

const baselineState=await importModule(baselineRoot,'src/state.js');
const currentState=await importModule(currentRoot,'src/state.js');
const baselineSnapshot=baselineState.createState();
const currentSnapshot=currentState.createState();
const summarizeState=state=>({
  topLevelKeys:Object.keys(state).sort(),
  selectedId:state.selectedId,
  floor:state.floor,
  entityIds:(state.entities||[]).map(entity=>entity.id).sort(),
  entityTypes:(state.entities||[]).map(entity=>({id:entity.id,type:entity.type,floor:entity.floor})).sort((a,b)=>a.id.localeCompare(b.id)),
  autonomyMode:state.autonomyMode
});
const stateParity=JSON.stringify(summarizeState(baselineSnapshot))===JSON.stringify(summarizeState(currentSnapshot));

const report={
  generatedAt:new Date().toISOString(),
  baseline:BASELINE,
  branch:'phaser-migration-2',
  status:'PASS',
  floorCount:{baseline:baselineFloors.length,current:currentFloors.length},
  roomCount:{baseline:baselineFloors.reduce((sum,floor)=>sum+floor.rooms.length,0),current:currentFloors.reduce((sum,floor)=>sum+floor.rooms.length,0)},
  objectCount:{baseline:baselineObjects.length,current:currentObjects.length},
  exactFloorData:JSON.stringify(baselineFloors)===JSON.stringify(currentFloors),
  exactObjectData:JSON.stringify(baselineObjects)===JSON.stringify(currentObjects),
  stateParity,
  gameplayFileParity,
  missingControlIds,
  missingRuntimeCalls,
  visualCoverage,
  roomCoverage,
  notes:[
    'PASS means the pre-overhaul gameplay data and core systems remain represented.',
    'PASS does not mean the temporary procedural art has final authored visual approval.',
    'Current main is audited separately and must not be merged blindly into this baseline contract.'
  ]
};
const failures=[];
if(!report.exactFloorData)failures.push('floor or room data differs from baseline');
if(!report.exactObjectData)failures.push('object data differs from baseline');
if(!stateParity)failures.push('initial gameplay state structure differs from baseline');
for(const item of gameplayFileParity)if(!item.identical)failures.push(`${item.file} differs from baseline`);
if(missingControlIds.length)failures.push(`missing baseline DOM controls: ${missingControlIds.join(', ')}`);
if(missingRuntimeCalls.length)failures.push(`missing baseline runtime calls: ${missingRuntimeCalls.join(', ')}`);
const uncovered=visualCoverage.filter(item=>!item.covered);
if(uncovered.length)failures.push(`uncovered object visuals: ${uncovered.map(item=>item.id).join(', ')}`);
if(failures.length){report.status='FAIL';report.failures=failures;}
const output=path.join(currentRoot,'apartment-god-production/P2_PREVISUAL_PARITY_AUDIT_2026-07-19.json');
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,floors:report.floorCount,rooms:report.roomCount,objects:report.objectCount,failures},null,2));
if(failures.length)process.exit(1);
