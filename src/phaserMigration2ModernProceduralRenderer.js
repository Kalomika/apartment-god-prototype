const ROOM_THEMES = {
  living: { wall: 0xf4eee3, edge: 0x6d5d4f, floor: 0xc89f70, line: 0x8e6747, material: 'wood' },
  kitchen: { wall: 0xf2eadf, edge: 0x655b53, floor: 0xc8bda8, line: 0x978c7d, material: 'tile' },
  bath: { wall: 0xf4f1ea, edge: 0x59696c, floor: 0xaabfc0, line: 0x789597, material: 'tile' },
  entry: { wall: 0xf1eadf, edge: 0x6f6255, floor: 0xb99d79, line: 0x877158, material: 'stone' },
  stairs: { wall: 0xeee5d8, edge: 0x65584e, floor: 0xa98159, line: 0x74563d, material: 'wood' },
  bedroom: { wall: 0xf1e9df, edge: 0x655a55, floor: 0xb9aaa2, line: 0x8c7a74, material: 'carpet' },
  office: { wall: 0xece5dc, edge: 0x575e62, floor: 0xa77f5d, line: 0x76563f, material: 'wood' },
  closet: { wall: 0xeee7de, edge: 0x62584e, floor: 0xb38e68, line: 0x7d6048, material: 'wood' },
  master_bath: { wall: 0xf2efea, edge: 0x54676b, floor: 0x9fb7b9, line: 0x718f92, material: 'tile' },
  panic: { wall: 0xb8bec1, edge: 0x343e43, floor: 0x6c787c, line: 0x4a5559, material: 'metal' },
  basement: { wall: 0xd4c8b9, edge: 0x4f4c49, floor: 0x8f8172, line: 0x6f6257, material: 'concrete' },
  garage: { wall: 0xc7c9c6, edge: 0x434a4c, floor: 0x767b79, line: 0x585e5d, material: 'garage' },
  yard: { wall: 0x9da88c, edge: 0x42523d, floor: 0x5f8154, line: 0x496c43, material: 'grass' },
  pool: { wall: 0xd6d2c6, edge: 0x5f625e, floor: 0xb9ae98, line: 0x8e826f, material: 'paver' },
  kennel: { wall: 0xc8c0ad, edge: 0x665d4b, floor: 0x9a8b70, line: 0x74654d, material: 'gravel' },
  lab: { wall: 0xc8d0d1, edge: 0x2d3b41, floor: 0x53646a, line: 0x3f535b, material: 'lab' },
  garden: { wall: 0x9da88c, edge: 0x42523d, floor: 0x638557, line: 0x4b7045, material: 'grass' },
  walkway: { wall: 0xc8c0af, edge: 0x5e5a50, floor: 0x9c9588, line: 0x777167, material: 'paver' },
  curb: { wall: 0xaab0ae, edge: 0x4a5354, floor: 0x7d8584, line: 0x5c6464, material: 'concrete' },
  road: { wall: 0x4f565a, edge: 0x252c30, floor: 0x343b3f, line: 0x50585c, material: 'road' },
  porch: { wall: 0xd4cab9, edge: 0x665d50, floor: 0x9b8266, line: 0x725f4b, material: 'stone' },
  driveway: { wall: 0xadb0aa, edge: 0x4f5756, floor: 0x858a86, line: 0x646a67, material: 'concrete' },
  neutral: { wall: 0xe9e1d5, edge: 0x62594f, floor: 0xb59d82, line: 0x866f58, material: 'stone' }
};

const COLORS = {
  ink: 0x20262b,
  shadow: 0x17191b,
  cream: 0xf5efe4,
  wood: 0x9a633d,
  woodLight: 0xc9905f,
  teal: 0x3f7776,
  tealLight: 0x79aaa5,
  blue: 0x5aa9bd,
  glass: 0x87d8e5,
  metal: 0xaeb8ba,
  darkMetal: 0x37444a,
  red: 0xb92e2e,
  gold: 0xc99c50,
  green: 0x56885a,
  white: 0xf5f4ee
};

export function createModernProceduralRoom(scene, room, floorId, state) {
  const g = scene.add.graphics();
  g.pm2ModernProceduralRoom = true;
  g.pm2Room = room;
  g.setDepth(room.y - 1200);
  drawRoom(g, room, floorId, state);
  return g;
}

export function createModernProceduralObject(scene, object, state) {
  const g = scene.add.graphics({ x: object.x + object.w / 2, y: object.y + object.h / 2 });
  g.pm2ModernProcedural = true;
  g.pm2Object = object;
  g.pm2StateSignature = '';
  g.setDepth(object.y + object.h);
  refreshModernProceduralObject(g, state, true);
  return g;
}

export function refreshModernProceduralObject(visual, state, force = false) {
  const object = visual?.pm2Object;
  if (!visual || !object) return;
  const signature = objectStateSignature(object, state);
  if (!force && signature === visual.pm2StateSignature) return;
  visual.pm2StateSignature = signature;
  visual.clear();
  drawObject(visual, object, state);
}

export function isModernProceduralVisual(visual) {
  return Boolean(visual?.pm2ModernProcedural);
}

export function roomThemeKey(room, floorId) {
  const id = String(room?.id || '');
  if (floorId === 5 || id.includes('lab')) return 'lab';
  if (id === 'living') return 'living';
  if (id === 'kitchen') return 'kitchen';
  if (id === 'bath') return 'bath';
  if (id === 'entry') return 'entry';
  if (id.includes('stairs') || id.includes('hall') || id.includes('foyer')) return 'stairs';
  if (id === 'front_porch') return floorId === 6 ? 'porch' : 'porch';
  if (id === 'bedroom') return 'bedroom';
  if (id === 'office') return 'office';
  if (id.includes('closet')) return 'closet';
  if (id === 'master_bath') return 'master_bath';
  if (id === 'panic_room') return 'panic';
  if (id === 'basement') return 'basement';
  if (id === 'garage' || id.includes('garage_mouth')) return 'garage';
  if (id === 'yard') return 'yard';
  if (id === 'pool_area') return 'pool';
  if (id === 'kennel_area') return 'kennel';
  if (id.includes('garden') || id.includes('yard_edge')) return 'garden';
  if (id.includes('walk')) return 'walkway';
  if (id.includes('curb')) return 'curb';
  if (id.includes('road')) return 'road';
  if (id.includes('driveway')) return 'driveway';
  return 'neutral';
}

function drawRoom(g, room, floorId, state) {
  const theme = ROOM_THEMES[roomThemeKey(room, floorId)] || ROOM_THEMES.neutral;
  const lit = state?.roomLights?.[room.id] !== false;
  const x = room.x, y = room.y, w = room.w, h = room.h;
  g.fillStyle(COLORS.shadow, .28);
  g.fillRoundedRect(x + 7, y + 9, w, h, 6);
  g.fillStyle(theme.wall, 1);
  g.fillRoundedRect(x, y, w, h, 6);
  g.lineStyle(5, theme.edge, 1);
  g.strokeRoundedRect(x, y, w, h, 6);
  g.fillStyle(lit ? theme.floor : shade(theme.floor, .78), 1);
  g.fillRoundedRect(x + 12, y + 12, Math.max(8, w - 24), Math.max(8, h - 24), 3);
  drawMaterial(g, theme.material, x + 12, y + 12, Math.max(8, w - 24), Math.max(8, h - 24), theme.line);
  drawRoomArchitecture(g, room, floorId, theme);
}

function drawMaterial(g, material, x, y, w, h, lineColor) {
  g.lineStyle(1, lineColor, .28);
  if (material === 'wood') {
    for (let yy = y + 22, row = 0; yy < y + h; yy += 24, row += 1) {
      g.lineBetween(x, yy, x + w, yy);
      const offset = row % 2 ? 38 : 10;
      for (let xx = x + offset; xx < x + w; xx += 88) g.lineBetween(xx, yy - 22, xx, yy);
    }
    return;
  }
  if (material === 'tile' || material === 'paver' || material === 'lab') {
    const size = material === 'paver' ? 38 : 30;
    for (let yy = y + size; yy < y + h; yy += size) g.lineBetween(x, yy, x + w, yy);
    for (let xx = x + size; xx < x + w; xx += size) g.lineBetween(xx, y, xx, y + h);
    return;
  }
  if (material === 'carpet') {
    g.lineStyle(1, lineColor, .18);
    for (let yy = y + 12; yy < y + h; yy += 16) for (let xx = x + 12; xx < x + w; xx += 18) g.fillStyle(lineColor, .16).fillCircle(xx + ((yy / 16) % 2 ? 5 : 0), yy, 1.2);
    return;
  }
  if (material === 'concrete' || material === 'garage') {
    for (let yy = y + 90; yy < y + h; yy += 90) g.lineBetween(x, yy, x + w, yy);
    for (let xx = x + 130; xx < x + w; xx += 130) g.lineBetween(xx, y, xx, y + h);
    if (material === 'garage') {
      g.lineStyle(3, 0xe9dfbd, .4);
      for (let xx = x + 165; xx < x + w; xx += 300) g.lineBetween(xx, y + 34, xx, y + h - 34);
    }
    return;
  }
  if (material === 'grass') {
    g.lineStyle(5, lineColor, .18);
    for (let yy = y + 18; yy < y + h; yy += 24) g.lineBetween(x + 4, yy, x + w - 4, yy + 7);
    g.fillStyle(0xb8d48e, .11);
    for (let yy = y + 36; yy < y + h; yy += 70) for (let xx = x + 30; xx < x + w; xx += 96) g.fillCircle(xx, yy, 8);
    return;
  }
  if (material === 'gravel') {
    g.fillStyle(lineColor, .28);
    for (let yy = y + 12; yy < y + h; yy += 18) for (let xx = x + 12; xx < x + w; xx += 22) g.fillCircle(xx + (yy % 7), yy, 2);
    return;
  }
  if (material === 'road') {
    g.lineStyle(4, 0xd3b356, .58);
    const mid = y + h * .58;
    for (let xx = x + 28; xx < x + w - 20; xx += 80) g.lineBetween(xx, mid, Math.min(xx + 48, x + w - 10), mid);
    g.lineStyle(2, 0xcbd1d2, .2);
    g.lineBetween(x, y + 16, x + w, y + 16);
    return;
  }
  if (material === 'stone') {
    for (let yy = y + 42, row = 0; yy < y + h; yy += 42, row += 1) {
      g.lineBetween(x, yy, x + w, yy);
      for (let xx = x + (row % 2 ? 34 : 0); xx < x + w; xx += 68) g.lineBetween(xx, yy - 42, xx, yy);
    }
  }
}

function drawRoomArchitecture(g, room, floorId, theme) {
  const x = room.x, y = room.y, w = room.w, h = room.h;
  g.lineStyle(3, 0xffffff, .28);
  g.strokeRoundedRect(x + 6, y + 6, Math.max(1, w - 12), Math.max(1, h - 12), 4);
  if (w > 240 && !String(room.id).includes('road')) {
    g.fillStyle(room.id.includes('bath') ? 0xa7e7ed : 0x8dc9d3, .72);
    g.fillRoundedRect(x + w * .36, y + 2, w * .28, 8, 3);
    g.lineStyle(2, theme.edge, .7);
    g.lineBetween(x + w * .50, y + 2, x + w * .50, y + 10);
  }
  if (floorId === 2) {
    g.fillStyle(0x5b4436, .55);
    g.fillRoundedRect(x + 28, y + 28, 420, 250, 8);
    g.fillStyle(0x33454a, .55);
    g.fillRoundedRect(x + 500, y + 28, w - 540, 250, 8);
    g.fillStyle(0x6f5947, .48);
    g.fillRoundedRect(x + 28, y + 330, 500, h - 370, 8);
    g.fillStyle(0x485457, .48);
    g.fillRoundedRect(x + 550, y + 330, w - 590, h - 370, 8);
  }
}

function drawObject(g, o, state) {
  const w = Math.max(18, o.w || 18), h = Math.max(18, o.h || 18);
  const kind = o.kind;
  if (o.styleAs === 'door') return drawDoor(g, w, h, o, state);
  if (kind === 'couch') return drawCouch(g, w, h, o);
  if (kind === 'dining_table') return drawDiningTable(g, w, h);
  if (kind === 'fridge') return drawFridge(g, w, h);
  if (kind === 'stove') return drawStove(g, w, h);
  if (kind === 'sink') return drawSink(g, w, h, o);
  if (kind === 'coffee_maker') return drawCoffee(g, w, h);
  if (kind === 'trash_can' || kind === 'outdoor_trash') return drawTrash(g, w, h, kind === 'outdoor_trash');
  if (kind === 'shower') return drawShower(g, w, h, isActiveObject(o, state));
  if (kind === 'dog_bath') return drawDogBath(g, w, h, isActiveObject(o, state));
  if (kind === 'bathtub') return drawTub(g, w, h, isActiveObject(o, state));
  if (kind === 'toilet') return drawToilet(g, w, h, isActiveObject(o, state));
  if (kind === 'bed') return drawBed(g, w, h, o, isActiveObject(o, state));
  if (kind === 'tv') return drawTv(g, w, h, state?.tv?.on);
  if (kind === 'stereo') return drawStereo(g, w, h);
  if (kind === 'desk') return drawDesk(g, w, h);
  if (kind === 'bookshelf') return drawBookshelf(g, w, h);
  if (kind === 'pool_table') return drawPoolTable(g, w, h);
  if (kind === 'arcade' || kind === 'arcade_machine') return drawArcade(g, w, h, isActiveObject(o, state));
  if (kind === 'game_console') return drawConsole(g, w, h);
  if (kind === 'dartboard') return drawDartboard(g, w, h);
  if (kind === 'treadmill') return drawTreadmill(g, w, h);
  if (kind === 'weight_bench') return drawWeightBench(g, w, h);
  if (kind === 'heavy_bag') return drawHeavyBag(g, w, h);
  if (kind === 'stairs') return drawStairs(g, w, h, o);
  if (kind === 'door' || kind === 'panic_room_door') return drawDoor(g, w, h, o, state);
  if (kind === 'garage_door') return drawGarageDoor(g, w, h, state?.objectState?.garageDoorOpen);
  if (kind === 'dog_bed') return drawDogBed(g, w, h);
  if (kind === 'dog_bowl') return drawDogBowl(g, w, h);
  if (kind === 'closet' || kind === 'cleaning_closet') return drawCloset(g, w, h, o);
  if (kind === 'nightstand') return drawNightstand(g, w, h);
  if (kind === 'kennel') return drawKennel(g, w, h);
  if (kind === 'swim_pool') return drawPool(g, w, h);
  if (kind === 'soccer_field') return drawSoccer(g, w, h);
  if (kind === 'basketball_court') return drawBasketball(g, w, h);
  if (kind === 'car') return drawCar(g, w, h, o);
  if (kind === 'bike') return drawBike(g, w, h);
  if (kind === 'motorbike') return drawMotorbike(g, w, h);
  if (kind === 'atv') return drawAtv(g, w, h);
  if (kind === 'robot_vacuum') return drawRobotVacuum(g, w, h);
  if (kind === 'vacuum_cleaner') return drawVacuum(g, w, h);
  if (kind === 'light') return drawLight(g, w, h, state?.roomLights?.[o.room] !== false);
  if (kind === 'security_panel') return drawSecurityPanel(g, w, h);
  if (kind === 'security_locker') return drawSecurityLocker(g, w, h);
  if (kind === 'security_supply') return drawSupplyBench(g, w, h);
  return drawConstructedFallback(g, w, h);
}

function objectStateSignature(o, state) {
  return [
    o.id,
    state?.tv?.on ? 1 : 0,
    state?.objectState?.garageDoorOpen ? 1 : 0,
    state?.roomLights?.[o.room] === false ? 0 : 1,
    isActiveObject(o, state) ? 1 : 0,
    state?.objectState?.doors?.[o.id] ? 1 : 0,
    state?.objectState?.doorOpen?.[o.id] ? 1 : 0
  ].join('|');
}

function isActiveObject(o, state) {
  return Boolean((state?.entities || []).some(entity => {
    if (entity.floor !== o.floor || Number(entity.actionT || 0) <= 0) return false;
    return [entity.sleepObjectId, entity.bedObjectId, entity.showerObjectId, entity.toiletObjectId, entity.activityObjectId, entity.targetObjectId, entity.objectId, entity.pending?.objectId, entity.target?.objectId, entity.target?.id].includes(o.id);
  }));
}

function shadow(g, w, h, alpha = .3) {
  g.fillStyle(COLORS.shadow, alpha);
  g.fillEllipse(3, h * .12, w * .86, h * .72);
}

function box(g, x, y, w, h, radius, fill, stroke = COLORS.ink, line = 2, alpha = 1) {
  g.fillStyle(fill, alpha);
  g.fillRoundedRect(x, y, w, h, radius);
  if (line > 0) {
    g.lineStyle(line, stroke, Math.min(1, alpha + .15));
    g.strokeRoundedRect(x, y, w, h, radius);
  }
}

function drawCouch(g, w, h, o) {
  shadow(g, w, h);
  const x = -w / 2, y = -h / 2;
  box(g, x, y, w, h, Math.min(16, h * .24), COLORS.teal, 0x244a49, 3);
  if (w >= h) {
    box(g, x + 7, y + 7, w * .31, h - 14, 10, COLORS.tealLight, 0x315f5d, 2);
    box(g, x + w * .36, y + 7, w * .28, h - 14, 10, COLORS.tealLight, 0x315f5d, 2);
    box(g, x + w * .67, y + 7, w * .26, h - 14, 10, COLORS.tealLight, 0x315f5d, 2);
    g.fillStyle(0x294e4c, 1).fillRoundedRect(x + 3, y + 3, w - 6, 12, 6);
    g.fillStyle(0x315f5d, 1).fillRoundedRect(x + 3, y + h - 14, w * .34, 11, 5);
  } else {
    box(g, x + 7, y + 7, w - 14, h * .29, 10, COLORS.tealLight, 0x315f5d, 2);
    box(g, x + 7, y + h * .36, w - 14, h * .28, 10, COLORS.tealLight, 0x315f5d, 2);
    box(g, x + 7, y + h * .68, w - 14, h * .25, 10, COLORS.tealLight, 0x315f5d, 2);
    g.fillStyle(0x294e4c, 1).fillRoundedRect(x + 3, y + 3, 12, h - 6, 6);
  }
}

function drawDiningTable(g, w, h) {
  shadow(g, w, h, .22);
  const x = -w / 2, y = -h / 2;
  box(g, x, y, w, h, 10, COLORS.woodLight, 0x5f3e29, 3);
  g.lineStyle(2, 0xe3b67f, .55);
  g.lineBetween(x + 18, 0, x + w - 18, 0);
  const chairW = Math.max(18, w * .14), chairH = Math.max(14, h * .3);
  for (const px of [-w * .32, 0, w * .32]) {
    box(g, px - chairW / 2, y - chairH - 7, chairW, chairH, 5, 0x6d4b35, 0x38291f, 2);
    box(g, px - chairW / 2, y + h + 7, chairW, chairH, 5, 0x6d4b35, 0x38291f, 2);
  }
}

function drawFridge(g, w, h) {
  shadow(g, w, h);
  box(g, -w / 2, -h / 2, w, h, 7, 0xc4ced0, 0x344148, 3);
  g.lineStyle(2, 0x758489, .8).lineBetween(-w / 2 + 4, -h * .08, w / 2 - 4, -h * .08);
  box(g, w * .23, -h * .36, 5, h * .28, 2, 0x536167, 0x2e393d, 1);
  box(g, w * .23, h * .02, 5, h * .28, 2, 0x536167, 0x2e393d, 1);
}

function drawStove(g, w, h) {
  shadow(g, w, h);
  box(g, -w / 2, -h / 2, w, h, 5, 0x525d60, 0x252c30, 3);
  for (const [x, y] of [[-.23,-.2],[.23,-.2],[-.23,.18],[.23,.18]]) {
    g.fillStyle(0x171c1f, 1).fillCircle(w * x, h * y, Math.min(w, h) * .13);
    g.lineStyle(2, 0xb46d3c, .65).strokeCircle(w * x, h * y, Math.min(w, h) * .09);
  }
  g.fillStyle(0x8fd1df, .45).fillRoundedRect(-w * .28, -h * .44, w * .56, h * .1, 3);
}

function drawSink(g, w, h, o) {
  shadow(g, w, h, .2);
  box(g, -w / 2, -h / 2, w, h, 6, 0xc0a886, 0x554638, 3);
  const double = o.vanity === 'double' || (h > w * 1.7);
  if (double) {
    const count = 2;
    for (let i = 0; i < count; i += 1) {
      const cy = -h * .22 + i * h * .44;
      g.fillStyle(0xdde7e7, 1).fillEllipse(0, cy, w * .58, h * .25);
      g.lineStyle(2, 0x6e7e80, 1).strokeEllipse(0, cy, w * .58, h * .25);
      g.fillStyle(0x5f7478, 1).fillCircle(w * .26, cy, 3);
    }
  } else {
    g.fillStyle(0xdde7e7, 1).fillEllipse(0, 0, w * .66, h * .58);
    g.lineStyle(2, 0x6e7e80, 1).strokeEllipse(0, 0, w * .66, h * .58);
    g.fillStyle(0x5f7478, 1).fillCircle(0, -h * .32, 3);
  }
}

function drawCoffee(g, w, h) {
  shadow(g, w, h, .18);
  box(g, -w * .38, -h * .42, w * .76, h * .84, 5, 0x2e3436, 0x171b1d, 2);
  g.fillStyle(0x8fd1df, .7).fillRoundedRect(-w * .22, -h * .28, w * .44, h * .18, 2);
  g.fillStyle(0x8b5635, 1).fillRoundedRect(-w * .18, h * .02, w * .36, h * .28, 3);
  g.fillStyle(0xe5ded2, 1).fillCircle(w * .24, h * .28, Math.min(w, h) * .12);
}

function drawTrash(g, w, h, outdoor) {
  shadow(g, w, h, .2);
  box(g, -w * .38, -h * .36, w * .76, h * .72, 6, outdoor ? 0x4b6b58 : 0x7e8582, 0x26332d, 3);
  box(g, -w * .44, -h * .48, w * .88, h * .2, 5, outdoor ? 0x375342 : 0x626a68, 0x26332d, 2);
  if (outdoor) {
    g.fillStyle(0x1d2821, 1).fillCircle(-w * .32, h * .38, 4);
    g.fillCircle(w * .32, h * .38, 4);
  }
}

function drawShower(g, w, h, active) {
  box(g, -w / 2, -h / 2, w, h, 7, 0xbfd6d7, 0x4f6468, 3, .92);
  g.fillStyle(0x7bcbd9, active ? .58 : .25).fillRoundedRect(-w * .39, -h * .39, w * .78, h * .78, 5);
  g.lineStyle(2, 0xeaf8f9, .8).lineBetween(-w * .38, -h * .28, w * .36, h * .25);
  g.fillStyle(0x52666a, 1).fillCircle(0, h * .28, 4);
  g.lineStyle(3, 0x53696d, 1).lineBetween(w * .26, -h * .32, w * .26, -h * .1);
  g.fillStyle(0x53696d, 1).fillCircle(w * .26, -h * .34, 5);
}

function drawDogBath(g, w, h, active) {
  box(g, -w / 2, -h / 2, w, h, 12, 0xe7e3d9, 0x4c5b5e, 3);
  g.fillStyle(0x76c6d5, active ? .78 : .45).fillRoundedRect(-w * .39, -h * .28, w * .78, h * .56, 9);
  g.lineStyle(3, 0x65777b, 1).lineBetween(w * .32, -h * .28, w * .32, -h * .48);
}

function drawTub(g, w, h, active) {
  box(g, -w / 2, -h / 2, w, h, Math.min(18, h * .35), 0xf0ece3, 0x5e6b6d, 3);
  g.fillStyle(0x70c5d5, active ? .75 : .46).fillRoundedRect(-w * .4, -h * .3, w * .8, h * .6, Math.min(14, h * .3));
  g.lineStyle(2, 0xd8f6f8, .7).lineBetween(-w * .28, 0, w * .25, -h * .05);
  g.fillStyle(0x5c6b6f, 1).fillCircle(w * .32, -h * .27, 4);
}

function drawToilet(g, w, h, active) {
  shadow(g, w, h, .18);
  box(g, -w * .36, -h * .48, w * .72, h * .28, 5, 0xe9e7df, 0x536064, 2);
  g.fillStyle(active ? 0xe9d59c : 0xe9e7df, 1).fillEllipse(0, h * .12, w * .76, h * .58);
  g.lineStyle(3, 0x536064, 1).strokeEllipse(0, h * .12, w * .76, h * .58);
  g.fillStyle(0x8fc9d2, .5).fillEllipse(0, h * .12, w * .48, h * .34);
}

function drawBed(g, w, h, o, active) {
  shadow(g, w, h, .24);
  box(g, -w / 2, -h / 2, w, h, 10, 0x7a563c, 0x3c2b22, 3);
  box(g, -w * .44, -h * .42, w * .88, h * .84, 9, 0xeee7db, 0x7b6f65, 2);
  const horizontal = w >= h;
  const head = String(o.headboard || (horizontal ? 'west' : 'north'));
  if (horizontal) {
    const west = head === 'west';
    g.fillStyle(0x563b2c, 1).fillRoundedRect(west ? -w / 2 : w / 2 - 12, -h / 2, 12, h, 5);
    const px = west ? -w * .29 : w * .29;
    g.fillStyle(0xf8f4ec, 1).fillRoundedRect(px - w * .12, -h * .31, w * .24, h * .28, 7);
    g.fillRoundedRect(px - w * .12, h * .03, w * .24, h * .28, 7);
    g.fillStyle(active ? 0x4b6f8d : 0x607f9a, 1).fillRoundedRect(west ? -w * .08 : -w * .43, -h * .38, w * .51, h * .76, 8);
    g.lineStyle(2, 0x91afc2, .65).lineBetween(west ? w * .08 : -w * .08, -h * .32, west ? w * .08 : -w * .08, h * .32);
  } else {
    const north = head !== 'south';
    g.fillStyle(0x563b2c, 1).fillRoundedRect(-w / 2, north ? -h / 2 : h / 2 - 12, w, 12, 5);
    const py = north ? -h * .29 : h * .29;
    g.fillStyle(0xf8f4ec, 1).fillRoundedRect(-w * .31, py - h * .12, w * .28, h * .24, 7);
    g.fillRoundedRect(w * .03, py - h * .12, w * .28, h * .24, 7);
    g.fillStyle(active ? 0x4b6f8d : 0x607f9a, 1).fillRoundedRect(-w * .38, north ? -h * .08 : -h * .43, w * .76, h * .51, 8);
  }
}

function drawTv(g, w, h, on) {
  shadow(g, w, h, .18);
  box(g, -w / 2, -h / 2, w, h, 4, 0x25292c, 0x101315, 3);
  g.fillStyle(on ? 0x62c4d7 : 0x111719, 1).fillRoundedRect(-w * .42, -h * .32, w * .84, h * .64, 3);
  if (on) {
    g.fillStyle(0xb8f3f8, .45).fillTriangle(-w * .35, h * .24, w * .35, -h * .22, w * .1, h * .24);
  }
}

function drawStereo(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 5, 0x654f3f, 0x342a23, 2);
  g.fillStyle(0x1f2426, 1).fillCircle(-w * .25, 0, h * .25);
  g.fillCircle(w * .25, 0, h * .25);
  g.fillStyle(0x85d9e4, .62).fillRoundedRect(-w * .12, -h * .3, w * .24, h * .16, 2);
}

function drawDesk(g, w, h) {
  shadow(g, w, h, .22);
  box(g, -w / 2, -h / 2, w, h, 6, COLORS.woodLight, 0x5a3a28, 3);
  box(g, -w * .24, -h * .31, w * .48, h * .38, 4, 0x30383d, 0x151b1e, 2);
  g.fillStyle(0x75c9d8, .7).fillRoundedRect(-w * .18, -h * .27, w * .36, h * .24, 2);
  g.lineStyle(2, 0x6a4933, .7).lineBetween(-w * .33, h * .2, w * .33, h * .2);
}

function drawBookshelf(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 4, 0x70472e, 0x38261c, 3);
  const shelves = Math.max(3, Math.floor(h / 28));
  for (let i = 0; i < shelves; i += 1) {
    const yy = -h / 2 + (i + 1) * h / (shelves + 1);
    g.lineStyle(3, 0x3d291f, 1).lineBetween(-w * .42, yy, w * .42, yy);
    for (let x = -w * .34, n = 0; x < w * .34; x += Math.max(6, w * .16), n += 1) {
      g.fillStyle([0x9f4f42,0xc29b54,0x4e7180,0x5d7d57][n % 4], 1).fillRect(x, yy - h / (shelves + 1) * .55, Math.max(4, w * .1), h / (shelves + 1) * .48);
    }
  }
}

function drawPoolTable(g, w, h) {
  shadow(g, w, h, .25);
  box(g, -w / 2, -h / 2, w, h, 12, 0x573b2b, 0x2c211b, 4);
  box(g, -w * .43, -h * .38, w * .86, h * .76, 8, 0x2d7d65, 0x193f35, 2);
  for (const [x,y] of [[-.4,-.34],[0,-.37],[.4,-.34],[-.4,.34],[0,.37],[.4,.34]]) g.fillStyle(0x101615, 1).fillCircle(w * x, h * y, Math.min(w,h)*.06);
  const balls = [[-.12,-.05,0xf1c66a],[0,-.05,0xd94747],[.12,-.05,0x4e77d1],[-.06,.08,0x7e4bb6],[.06,.08,0xe9e3d7]];
  for (const [x,y,c] of balls) g.fillStyle(c,1).fillCircle(w*x,h*y,Math.min(w,h)*.035);
  g.fillStyle(0xf7f3e9,1).fillCircle(-w*.28,0,Math.min(w,h)*.04);
}

function drawArcade(g, w, h, active) {
  shadow(g, w, h, .24);
  box(g, -w / 2, -h / 2, w, h, 7, 0x27313a, 0x11171b, 3);
  g.fillStyle(active ? 0x63d5e7 : 0x315667, 1).fillRoundedRect(-w * .34, -h * .34, w * .68, h * .34, 4);
  g.lineStyle(2, 0xb1f4fb, .55).strokeRoundedRect(-w * .34, -h * .34, w * .68, h * .34, 4);
  g.fillStyle(0x151b1f, 1).fillRoundedRect(-w * .38, h * .02, w * .76, h * .28, 4);
  g.fillStyle(0xd84a4a, 1).fillCircle(w * .18, h * .13, 4);
  g.lineStyle(3, 0xc7cdd0, 1).lineBetween(-w * .16, h * .06, -w * .16, h * .2);
  g.fillStyle(0xe0b34e, 1).fillCircle(-w * .16, h * .04, 4);
}

function drawConsole(g, w, h) {
  shadow(g, w, h, .22);
  box(g, -w / 2, -h / 2, w, h, 7, 0x4c443e, 0x26221f, 3);
  g.fillStyle(0x11171a, 1).fillRoundedRect(-w * .38, -h * .32, w * .76, h * .34, 4);
  g.fillStyle(0x6ed2e2, .65).fillRoundedRect(-w * .31, -h * .27, w * .62, h * .24, 3);
  box(g, -w * .18, h * .08, w * .36, h * .24, 5, 0x242a2e, 0x111416, 2);
  g.fillStyle(0xd54848, 1).fillCircle(w * .08, h * .18, 3);
  g.fillStyle(0x6dbb67, 1).fillCircle(w * .14, h * .12, 3);
}

function drawDartboard(g, w, h) {
  const r = Math.min(w, h) * .48;
  g.fillStyle(0x242628, 1).fillCircle(0, 0, r);
  g.lineStyle(2, 0xd9d1c4, 1).strokeCircle(0, 0, r);
  for (let i = 1; i <= 3; i += 1) g.lineStyle(2, i % 2 ? 0xc84a42 : 0x5f8b62, 1).strokeCircle(0, 0, r * (1 - i * .2));
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) g.lineStyle(1, 0xe8e3da, .8).lineBetween(0, 0, Math.cos(a) * r, Math.sin(a) * r);
}

function drawTreadmill(g, w, h) {
  shadow(g, w, h, .22);
  box(g, -w / 2, -h * .22, w, h * .44, 9, 0x343c40, 0x171c1f, 3);
  g.fillStyle(0x15191b, 1).fillRoundedRect(-w * .38, -h * .12, w * .76, h * .24, 6);
  g.lineStyle(4, 0x77868b, 1).lineBetween(-w * .36, -h * .18, -w * .36, -h * .48);
  g.lineBetween(w * .36, -h * .18, w * .36, -h * .48);
  box(g, -w * .22, -h * .5, w * .44, h * .18, 5, 0x56636a, 0x252c30, 2);
  g.fillStyle(0x73cad8, .7).fillRoundedRect(-w * .1, -h * .46, w * .2, h * .09, 2);
}

function drawWeightBench(g, w, h) {
  shadow(g, w, h, .22);
  box(g, -w * .34, -h * .18, w * .68, h * .36, 6, 0x3a454a, 0x171c1f, 3);
  g.lineStyle(5, 0x8d999c, 1).lineBetween(-w * .44, -h * .34, -w * .44, h * .34);
  g.lineBetween(w * .44, -h * .34, w * .44, h * .34);
  g.lineStyle(5, 0xb8c0c1, 1).lineBetween(-w * .48, -h * .28, w * .48, -h * .28);
  for (const x of [-w*.49,-w*.43,w*.43,w*.49]) g.fillStyle(0x202629,1).fillCircle(x,-h*.28,Math.min(w,h)*.11);
}

function drawHeavyBag(g, w, h) {
  g.lineStyle(4, 0x7b8588, 1).lineBetween(0, -h / 2, 0, -h * .34);
  shadow(g, w, h, .2);
  box(g, -w * .32, -h * .34, w * .64, h * .72, Math.min(14,w*.25), 0x7c3030, 0x341717, 3);
  g.lineStyle(2, 0xd18b75, .65).lineBetween(-w * .22, -h * .08, w * .22, -h * .08);
}

function drawStairs(g, w, h, o) {
  box(g, -w / 2, -h / 2, w, h, 4, 0x58646a, 0x263136, 3);
  const horizontal = w > h;
  g.lineStyle(2, 0xc6d0d1, .8);
  const count = Math.max(5, Math.floor((horizontal ? w : h) / 14));
  for (let i = 1; i < count; i += 1) {
    if (horizontal) g.lineBetween(-w / 2 + i * w / count, -h * .38, -w / 2 + i * w / count, h * .38);
    else g.lineBetween(-w * .38, -h / 2 + i * h / count, w * .38, -h / 2 + i * h / count);
  }
  g.lineStyle(3, COLORS.gold, 1);
  if (horizontal) g.lineBetween(-w * .16, 0, w * .16, 0);
  else g.lineBetween(0, -h * .16, 0, h * .16);
}

function drawDoor(g, w, h, o, state) {
  const open = Boolean(state?.objectState?.doors?.[o.id] || state?.objectState?.doorOpen?.[o.id]);
  box(g, -w / 2, -h / 2, w, h, 3, o.kind === 'panic_room_door' ? 0x5e696d : 0x83583a, 0x36271f, 3, open ? .45 : 1);
  g.fillStyle(0xd8b566, 1).fillCircle(w * .32, 0, 3);
  if (open) g.lineStyle(3, 0x7fc6d3, .75).lineBetween(-w / 2, -h / 2, w / 2, h / 2);
}

function drawGarageDoor(g, w, h, open) {
  box(g, -w / 2, -h / 2, w, h, 3, 0x7e898b, 0x313b3e, 3, open ? .35 : 1);
  g.lineStyle(2, 0xc7d0d0, .6);
  for (let x = -w / 2 + 20; x < w / 2; x += 26) g.lineBetween(x, -h * .38, x, h * .38);
}

function drawDogBed(g, w, h) {
  shadow(g, w, h, .18);
  box(g, -w / 2, -h / 2, w, h, Math.min(14,h*.35), 0x795545, 0x3c2c26, 3);
  g.fillStyle(0xb58a70, 1).fillEllipse(0, 0, w * .72, h * .58);
}

function drawDogBowl(g, w, h) {
  shadow(g, w, h, .15);
  g.fillStyle(0x69777a, 1).fillEllipse(0, 0, w, h * .75);
  g.lineStyle(3, 0x2f393c, 1).strokeEllipse(0, 0, w, h * .75);
  g.fillStyle(0x9bd4dd, .6).fillEllipse(0, -h * .04, w * .66, h * .38);
}

function drawCloset(g, w, h, o) {
  box(g, -w / 2, -h / 2, w, h, 4, 0x7b563b, 0x3b2a20, 3);
  g.lineStyle(2, 0xc69b6b, .65).lineBetween(0, -h * .42, 0, h * .42);
  g.fillStyle(0xd8b566, 1).fillCircle(-Math.min(5,w*.08), 0, 2.5);
  g.fillCircle(Math.min(5,w*.08), 0, 2.5);
}

function drawNightstand(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 5, 0x8b5c3d, 0x402c22, 3);
  g.lineStyle(2, 0xc89465, .65).lineBetween(-w * .35, 0, w * .35, 0);
  g.fillStyle(0xd8b566, 1).fillCircle(w * .22, -h * .22, 2.5);
  g.fillCircle(w * .22, h * .22, 2.5);
}

function drawKennel(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 6, 0x5b4c3e, 0x2e2721, 3);
  g.lineStyle(3, 0xb2b9b8, .9);
  for (let x = -w * .38; x <= w * .38; x += Math.max(10,w*.16)) g.lineBetween(x, -h * .38, x, h * .38);
  g.lineBetween(-w * .4, 0, w * .4, 0);
  g.fillStyle(0x22292b, .8).fillRoundedRect(-w * .22, h * .05, w * .44, h * .33, 5);
}

function drawPool(g, w, h) {
  shadow(g, w, h, .2);
  box(g, -w / 2, -h / 2, w, h, 22, 0xe8dfcf, 0x5f6e70, 4);
  box(g, -w * .43, -h * .43, w * .86, h * .86, 18, 0x42a9c0, 0x276f7f, 3);
  g.lineStyle(3, 0xb9f0f5, .55);
  for (let y = -h * .3; y <= h * .3; y += h * .16) g.lineBetween(-w * .32, y, w * .32, y + 8);
  g.lineStyle(3, 0xd4d9d8, 1).lineBetween(w * .3, -h * .28, w * .3, h * .1);
  g.lineBetween(w * .18, -h * .28, w * .18, h * .1);
}

function drawSoccer(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 10, 0x4f8250, 0x315b35, 4);
  g.lineStyle(5, 0xf0eee5, .86).strokeRect(-w * .42, -h * .4, w * .84, h * .8);
  g.lineBetween(0, -h * .4, 0, h * .4);
  g.strokeCircle(0, 0, Math.min(w,h)*.16);
  g.strokeRect(-w*.42,-h*.18,w*.13,h*.36);
  g.strokeRect(w*.29,-h*.18,w*.13,h*.36);
}

function drawBasketball(g, w, h) {
  box(g, -w / 2, -h / 2, w, h, 8, 0x9b6d4a, 0x4c3525, 4);
  g.lineStyle(4, 0xe7ddc8, .86).strokeRect(-w * .43, -h * .4, w * .86, h * .8);
  g.lineBetween(0, -h * .4, 0, h * .4);
  g.strokeCircle(0, 0, Math.min(w,h)*.17);
  g.strokeRoundedRect(-w*.43,-h*.24,w*.18,h*.48,5);
  g.strokeRoundedRect(w*.25,-h*.24,w*.18,h*.48,5);
}

function drawCar(g, w, h, o) {
  const sports = o.vehicleBody === 'convertible' || o.vehicleBody === 'sports';
  shadow(g, w, h, .36);
  const body = sports ? 0xb72b2e : 0xe4e2da;
  const edge = sports ? 0x3e1114 : 0x273239;
  for (const x of [-w * .5, w * .5]) {
    box(g, x - w * .08, -h * .34, w * .16, h * .22, 5, 0x171b1d, 0x090b0c, 1);
    box(g, x - w * .08, h * .12, w * .16, h * .22, 5, 0x171b1d, 0x090b0c, 1);
  }
  box(g, -w * .42, -h * .48, w * .84, h * .96, Math.min(w*.22,20), body, edge, 4);
  g.fillStyle(edge, 1).fillRoundedRect(-w * .29, -h * .22, w * .58, h * .34, 10);
  g.fillStyle(0x54a9c4, .82).fillRoundedRect(-w * .24, -h * .18, w * .48, h * .25, 8);
  g.fillStyle(0x22323a, 1).fillRoundedRect(-w * .22, h * .13, w * .44, h * .18, 7);
  g.lineStyle(2, sports ? 0xe86f70 : 0xffffff, .5).strokeRoundedRect(-w * .34, -h * .42, w * .68, h * .16, 8);
  g.lineStyle(2, sports ? 0x7b161a : 0xb7b6b0, .75).lineBetween(-w * .32, h * .34, w * .32, h * .34);
  g.fillStyle(0xf5efc8, 1).fillRoundedRect(-w * .29, -h * .47, w * .18, h * .035, 2);
  g.fillRoundedRect(w * .11, -h * .47, w * .18, h * .035, 2);
  g.fillStyle(0xc82d2d, 1).fillRoundedRect(-w * .29, h * .44, w * .18, h * .035, 2);
  g.fillRoundedRect(w * .11, h * .44, w * .18, h * .035, 2);
  g.fillStyle(edge, 1).fillRoundedRect(-w * .5, -h * .08, w * .12, h * .12, 4);
  g.fillRoundedRect(w * .38, -h * .08, w * .12, h * .12, 4);
}

function drawBike(g, w, h) {
  shadow(g, w, h, .18);
  const r = Math.min(w * .42, h * .18);
  g.lineStyle(4, 0x1b2225, 1).strokeCircle(0, -h * .34, r);
  g.strokeCircle(0, h * .34, r);
  g.lineStyle(4, 0xc3a54f, 1).lineBetween(0, -h * .22, -w * .22, h * .12);
  g.lineBetween(-w * .22, h * .12, 0, h * .22);
  g.lineBetween(0, h * .22, w * .22, h * .02);
  g.lineBetween(w * .22, h * .02, 0, -h * .22);
  g.lineBetween(-w * .22, h * .12, w * .22, h * .02);
  g.lineStyle(3, 0xbec6c7, 1).lineBetween(-w * .25, -h * .2, w * .25, -h * .2);
}

function drawMotorbike(g, w, h) {
  shadow(g, w, h, .24);
  const r = Math.min(w * .34, h * .12);
  g.fillStyle(0x161b1d, 1).fillCircle(0, -h * .38, r);
  g.fillCircle(0, h * .38, r);
  box(g, -w * .25, -h * .18, w * .5, h * .42, 8, 0x304f63, 0x16252e, 3);
  box(g, -w * .18, h * .02, w * .36, h * .24, 6, 0x202629, 0x111416, 2);
  g.lineStyle(4, 0xb7c1c4, 1).lineBetween(-w * .34, -h * .24, w * .34, -h * .24);
  g.fillStyle(0x70d3e2, .8).fillRoundedRect(-w * .18, -h * .28, w * .36, h * .12, 4);
}

function drawAtv(g, w, h) {
  shadow(g, w, h, .28);
  for (const x of [-w * .47, w * .47]) for (const y of [-h * .28, h * .28]) box(g, x - w * .12, y - h * .12, w * .24, h * .24, 5, 0x171c1f, 0x090c0d, 1);
  box(g, -w * .34, -h * .38, w * .68, h * .76, 9, 0x465b61, 0x1d282c, 3);
  box(g, -w * .2, h * .02, w * .4, h * .28, 6, 0x202629, 0x111416, 2);
  g.lineStyle(4, 0xb3bdc0, 1).lineBetween(-w * .34, -h * .3, w * .34, -h * .3);
  g.fillStyle(0xf1c66a, 1).fillCircle(-w * .19, -h * .36, 4);
  g.fillCircle(w * .19, -h * .36, 4);
}

function drawRobotVacuum(g, w, h) {
  shadow(g, w, h, .18);
  g.fillStyle(0x30383c, 1).fillCircle(0, 0, Math.min(w,h)*.46);
  g.lineStyle(3, 0x121719, 1).strokeCircle(0, 0, Math.min(w,h)*.46);
  g.fillStyle(0x72c9d7, .7).fillCircle(0, -h*.08, Math.min(w,h)*.12);
}

function drawVacuum(g, w, h) {
  shadow(g, w, h, .18);
  box(g, -w*.32, h*.05, w*.64, h*.38, 6, 0x526a71, 0x233138, 2);
  g.lineStyle(5, 0x798b90, 1).lineBetween(0, h*.05, 0, -h*.46);
  box(g, -w*.24, -h*.47, w*.48, h*.18, 4, 0x35464d, 0x1c272b, 2);
}

function drawLight(g, w, h, on) {
  g.fillStyle(on ? 0xf1d28c : 0x777b78, on ? .85 : .5).fillCircle(0,0,Math.min(w,h)*.42);
  g.lineStyle(2, 0x5d5140, .8).strokeCircle(0,0,Math.min(w,h)*.42);
}

function drawSecurityPanel(g, w, h) {
  box(g,-w/2,-h/2,w,h,5,0x48565b,0x1e292d,3);
  g.fillStyle(0x68d4e4,.8).fillRoundedRect(-w*.3,-h*.25,w*.6,h*.3,3);
  for(let i=0;i<3;i+=1)g.fillStyle(i===0?0xd95757:0x7aaa68,1).fillCircle(-w*.2+i*w*.2,h*.25,3);
}

function drawSecurityLocker(g, w, h) {
  box(g,-w/2,-h/2,w,h,4,0x59666a,0x222c30,3);
  g.lineStyle(2,0x9aa6a8,.65).lineBetween(0,-h*.43,0,h*.43);
  g.fillStyle(0xd1a94e,1).fillCircle(w*.16,0,3);
}

function drawSupplyBench(g, w, h) {
  box(g,-w/2,-h/2,w,h,5,0x705440,0x35291f,3);
  g.fillStyle(0x87945f,1).fillRoundedRect(-w*.35,-h*.28,w*.28,h*.56,4);
  g.fillStyle(0x9a6b4e,1).fillRoundedRect(w*.04,-h*.28,w*.31,h*.56,4);
}

function drawConstructedFallback(g, w, h) {
  shadow(g,w,h,.18);
  box(g,-w/2,-h/2,w,h,6,0x7b6b5b,0x3c342d,3);
  g.lineStyle(2,0xc4aa89,.6).strokeRoundedRect(-w*.35,-h*.32,w*.7,h*.64,4);
}

function shade(color, factor) {
  const r = Math.max(0, Math.min(255, Math.round(((color >> 16) & 255) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((color >> 8) & 255) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((color & 255) * factor)));
  return (r << 16) | (g << 8) | b;
}
