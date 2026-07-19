import fs from 'node:fs';

const file='scripts/audit-p2-previsual-parity.mjs';
let source=fs.readFileSync(file,'utf8');
source=source.replace(
  "const importModule = async (root,file) => import(`${pathToFileURL(path.join(root,file)).href}?audit=${Date.now()}-${Math.random()}`);",
  "const importModule = async (root,file) => import(pathToFileURL(path.join(root,file)).href);"
);
source=source.replace(
  "const currentFloors=currentWorld.floors.map(normalizeFloor).sort((a,b)=>a.id-b.id);",
  "const currentFloors=currentWorld.floors.map(normalizeFloor).sort((a,b)=>a.id-b.id);\nconst baselineFloorIds=baselineFloors.map(floor=>floor.id);\nconst currentFloorIds=currentFloors.map(floor=>floor.id);"
);
source=source.replace(
  "  status:'PASS',\n  floorCount:",
  "  status:'PASS',\n  expectedDynamicFloors:[6,7],\n  baselineFloorIds,\n  currentFloorIds,\n  floorCount:"
);
source=source.replace(
  "const failures=[];",
  "const failures=[];\nfor(const floorId of [6,7]){\n  if(!baselineFloorIds.includes(floorId))failures.push(`baseline dynamic floor ${floorId} missing from audited world instance`);\n  if(!currentFloorIds.includes(floorId))failures.push(`current dynamic floor ${floorId} missing from audited world instance`);\n}"
);
source=source.replace(
  "    'PASS means the pre-overhaul gameplay data and core systems remain represented.',",
  "    'PASS includes dynamically installed Front Yard South and Driveway West floors and objects.',\n    'PASS means the pre-overhaul gameplay data and core systems remain represented.',"
);
if(!source.includes("expectedDynamicFloors:[6,7]"))throw new Error('Dynamic floor audit patch did not apply.');
fs.writeFileSync(file,source);
