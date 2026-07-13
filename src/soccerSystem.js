import { changeNeed, log, say, setMood } from './state.js';
import { commandObject } from './movement.js';
import { getObject } from './world.js';

const FIELD = {
  floor: 4,
  x: 82,
  y: 190,
  w: 420,
  h: 300,
  goalTop: { x: 230, y: 190, w: 120, h: 18 },
  goalBottom: { x: 230, y: 472, w: 120, h: 18 }
};
const BALL_RADIUS = 8;
const PLAYER_RUN_SPEED = 138;
const DOG_RUN_SPEED = 118;
const KICK_DISTANCE = 24;

export function startSoccerPractice(state, actor) {
  const field = getObject('soccer_field');
  if (field && actor?.floor !== FIELD.floor) {
    commandObject(actor, field, 'soccer_practice');
    say(actor, 'FIELD');
    log(state, `${actor.name} is walking to the backyard soccer field.`);
    return true;
  }
  return startSoccerPracticeAtField(state, actor);
}

export function startMiniSoccer(state, actor) {
  const field = getObject('soccer_field');
  if (field && actor?.floor !== FIELD.floor) {
    commandObject(actor, field, 'soccer_match');
    say(actor, 'FIELD');
    log(state, `${actor.name} is walking to the backyard soccer field for a match.`);
    return true;
  }
  return startMiniSoccerAtField(state, actor);
}

export function startSoccerPracticeAtField(state, actor) {
  if (!actor) return false;
  focusIfSelected(state, actor, 18);
  actor.floor = FIELD.floor;
  actor.hidden = false;
  actor.x = clamp(actor.x || FIELD.x + FIELD.w * 0.5, FIELD.x + 40, FIELD.x + FIELD.w - 40);
  actor.y = clamp(actor.y || FIELD.y + FIELD.h * 0.68, FIELD.y + 46, FIELD.y + FIELD.h - 46);
  actor.path = [];
  actor.target = null;

  if (actor.type === 'dog') {
    actor.pose = 'dog_chase_ball';
    actor.action = 'Playing with soccer ball';
    actor.actionT = 18;
    actor.actionTotal = 18;
    state.soccerGame = createDogBallPlay(actor);
    say(actor, 'BALL');
    log(state, `${actor.name} is playing with the soccer ball.`);
    return true;
  }

  actor.pose = 'soccer_ready';
  actor.action = 'Soccer practice';
  actor.actionT = 16;
  actor.actionTotal = 16;
  state.soccerGame = createSoccerGame([actor], 'practice');
  say(actor, 'AIM');
  log(state, `${actor.name} started aimed soccer practice.`);
  return true;
}

export function startMiniSoccerAtField(state, actor) {
  if (!actor) return false;
  if (actor.type === 'dog') return startSoccerPracticeAtField(state, actor);
  focusIfSelected(state, actor, 18);
  const people = state.entities.filter(e => e.type === 'person' && !e.hidden);
  const players = people.length > 1 ? people.slice(0, 2) : [actor];
  players.forEach((p, i) => {
    p.floor = FIELD.floor;
    p.hidden = false;
    p.x = FIELD.x + FIELD.w * (i ? 0.62 : 0.38);
    p.y = FIELD.y + FIELD.h * (i ? 0.64 : 0.64);
    p.path = [];
    p.target = null;
    p.pose = 'soccer_ready';
    p.action = players.length > 1 ? 'Mini soccer match' : 'Soccer practice';
    p.actionT = players.length > 1 ? 20 : 16;
    p.actionTotal = p.actionT;
    say(p, i ? 'DEFEND' : 'AIM');
  });
  state.soccerGame = createSoccerGame(players, players.length > 1 ? 'match' : 'practice');
  log(state, players.length > 1 ? `${players.map(p => p.name).join(' and ')} started aimed mini soccer.` : `${actor.name} started aimed soccer practice.`);
  return true;
}

function focusIfSelected(state, actor, hold = 10) {
  if (actor?.id !== state.selectedId) return;
  state.floor = FIELD.floor;
  state.viewHoldT = hold;
}

function createSoccerGame(players, mode) {
  return {
    mode,
    floor: FIELD.floor,
    playerIds: players.map(p => p.id),
    names: players.map(p => p.name),
    t: 0,
    turn: 0,
    shotPauseT: 0.4,
    currentShot: null,
    score: Object.fromEntries(players.map(p => [p.id, 0])),
    shots: Object.fromEntries(players.map(p => [p.id, 0])),
    message: mode === 'match' ? 'Aim for goal' : 'Aim for the top goal',
    messageT: 2,
    winner: null,
    resetBallOnNextTurn: false,
    ball: { x: FIELD.x + FIELD.w * 0.5, y: FIELD.y + FIELD.h * 0.56, vx: 0, vy: 0 },
    trail: []
  };
}

function createDogBallPlay(dog) {
  return {
    mode: 'dog_play',
    floor: FIELD.floor,
    playerIds: [dog.id],
    names: [dog.name],
    t: 0,
    kickT: 0.35,
    message: '',
    messageT: 0,
    ball: { x: dog.x + 30, y: dog.y - 10, vx: 0, vy: 0 },
    dogTarget: { x: FIELD.x + FIELD.w * 0.72, y: FIELD.y + FIELD.h * 0.36 },
    trail: []
  };
}

export function updateSoccerGame(state, dt) {
  const game = state.soccerGame;
  if (!game) return;
  if (game.mode === 'dog_play') return updateDogBallPlay(state, game, dt);
  const players = game.playerIds.map(id => state.entities.find(e => e.id === id)).filter(Boolean);
  if (!players.length || players.every(p => !String(p.action || '').toLowerCase().includes('soccer'))) { state.soccerGame = null; return; }

  game.t += dt;
  game.messageT = Math.max(0, (game.messageT || 0) - dt);
  updateSoccerBall(game, dt);

  if (game.shotPauseT > 0) {
    game.shotPauseT -= dt;
    holdPlayersForShotReset(players, game);
    if (game.shotPauseT <= 0 && game.resetBallOnNextTurn) resetBallForNextTurn(game);
  } else if (!game.winner) {
    updateAimedSoccerTurn(state, game, players, dt);
  }

  if (!game.winner && (game.t > (game.mode === 'match' ? 24 : 18) || totalShots(game) >= (game.mode === 'match' ? 10 : 8))) finishSoccer(state, game, players);
  if (game.winner && game.t > 30) state.soccerGame = null;
}

function updateAimedSoccerTurn(state, game, players, dt) {
  const shooter = players[game.turn % players.length] || players[0];
  if (!game.currentShot || game.currentShot.shooterId !== shooter.id) game.currentShot = createAimedShot(game, shooter);
  const shot = game.currentShot;
  const ball = game.ball;

  if (Math.hypot(ball.vx, ball.vy) > 18) {
    shooter.pose = 'soccer_track_ball';
    return;
  }

  if (shot.phase === 'approach') {
    const reached = moveEntityToward(shooter, shot.approachX, shot.approachY, PLAYER_RUN_SPEED, dt);
    shooter.pose = reached ? 'soccer_plant' : 'soccer_run_to_ball';
    shooter.action = game.mode === 'match' ? 'Mini soccer match' : 'Soccer practice';
    if (reached) {
      shot.phase = 'plant';
      shot.t = 0.22;
      game.message = `${shooter.name} sets up the shot`;
      game.messageT = 0.8;
    }
    updateSupportPlayers(players, shooter, game, dt);
    return;
  }

  if (shot.phase === 'plant') {
    shot.t -= dt;
    shooter.pose = 'soccer_plant';
    updateSupportPlayers(players, shooter, game, dt);
    if (shot.t <= 0) {
      shot.phase = 'kick';
      shot.t = 0.18;
      shooter.pose = 'soccer_kick_windup';
    }
    return;
  }

  if (shot.phase === 'kick') {
    shooter.pose = 'soccer_kick_follow_through';
    takeSoccerTurn(state, game, players, shot);
  }
}

function createAimedShot(game, shooter) {
  const ball = game.ball;
  const attackingTop = game.mode === 'practice' || game.turn % 2 === 0;
  const goal = attackingTop ? FIELD.goalTop : FIELD.goalBottom;
  const seed = game.t * 2.31 + game.turn * 5.17 + (shooter.skills?.strength || 1);
  const targetX = goal.x + goal.w * (0.24 + deterministic(seed) * 0.52);
  const targetY = attackingTop ? goal.y + goal.h * 0.55 : goal.y + goal.h * 0.45;
  const dx = targetX - ball.x;
  const dy = targetY - ball.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / mag;
  const uy = dy / mag;
  return {
    shooterId: shooter.id,
    phase: 'approach',
    t: 0,
    targetX,
    targetY,
    goalName: attackingTop ? 'top' : 'bottom',
    approachX: clamp(ball.x - ux * KICK_DISTANCE, FIELD.x + 26, FIELD.x + FIELD.w - 26),
    approachY: clamp(ball.y - uy * KICK_DISTANCE, FIELD.y + 32, FIELD.y + FIELD.h - 32),
    aimUx: ux,
    aimUy: uy
  };
}

function updateSupportPlayers(players, shooter, game, dt) {
  if (players.length <= 1) return;
  players.forEach((player, index) => {
    if (player.id === shooter.id) return;
    const defensiveTop = game.turn % 2 === 0;
    const x = FIELD.x + FIELD.w * (index ? 0.58 : 0.42);
    const y = defensiveTop ? FIELD.y + FIELD.h * 0.28 : FIELD.y + FIELD.h * 0.72;
    moveEntityToward(player, x, y, PLAYER_RUN_SPEED * 0.55, dt);
    player.pose = 'soccer_defend_goal';
  });
}

function holdPlayersForShotReset(players, game) {
  players.forEach((player, index) => {
    if (game.currentShot?.shooterId === player.id) player.pose = 'soccer_kick_follow_through';
    else player.pose = index === game.turn % Math.max(1, players.length) ? 'soccer_ready' : 'soccer_defend_goal';
  });
}

function resetBallForNextTurn(game) {
  game.ball.x = FIELD.x + FIELD.w * (0.46 + deterministic(game.t + game.turn) * 0.08);
  game.ball.y = FIELD.y + FIELD.h * 0.55;
  game.ball.vx = 0;
  game.ball.vy = 0;
  game.resetBallOnNextTurn = false;
  game.currentShot = null;
}

function updateDogBallPlay(state, game, dt) {
  const dog = state.entities.find(e => e.id === game.playerIds?.[0]);
  if (!dog || dog.hidden || !String(dog.action || '').toLowerCase().includes('soccer ball')) { state.soccerGame = null; return; }
  game.t += dt;
  game.kickT -= dt;
  updateSoccerBall(game, dt);

  const ball = game.ball;
  const dx = ball.x - dog.x;
  const dy = ball.y - dog.y;
  const dist = Math.hypot(dx, dy);
  const reached = moveEntityToward(dog, ball.x - Math.sign(game.dogTarget.x - ball.x || 1) * 18, ball.y, DOG_RUN_SPEED, dt);
  dog.pose = reached || dist < 30 ? 'dog_tap_ball' : 'dog_chase_ball';

  if ((reached || dist < 30) && game.kickT <= 0 && Math.hypot(ball.vx, ball.vy) < 24) {
    const target = chooseDogBallTarget(game);
    const aimX = target.x - ball.x;
    const aimY = target.y - ball.y;
    const mag = Math.max(1, Math.hypot(aimX, aimY));
    ball.vx = aimX / mag * 92;
    ball.vy = aimY / mag * 92;
    game.dogTarget = target;
    game.kickT = 1.1;
  }

  if (game.t > 18) {
    changeNeed(dog, 'fun', 18);
    changeNeed(dog, 'stamina', -8);
    changeNeed(dog, 'freshness', -3);
    setMood(dog, 'dog');
    say(dog, 'BALL');
    log(state, `${dog.name} finished playing with the soccer ball.`);
    state.soccerGame = null;
  }
}

function chooseDogBallTarget(game) {
  const options = [
    { x: FIELD.x + FIELD.w * 0.28, y: FIELD.y + FIELD.h * 0.34 },
    { x: FIELD.x + FIELD.w * 0.72, y: FIELD.y + FIELD.h * 0.36 },
    { x: FIELD.x + FIELD.w * 0.62, y: FIELD.y + FIELD.h * 0.72 },
    { x: FIELD.x + FIELD.w * 0.36, y: FIELD.y + FIELD.h * 0.68 }
  ];
  return options[Math.floor(deterministic(game.t + game.kickT) * options.length) % options.length];
}

function updateSoccerBall(game, dt) {
  const b = game.ball;
  game.trail.unshift({ x: b.x, y: b.y, a: .42 });
  game.trail = game.trail.slice(0, 7).map((p, i) => ({ ...p, a: Math.max(0, .34 - i * .045) }));
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.vx *= Math.pow(.54, dt);
  b.vy *= Math.pow(.54, dt);
  if (b.x < FIELD.x + BALL_RADIUS) { b.x = FIELD.x + BALL_RADIUS; b.vx = Math.abs(b.vx) * .5; }
  if (b.x > FIELD.x + FIELD.w - BALL_RADIUS) { b.x = FIELD.x + FIELD.w - BALL_RADIUS; b.vx = -Math.abs(b.vx) * .5; }
  if (b.y < FIELD.y + BALL_RADIUS) { b.y = FIELD.y + BALL_RADIUS; b.vy = Math.abs(b.vy) * .45; }
  if (b.y > FIELD.y + FIELD.h - BALL_RADIUS) { b.y = FIELD.y + FIELD.h - BALL_RADIUS; b.vy = -Math.abs(b.vy) * .45; }
}

function takeSoccerTurn(state, game, players, shot) {
  const shooter = players.find(p => p.id === shot.shooterId) || players[game.turn % players.length] || players[0];
  const b = game.ball;
  const skill = shooter.skills?.strength ?? 3;
  const stamina = shooter.needs?.stamina ?? 60;
  const accuracy = Math.max(.20, Math.min(.92, .28 + skill * .065 + stamina * .004));
  const roll = deterministic(game.t * 2.31 + game.turn * 7.17 + skill);
  const scored = roll < accuracy * (game.mode === 'practice' ? .66 : .48);
  const goal = shot.goalName === 'top' ? FIELD.goalTop : FIELD.goalBottom;
  const missLeft = deterministic(game.t + game.turn * 3.9) < .5;
  const finalTargetX = scored ? shot.targetX : (missLeft ? goal.x - 42 : goal.x + goal.w + 42);
  const finalTargetY = scored ? shot.targetY : shot.targetY + (shot.goalName === 'top' ? -18 : 18);
  const dx = finalTargetX - b.x;
  const dy = finalTargetY - b.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  const power = 190 + skill * 14;

  b.vx = dx / mag * power;
  b.vy = dy / mag * power;
  game.shots[shooter.id] = (game.shots[shooter.id] || 0) + 1;
  shooter.pose = 'soccer_kick_follow_through';

  if (scored) {
    game.score[shooter.id] = (game.score[shooter.id] || 0) + 1;
    game.message = `${shooter.name} aimed and scored`;
    game.messageT = 2;
    game.resetBallOnNextTurn = true;
    say(shooter, 'GOAL');
    setMood(shooter, 'hyped');
    changeNeed(shooter, 'fun', 4);
  } else {
    game.message = `${shooter.name} aimed wide`;
    game.messageT = 1.8;
    say(shooter, 'SHOT');
    changeNeed(shooter, 'fun', 1);
  }

  game.turn = (game.turn + 1) % Math.max(1, players.length);
  game.shotPauseT = scored ? 1.15 : 0.85;
  game.currentShot = null;
}

function finishSoccer(state, game, players) {
  const ranked = players.map(p => ({ player: p, score: game.score[p.id] || 0 })).sort((a, b) => b.score - a.score);
  const winner = ranked[0]?.player;
  game.winner = winner?.name || 'Practice complete';
  game.message = game.mode === 'match' ? `${game.winner} wins ${ranked.map(r => r.score).join(' to ')}` : `Practice complete, ${ranked[0]?.score || 0} goals`;
  game.messageT = 5;
  for (const p of players) {
    const won = p.id === winner?.id;
    changeNeed(p, 'fun', game.mode === 'match' ? won ? 14 : 8 : 10);
    changeNeed(p, 'stamina', -12);
    changeNeed(p, 'freshness', -6);
    changeNeed(p, 'social', players.length > 1 ? 8 : 1);
    setMood(p, won ? 'hyped' : 'happy');
    say(p, game.mode === 'match' ? won ? 'WIN' : 'GG' : 'DONE');
  }
  log(state, game.message);
}

function moveEntityToward(entity, targetX, targetY, speed, dt) {
  const dx = targetX - entity.x;
  const dy = targetY - entity.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= Math.max(2, speed * dt)) {
    entity.x = targetX;
    entity.y = targetY;
    return true;
  }
  const step = speed * dt;
  entity.x = clamp(entity.x + dx / dist * step, FIELD.x + 24, FIELD.x + FIELD.w - 24);
  entity.y = clamp(entity.y + dy / dist * step, FIELD.y + 28, FIELD.y + FIELD.h - 28);
  return false;
}

function totalShots(game) {
  return Object.values(game.shots || {}).reduce((sum, n) => sum + n, 0);
}

function deterministic(n) {
  return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function drawSoccer(ctx, state) {
  if (state.floor !== FIELD.floor) return;
  ctx.save();
  ctx.fillStyle = 'rgba(47,91,54,.42)';
  ctx.fillRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  ctx.strokeStyle = 'rgba(248,251,255,.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  ctx.beginPath();
  ctx.arc(FIELD.x + FIELD.w / 2, FIELD.y + FIELD.h / 2, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(FIELD.x, FIELD.y + FIELD.h / 2);
  ctx.lineTo(FIELD.x + FIELD.w, FIELD.y + FIELD.h / 2);
  ctx.stroke();
  drawGoal(ctx, FIELD.goalTop);
  drawGoal(ctx, FIELD.goalBottom);
  const game = state.soccerGame;
  const ball = game?.ball || { x: FIELD.x + FIELD.w / 2, y: FIELD.y + FIELD.h / 2 };
  for (const p of game?.trail || []) {
    ctx.fillStyle = `rgba(241,198,106,${p.a})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
  }
  if (game?.currentShot) drawAimLine(ctx, ball, game.currentShot);
  ctx.fillStyle = '#f8fbff';
  ctx.strokeStyle = '#11151c';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#11151c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ball.x - 6, ball.y); ctx.lineTo(ball.x + 6, ball.y); ctx.moveTo(ball.x, ball.y - 6); ctx.lineTo(ball.x, ball.y + 6); ctx.stroke();
  if (game && game.mode !== 'dog_play') drawSoccerScore(ctx, game);
  ctx.restore();
}

function drawAimLine(ctx, ball, shot) {
  ctx.save();
  ctx.strokeStyle = 'rgba(241,198,106,.72)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(ball.x, ball.y);
  ctx.lineTo(shot.targetX, shot.targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(241,198,106,.22)';
  ctx.beginPath();
  ctx.arc(shot.targetX, shot.targetY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGoal(ctx, goal) {
  ctx.fillStyle = 'rgba(248,251,255,.18)';
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
  ctx.strokeStyle = '#f8fbff';
  ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);
}

function drawSoccerScore(ctx, game) {
  const x = FIELD.x + 20;
  const y = FIELD.y + 18;
  ctx.fillStyle = 'rgba(8,10,15,.78)';
  ctx.fillRect(x, y, 318, 72);
  ctx.strokeStyle = 'rgba(241,198,106,.7)';
  ctx.strokeRect(x, y, 318, 72);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 13px system-ui';
  const rows = (game.names || []).map((name, i) => `${i === game.turn % Math.max(1, game.names.length) && !game.winner ? '▶ ' : ''}${name}: ${game.score?.[game.playerIds?.[i]] || 0}`).join('   ');
  ctx.fillText(rows || 'Soccer', x + 12, y + 24);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '800 12px system-ui';
  ctx.fillText(game.winner ? `Winner: ${game.winner}` : game.message || 'Playing', x + 12, y + 48);
  ctx.fillStyle = '#b6c1d2';
  ctx.fillText(`Shots ${totalShots(game)}`, x + 12, y + 64);
}
