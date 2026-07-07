import { CANVAS_H, CANVAS_W, PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

const STYLE = {
  page: '#eee5d8', void: '#1d222b', wall: '#f6efe4', wallInk: '#2d2824', wallSoft: '#cdbfae',
  floor: '#d8c09a', floorAlt: '#c9ae83', label: '#51483f', ink: '#352f2a', shadow: 'rgba(50,35,22,.22)',
  cream: '#f8f2e8', linen: '#eadfce', wood: '#9b6b45', wood2: '#c48d5e', teal: '#7da5a1', teal2: '#9ebfba',
  blue: '#a5c8cf', metal: '#bbb9b0', dark: '#3d3935', clay: '#b66d55', green: '#557d67'
};

export function drawStyledWorld(ctx, state, doorways, windows) {
  ctx.fillStyle = STYLE.page;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = STYLE.void;
  ctx.fillRect(PLAY_W, 0, CANVAS_W - PLAY_W, CANVAS_H);

  const floor = floors[state.floor];
  for (const room of floor.rooms) drawRoom(ctx, state, room);
  drawDoorways(ctx, state, doorways);
  drawWindows(ctx, state, windows);

  ctx.fillStyle = STYLE.ink;
  ctx.font = '900 22px system-ui';
  ctx.fillText(floor.name, 26, 694);
}

function drawRoom(ctx, state, room) {
  const lit = state.roomLights[room.id] !== false;
  ctx.save();
  ctx.fillStyle = STYLE.shadow;
  rr(ctx, room.x + 7, room.y + 8, room.w, room.h, 4, true);
  ctx.lineWidth = 7;
  ctx.strokeStyle = STYLE.wallInk;
  ctx.fillStyle = STYLE.wall;
  rr(ctx, room.x, room.y, room.w, room.h, 3, true, true);
  ctx.fillStyle = lit ? STYLE.floor : STYLE.floorAlt;
  rr(ctx, room.x + 13, room.y + 13, room.w - 26, room.h - 26, 2, true);
  drawPlankFloor(ctx, room);
  ctx.fillStyle = STYLE.label;
  ctx.font = '800 12px system-ui';
  ctx.fillText(room.name, room.x + 18, room.y + 29);
  ctx.fillStyle = lit ? '#e8c861' : '#91877b';
  circle(ctx, room.x + room.w - 24, room.y + 25, 6, true);
  ctx.restore();
}

function drawPlankFloor(ctx, room) {
  ctx.save();
  ctx.globalAlpha = .16;
  ctx.strokeStyle = '#7c6044';
  ctx.lineWidth = 1;
  for (let y = room.y + 42; y < room.y + room.h - 14; y += 26) {
    line(ctx, room.x + 18, y, room.x + room.w - 18, y + ((y % 3) - 1));
  }
  ctx.restore();
}

function drawDoorways(ctx, state, doorways) {
  for (const d of doorways.filter(x => x.floor === state.floor)) {
    ctx.save();
    ctx.fillStyle = STYLE.floor;
    ctx.fillRect(d.x - 3, d.y - 3, d.w + 6, d.h + 6);
    ctx.strokeStyle = '#6f665e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (d.w > d.h) {
      ctx.arc(d.x + 10, d.y + d.h, 30, -Math.PI / 2, 0);
      ctx.moveTo(d.x + 10, d.y + d.h);
      ctx.lineTo(d.x + Math.min(46, d.w), d.y + d.h);
    } else {
      ctx.arc(d.x, d.y + 10, 30, 0, Math.PI / 2);
      ctx.moveTo(d.x, d.y + 10);
      ctx.lineTo(d.x, d.y + Math.min(46, d.h));
    }
    ctx.stroke();
    ctx.restore();
  }
}

function drawWindows(ctx, state, windows) {
  const openWindows = state.objectState.openWindows || {};
  for (const w of windows.filter(x => x.floor === state.floor)) {
    ctx.save();
    ctx.fillStyle = openWindows[w.id] ? '#c6eef0' : '#a8d2d8';
    rr(ctx, w.x - 1, w.y - 3, w.w + 2, w.h + 7, 2, true);
    ctx.strokeStyle = STYLE.wall;
    ctx.lineWidth = 2;
    rr(ctx, w.x - 2, w.y - 4, w.w + 4, w.h + 9, 2, false, true);
    ctx.restore();
  }
}

export function drawStyledObject(ctx, o, state) {
  ctx.save();
  ctx.fillStyle = STYLE.shadow;
  rr(ctx, o.x + 5, o.y + 6, o.w, o.h, 10, true);
  ctx.restore();

  if (o.kind === 'couch') return couch(ctx, o), true;
  if (o.kind === 'tv') return tv(ctx, o, state), true;
  if (o.kind === 'stereo') return stereo(ctx, o, state), true;
  if (o.kind === 'fridge') return fridge(ctx, o, state), true;
  if (o.kind === 'stove') return stove(ctx, o, state), true;
  if (o.kind === 'sink') return sink(ctx, o), true;
  if (o.kind === 'trash_can') return trash(ctx, o, state.garbage?.kitchen || 0), true;
  if (o.kind === 'outdoor_trash') return outdoorTrash(ctx, o), true;
  if (o.kind === 'shower') return shower(ctx, o), true;
  if (o.kind === 'toilet') return toilet(ctx, o), true;
  if (o.kind === 'door') return frontDoor(ctx, o, state), true;
  if (o.kind === 'stairs') return stairs(ctx, o), true;
  if (o.kind === 'bed') return bed(ctx, o), true;
  if (o.kind === 'desk') return desk(ctx, o), true;
  if (o.kind === 'dog_bowl') return bowl(ctx, o), true;
  if (o.kind === 'light') return light(ctx, o, state), true;
  if (o.kind === 'bookshelf') return bookshelf(ctx, o), true;
  if (o.kind === 'pool_table') return poolTable(ctx, o), true;
  if (o.kind === 'arcade') return arcade(ctx, o), true;
  if (o.kind === 'game_console') return consoleSetup(ctx, o), true;
  if (o.kind === 'dartboard') return dartboard(ctx, o), true;
  if (o.kind === 'treadmill') return treadmill(ctx, o), true;
  if (o.kind === 'weight_bench') return weightBench(ctx, o), true;
  if (o.kind === 'heavy_bag') return heavyBag(ctx, o), true;
  if (o.kind === 'swim_pool') return swimPool(ctx, o), true;
  if (o.kind === 'kennel') return kennel(ctx, o), true;
  if (o.kind === 'car') return car(ctx, o, state), true;
  if (o.kind === 'bike') return bike(ctx, o), true;
  if (o.kind === 'motorbike') return motorbike(ctx, o), true;
  if (o.kind === 'atv') return atv(ctx, o), true;
  if (o.kind === 'workout') return workout(ctx, o), true;
  return false;
}

function couch(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 18, true, true, STYLE.teal, '#66817d', 2); rr(ctx, o.x + 10, o.y + 9, o.w * .38, o.h - 18, 12, true, false, STYLE.teal2); rr(ctx, o.x + o.w * .53, o.y + 9, o.w * .36, o.h - 18, 12, true, false, STYLE.teal2); }
function tv(ctx, o, state) { rr(ctx, o.x, o.y, o.w, o.h, 6, true, false, STYLE.dark); rr(ctx, o.x + 8, o.y + 6, o.w - 16, o.h - 12, 4, true, false, state.tv.on ? STYLE.blue : '#24211f'); }
function stereo(ctx, o, state) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#574b44'); circle(ctx, o.x + 15, o.y + 18, 9, true, '#282522'); circle(ctx, o.x + o.w - 15, o.y + 18, 9, true, '#282522'); ctx.fillStyle = state.music ? '#e5bd5b' : '#d4c8b9'; ctx.font = '900 12px system-ui'; ctx.fillText(state.music ? '♪' : 'ST', o.x + 24, o.y + 22); }
function fridge(ctx, o, state) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, true, STYLE.cream, '#c7beb2', 2); line(ctx, o.x + 8, o.y + o.h * .42, o.x + o.w - 8, o.y + o.h * .42, '#d5c9bc', 1); rr(ctx, o.x + 9, o.y + 20, 5, 44, 2, true, false, STYLE.blue); if (state.objectState.fridgeOpen) rr(ctx, o.x + o.w - 2, o.y + 10, 38, o.h - 20, 4, true, true, '#fffdf6', STYLE.blue, 2); }
function stove(ctx, o, state) { rr(ctx, o.x, o.y, o.w, o.h, 7, true, false, STYLE.metal); for (let i = 0; i < 4; i++) circle(ctx, o.x + 18 + (i % 2) * 34, o.y + 17 + Math.floor(i / 2) * 26, 9, false, '#655f59'); if (state.objectState.stovePan) { ellipse(ctx, o.x + 39, o.y + 35, 22, 13, '#3c3835'); line(ctx, o.x + 56, o.y + 34, o.x + 78, o.y + 28, '#3c3835', 3); } }
function sink(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#c7c4bd'); rr(ctx, o.x + 9, o.y + 8, o.w - 18, o.h - 16, 9, true, false, '#b6d3d7'); circle(ctx, o.x + o.w / 2, o.y + 15, 3, true, '#7f7870'); }
function trash(ctx, o, level) { rr(ctx, o.x, o.y, o.w, o.h, 7, true, false, level > 80 ? '#a26b5c' : '#8e968d'); rr(ctx, o.x + 5, o.y + 4, o.w - 10, 8, 4, true, false, '#6f756e'); }
function outdoorTrash(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 9, true, false, '#6b8b73'); rr(ctx, o.x + 8, o.y + 8, o.w - 16, 10, 4, true, false, '#4c6453'); }
function shower(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#d7e4e2'); rr(ctx, o.x + 8, o.y + 8, o.w - 16, o.h - 16, 6, true, true, '#9fcbd3', STYLE.cream, 2); }
function toilet(ctx, o) { rr(ctx, o.x + 4, o.y, o.w - 8, 20, 5, true, false, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 19, 16, STYLE.cream); ellipse(ctx, o.x + o.w / 2, o.y + 39, 10, 8, '#cbd7d6'); }
function frontDoor(ctx, o, state) { rr(ctx, o.x, o.y, o.w, o.h, 2, true, false, STYLE.wood); if (state.objectState.doorOpen) rr(ctx, o.x + o.w, o.y + 8, 15, o.h - 16, 2, true, false, STYLE.wood2); }
function stairs(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#b3a28c'); for (let y = o.y + 12; y < o.y + o.h; y += 14) line(ctx, o.x + 12, y, o.x + o.w - 12, y, '#f3eadf', 2); ctx.fillStyle = STYLE.ink; ctx.font = '900 9px system-ui'; ctx.fillText(o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', o.x + 10, o.y + o.h - 10); }
function bed(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 17, true, false, '#b9a287'); rr(ctx, o.x + 14, o.y + 10, o.w - 28, o.h - 20, 15, true, false, STYLE.linen); rr(ctx, o.x + 18, o.y + 12, 54, 34, 12, true, false, '#fffaf2'); rr(ctx, o.x + 78, o.y + 18, o.w - 96, o.h - 34, 14, true, false, '#d6c7b5'); }
function desk(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#b78556'); rr(ctx, o.x + 32, o.y + 9, 54, 36, 4, true, false, '#4b4641'); rr(ctx, o.x + 39, o.y + 15, 40, 17, 2, true, false, STYLE.blue); line(ctx, o.x + 48, o.y + 39, o.x + 74, o.y + 39, '#ede4d7', 2); }
function bowl(ctx, o) { ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, STYLE.clay); ellipse(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, o.h / 3, '#8a4639'); }
function light(ctx, o, state) { circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 11, true, state.roomLights ? '#e8c35a' : '#9b948a'); }
function bookshelf(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 7, true, false, '#9d704d'); for (let y = o.y + 14; y < o.y + o.h - 8; y += 24) { line(ctx, o.x + 8, y, o.x + o.w - 8, y, '#d4b083', 5); ctx.fillStyle = STYLE.teal; ctx.fillRect(o.x + 12, y + 7, 10, 14); ctx.fillStyle = '#c78b76'; ctx.fillRect(o.x + 27, y + 7, 9, 14); ctx.fillStyle = '#d2b064'; ctx.fillRect(o.x + 42, y + 7, 12, 14); } }
function poolTable(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 18, true, false, '#8b6b49'); rr(ctx, o.x + 14, o.y + 14, o.w - 28, o.h - 28, 12, true, false, STYLE.green); for (const [px, py] of [[16,16],[o.w/2,12],[o.w-16,16],[16,o.h-16],[o.w/2,o.h-12],[o.w-16,o.h-16]]) circle(ctx, o.x + px, o.y + py, 7, true, '#2c2622'); }
function arcade(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#5d4b5d'); rr(ctx, o.x + 8, o.y + 10, o.w - 16, 28, 4, true, false, '#2a2728'); rr(ctx, o.x + 14, o.y + 16, o.w - 28, 12, 2, true, false, STYLE.blue); circle(ctx, o.x + 18, o.y + 52, 5, true, STYLE.clay); }
function consoleSetup(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 11, true, false, '#7b7068'); rr(ctx, o.x + 16, o.y + 10, o.w - 32, 28, 6, true, false, '#363330'); rr(ctx, o.x + 32, o.y + 16, o.w - 64, 14, 3, true, false, STYLE.blue); }
function dartboard(ctx, o) { circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 2, true, '#2c2824'); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, o.w / 3, false, '#efe7dc'); circle(ctx, o.x + o.w / 2, o.y + o.h / 2, 4, true, STYLE.clay); }
function treadmill(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 12, true, false, '#686660'); rr(ctx, o.x + 14, o.y + 12, o.w - 28, o.h - 24, 8, true, false, '#2e2d2b'); }
function weightBench(ctx, o) { rr(ctx, o.x, o.y + 12, o.w, 24, 10, true, false, '#6c6159'); line(ctx, o.x + 8, o.y + 6, o.x + o.w - 8, o.y + 6, '#f1e9de', 4); }
function heavyBag(ctx, o) { line(ctx, o.x + o.w / 2, o.y, o.x + o.w / 2, o.y + 16, '#b99d70', 2); rr(ctx, o.x + 6, o.y + 16, o.w - 12, o.h - 20, 16, true, false, '#7b4e46'); }
function swimPool(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 28, true, false, '#d3c6ad'); rr(ctx, o.x + 12, o.y + 12, o.w - 24, o.h - 24, 22, true, false, '#74bac4'); ctx.strokeStyle = 'rgba(255,255,255,.55)'; for (let y = o.y + 40; y < o.y + o.h; y += 36) { ctx.beginPath(); ctx.moveTo(o.x + 24, y); ctx.quadraticCurveTo(o.x + o.w / 2, y - 20, o.x + o.w - 24, y); ctx.stroke(); } }
function kennel(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 14, true, false, '#8b654c'); ctx.fillStyle = '#3a332d'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h - 16, 20, Math.PI, 0); ctx.fill(); }
function workout(ctx, o) { rr(ctx, o.x, o.y, o.w, o.h, 8, true, false, '#78766d'); line(ctx, o.x + 12, o.y + 22, o.x + o.w - 12, o.y + 22, STYLE.cream, 4); }
function car(ctx, o, state) {
  const night = (state.time % 1440) >= 18 * 60 || (state.time % 1440) < 6 * 60;
  const sports = o.id === 'car_2';
  const body = sports ? '#954334' : '#d9d7ce';
  const bodyEdge = sports ? '#5d2a25' : '#756d63';
  const glass = '#263a3d';
  const cx = o.x + o.w / 2;
  ctx.save();
  ctx.strokeStyle = STYLE.ink;
  ctx.lineWidth = 2.2;
  ctx.fillStyle = body;
  ctx.beginPath();
  if (sports) {
    ctx.moveTo(cx, o.y + 3);
    ctx.bezierCurveTo(o.x + o.w - 12, o.y + 18, o.x + o.w - 4, o.y + 58, o.x + o.w - 8, o.y + o.h - 28);
    ctx.quadraticCurveTo(cx, o.y + o.h + 1, o.x + 8, o.y + o.h - 28);
    ctx.bezierCurveTo(o.x + 4, o.y + 58, o.x + 12, o.y + 18, cx, o.y + 3);
  } else {
    ctx.moveTo(cx, o.y + 4);
    ctx.bezierCurveTo(o.x + o.w - 8, o.y + 18, o.x + o.w - 4, o.y + 64, o.x + o.w - 13, o.y + o.h - 18);
    ctx.quadraticCurveTo(cx, o.y + o.h + 4, o.x + 13, o.y + o.h - 18);
    ctx.bezierCurveTo(o.x + 4, o.y + 64, o.x + 8, o.y + 18, cx, o.y + 4);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  rr(ctx, o.x + o.w * .22, o.y + o.h * .15, o.w * .56, o.h * .16, 8, true, true, glass, bodyEdge, 1.5);
  rr(ctx, o.x + o.w * .20, o.y + o.h * .60, o.w * .60, o.h * .18, 8, true, true, glass, bodyEdge, 1.5);
  rr(ctx, o.x + o.w * .18, o.y + o.h * .34, o.w * .12, o.h * .30, 7, true, true, '#ecdfce', bodyEdge, 1);
  rr(ctx, o.x + o.w * .70, o.y + o.h * .34, o.w * .12, o.h * .30, 7, true, true, '#ecdfce', bodyEdge, 1);
  line(ctx, o.x + 14, o.y + o.h * .39, o.x + o.w - 14, o.y + o.h * .39, 'rgba(53,47,42,.32)', 1.3);
  line(ctx, o.x + 16, o.y + o.h * .69, o.x + o.w - 16, o.y + o.h * .69, 'rgba(53,47,42,.32)', 1.3);
  ctx.fillStyle = night ? '#f2d36c' : '#fff8dc';
  ellipse(ctx, o.x + 24, o.y + 14, 9, 6, ctx.fillStyle); ellipse(ctx, o.x + o.w - 24, o.y + 14, 9, 6, ctx.fillStyle);
  ellipse(ctx, o.x + 24, o.y + o.h - 13, 8, 5, STYLE.clay); ellipse(ctx, o.x + o.w - 24, o.y + o.h - 13, 8, 5, STYLE.clay);
  line(ctx, o.x - 6, o.y + o.h * .38, o.x + 4, o.y + o.h * .42, STYLE.ink, 2);
  line(ctx, o.x + o.w + 6, o.y + o.h * .38, o.x + o.w - 4, o.y + o.h * .42, STYLE.ink, 2);
  if (sports) {
    for (const side of [-1, 1]) {
      line(ctx, cx + side * 24, o.y + 45, cx + side * 12, o.y + 82, '#52251f', 3);
      line(ctx, cx + side * 32, o.y + 58, cx + side * 19, o.y + 94, '#52251f', 2);
    }
  }
  ctx.restore();
}
function bike(ctx, o) {
  const cx = o.x + o.w / 2;
  ctx.save();
  ctx.strokeStyle = STYLE.ink;
  ctx.lineWidth = 2;
  circle(ctx, cx, o.y + 14, Math.min(13, o.w * .42), false, STYLE.ink);
  circle(ctx, cx, o.y + o.h - 14, Math.min(13, o.w * .42), false, STYLE.ink);
  line(ctx, cx, o.y + 14, o.x + 6, o.y + o.h * .50, '#3f5f67', 3);
  line(ctx, o.x + 6, o.y + o.h * .50, cx, o.y + o.h - 14, '#3f5f67', 3);
  line(ctx, cx, o.y + 14, o.x + o.w - 6, o.y + o.h * .50, '#3f5f67', 3);
  line(ctx, o.x + o.w - 6, o.y + o.h * .50, cx, o.y + o.h - 14, '#3f5f67', 3);
  line(ctx, o.x + 4, o.y + 8, o.x + o.w - 4, o.y + 8, STYLE.ink, 2);
  rr(ctx, cx - 7, o.y + o.h * .47, 14, 9, 4, true, false, '#5a4a3e');
  line(ctx, cx, o.y + o.h * .52, cx + 12, o.y + o.h * .60, STYLE.ink, 2);
  line(ctx, cx, o.y + o.h * .52, cx - 12, o.y + o.h * .60, STYLE.ink, 2);
  ctx.restore();
}
function motorbike(ctx, o) {
  const cx = o.x + o.w / 2;
  ctx.save();
  circle(ctx, cx, o.y + 14, 12, false, STYLE.ink);
  circle(ctx, cx, o.y + o.h - 14, 13, false, STYLE.ink);
  rr(ctx, cx - 13, o.y + 28, 26, o.h - 56, 13, true, true, '#504b47', STYLE.ink, 2);
  rr(ctx, cx - 10, o.y + 39, 20, 24, 8, true, false, '#cfd8d6');
  rr(ctx, cx - 12, o.y + 72, 24, 28, 11, true, false, '#2c2a28');
  line(ctx, o.x + 4, o.y + 17, o.x + o.w - 4, o.y + 17, STYLE.ink, 2.5);
  line(ctx, o.x + 9, o.y + o.h - 36, o.x - 2, o.y + o.h - 21, '#5a524a', 2);
  line(ctx, o.x + o.w - 9, o.y + o.h - 36, o.x + o.w + 2, o.y + o.h - 21, '#5a524a', 2);
  ctx.restore();
}
function atv(ctx, o) {
  const cx = o.x + o.w / 2;
  ctx.save();
  for (const [dx, dy] of [[7, 10], [o.w - 7, 10], [7, o.h - 14], [o.w - 7, o.h - 14]]) {
    rr(ctx, o.x + dx - 9, o.y + dy - 14, 18, 28, 8, true, true, '#2c2a25', STYLE.ink, 1.5);
  }
  rr(ctx, o.x + 13, o.y + 15, o.w - 26, o.h - 34, 12, true, true, '#66764c', STYLE.ink, 2);
  rr(ctx, cx - 13, o.y + 34, 26, 34, 11, true, false, '#8ca064');
  rr(ctx, cx - 13, o.y + o.h - 52, 26, 36, 11, true, false, '#3d3a33');
  line(ctx, o.x + 10, o.y + 20, o.x + o.w - 10, o.y + 20, STYLE.ink, 2.5);
  line(ctx, o.x + 10, o.y + 20, o.x - 3, o.y + 12, STYLE.ink, 2);
  line(ctx, o.x + o.w - 10, o.y + 20, o.x + o.w + 3, o.y + 12, STYLE.ink, 2);
  ctx.restore();
}

function rr(ctx, x, y, w, h, r, fill = true, stroke = false, fillColor = null, strokeColor = null, lineWidth = null) {
  if (fillColor) ctx.fillStyle = fillColor;
  if (strokeColor) ctx.strokeStyle = strokeColor;
  if (lineWidth) ctx.lineWidth = lineWidth;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else { ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); }
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
function circle(ctx, x, y, r, fill = true, color = '#000') { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); } }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function line(ctx, x1, y1, x2, y2, color, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
