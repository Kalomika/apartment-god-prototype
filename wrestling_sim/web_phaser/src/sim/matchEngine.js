import { getMoveById, moveCatalog } from './moveCatalog.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function moveToward(actor, target, speed) {
  const dx = target.x - actor.position.x;
  const dy = target.y - actor.position.y;
  const len = Math.max(0.001, Math.hypot(dx, dy));
  actor.position.x += (dx / len) * speed;
  actor.position.y += (dy / len) * speed;
}

function moveAway(actor, target, speed) {
  const dx = actor.position.x - target.x;
  const dy = actor.position.y - target.y;
  const len = Math.max(0.001, Math.hypot(dx, dy));
  actor.position.x += (dx / len) * speed;
  actor.position.y += (dy / len) * speed;
}

function chooseAutonomousMove(actor, opponent) {
  const gap = distance(actor.position, opponent.position);

  if (actor.stamina < 32) {
    return getMoveById('recover');
  }

  if (opponent.state === 'downed' && opponent.damage > 35) {
    return getMoveById('pin_attempt');
  }

  if (actor.state === 'grappleAdvantage') {
    const powerBias = actor.profile.power >= actor.profile.technique ? 'basic_slam' : 'irish_whip';
    return getMoveById(powerBias);
  }

  if (gap > 0.65) {
    return getMoveById(Math.random() > 0.35 ? 'close_distance' : 'circle');
  }

  if (gap > 0.34) {
    return getMoveById(Math.random() > 0.5 ? 'lockup' : 'basic_punch');
  }

  return getMoveById(Math.random() > 0.48 ? 'lockup' : 'basic_punch');
}

function wantsToAcceptSuggestion(actor, move) {
  if (!move) {
    return false;
  }

  if (move.requiredState && actor.state !== move.requiredState) {
    return false;
  }

  const personality = actor.profile.grit + actor.profile.technique - actor.profile.ego * 0.35;
  const staminaGate = actor.stamina - move.staminaCost;
  const acceptance = personality + staminaGate - move.risk + Math.random() * 40;

  return acceptance > 45;
}

export class MatchEngine {
  constructor({ red, blue, ruleSet }) {
    this.ruleSet = ruleSet;
    this.red = this.createCompetitor(red, -0.28, 0.12);
    this.blue = this.createCompetitor(blue, 0.28, -0.12);
    this.referee = {
      position: { x: 0, y: -0.42 },
      state: 'watching'
    };
    this.phase = 'match';
    this.beatTimer = 0;
    this.matchClock = 0;
    this.pendingSuggestion = null;
    this.pendingSuggestionLabel = null;
    this.lastLog = 'The bell rings. Grapple Gods is live.';
    this.countOut = 0;
  }

  createCompetitor(profile, x, y) {
    return {
      profile,
      position: { x, y },
      velocity: { x: 0, y: 0 },
      state: 'idle',
      stamina: 100,
      damage: 0,
      momentum: 50,
      target: { x, y },
      facing: 0,
      downTimer: 0,
      ropeRunTimer: 0,
      pinTimer: 0,
      lastMove: null
    };
  }

  queueSuggestion(moveId) {
    const move = getMoveById(moveId);
    this.pendingSuggestion = moveId;
    this.pendingSuggestionLabel = move?.label ?? moveId;
  }

  getChoiceList() {
    return moveCatalog.map((move) => ({ id: move.id, label: move.label }));
  }

  update(deltaMs) {
    const dt = deltaMs / 1000;
    this.matchClock += dt;
    this.beatTimer -= deltaMs;

    this.updateContinuousMotion(this.red, this.blue, dt);
    this.updateContinuousMotion(this.blue, this.red, dt);
    this.updateReferee(dt);

    if (this.beatTimer <= 0) {
      this.resolveBeat();
      this.beatTimer = 850;
    }

    return this.getSnapshot();
  }

  updateContinuousMotion(actor, opponent, dt) {
    if (actor.state === 'pinned') {
      actor.pinTimer -= dt;
      if (actor.pinTimer <= 0) {
        actor.state = 'downed';
        actor.downTimer = 0.9;
      }
      return;
    }

    if (actor.state === 'downed' || actor.state === 'selling') {
      actor.downTimer -= dt;
      if (actor.downTimer <= 0) {
        actor.state = actor.damage > 55 ? 'recovering' : 'idle';
      }
      return;
    }

    if (actor.state === 'ropeRun') {
      actor.ropeRunTimer -= dt;
      const ropeTarget = actor.position.x > 0 ? { x: -0.78, y: actor.position.y } : { x: 0.78, y: actor.position.y };
      moveToward(actor, ropeTarget, dt * 1.25);
      if (actor.ropeRunTimer <= 0) {
        actor.state = 'closingDistance';
      }
    } else if (actor.state === 'circling') {
      const angle = this.matchClock * 1.3 + (actor === this.red ? 0 : Math.PI);
      actor.position.x += Math.cos(angle) * dt * 0.08;
      actor.position.y += Math.sin(angle) * dt * 0.08;
    } else if (actor.state === 'closingDistance') {
      moveToward(actor, opponent.position, dt * 0.55);
    } else if (actor.state === 'recovering') {
      moveAway(actor, opponent.position, dt * 0.25);
      actor.stamina = clamp(actor.stamina + dt * 10, 0, 100);
    }

    actor.position.x = clamp(actor.position.x, -0.86, 0.86);
    actor.position.y = clamp(actor.position.y, -0.86, 0.86);
    actor.facing = Math.atan2(opponent.position.y - actor.position.y, opponent.position.x - actor.position.x) + Math.PI / 2;
  }

  updateReferee(dt) {
    const mid = {
      x: (this.red.position.x + this.blue.position.x) * 0.5,
      y: (this.red.position.y + this.blue.position.y) * 0.5 - 0.22
    };
    moveToward(this.referee, { x: clamp(mid.x, -0.45, 0.45), y: clamp(mid.y, -0.55, 0.55) }, dt * 0.34);
  }

  resolveBeat() {
    const redMove = this.pickMoveFor(this.red, this.blue, true);
    const blueMove = chooseAutonomousMove(this.blue, this.red);

    const redScore = this.scoreMove(this.red, this.blue, redMove);
    const blueScore = this.scoreMove(this.blue, this.red, blueMove);

    if (redScore >= blueScore) {
      this.applyMove(this.red, this.blue, redMove, redScore, blueScore);
    } else {
      this.applyMove(this.blue, this.red, blueMove, blueScore, redScore);
    }
  }

  pickMoveFor(actor, opponent, isPlayerSide) {
    if (isPlayerSide && this.pendingSuggestion) {
      const suggested = getMoveById(this.pendingSuggestion);
      const label = this.pendingSuggestionLabel;
      this.pendingSuggestion = null;
      this.pendingSuggestionLabel = null;

      if (wantsToAcceptSuggestion(actor, suggested)) {
        this.lastLog = `${actor.profile.name} accepts the GM suggestion: ${label}.`;
        return suggested;
      }

      this.lastLog = `${actor.profile.name} heard the call for ${label}, but ignored it and followed instinct.`;
    }

    return chooseAutonomousMove(actor, opponent);
  }

  scoreMove(actor, opponent, move) {
    const gap = distance(actor.position, opponent.position);
    const stat = move.category.includes('grapple') ? actor.profile.power * 0.45 + actor.profile.technique * 0.55 : actor.profile.speed * 0.35 + actor.profile.grit * 0.4 + actor.profile.power * 0.25;
    const stamina = actor.stamina * 0.35;
    const rangePenalty = this.rangePenalty(move, gap);
    const damagePenalty = actor.damage * 0.18;
    return stat + stamina - move.risk - rangePenalty - damagePenalty + Math.random() * 35;
  }

  rangePenalty(move, gap) {
    if (move.desiredRange === 'far') {
      return gap > 0.45 ? 0 : 20;
    }
    if (move.desiredRange === 'mid') {
      return gap > 0.32 && gap < 0.74 ? 0 : 18;
    }
    if (move.desiredRange === 'near' || move.desiredRange === 'grapple') {
      return gap < 0.45 ? 0 : 28;
    }
    return 0;
  }

  applyMove(actor, opponent, move, actorScore, opponentScore) {
    actor.lastMove = move.id;
    actor.stamina = clamp(actor.stamina - move.staminaCost, 0, 100);

    if (move.id === 'circle') {
      actor.state = 'circling';
      opponent.state = opponent.state === 'idle' ? 'circling' : opponent.state;
      this.lastLog = `${actor.profile.name} ${move.log}.`;
      return;
    }

    if (move.id === 'close_distance') {
      actor.state = 'closingDistance';
      this.lastLog = `${actor.profile.name} ${move.log}.`;
      return;
    }

    if (move.id === 'recover') {
      actor.state = 'recovering';
      this.lastLog = `${actor.profile.name} ${move.log}.`;
      return;
    }

    if (move.id === 'basic_punch') {
      actor.state = 'striking';
      opponent.state = actorScore - opponentScore > 18 ? 'selling' : 'idle';
      opponent.damage = clamp(opponent.damage + move.damage, 0, 100);
      opponent.downTimer = 0.6;
      this.lastLog = `${actor.profile.name} ${move.log}. ${opponent.profile.name} absorbs it.`;
      return;
    }

    if (move.id === 'lockup') {
      actor.state = 'grappleAdvantage';
      opponent.state = 'lockup';
      moveToward(actor, opponent.position, 0.04);
      this.lastLog = `${actor.profile.name} ${move.log} and gains inside position.`;
      return;
    }

    if (move.id === 'irish_whip') {
      actor.state = 'advantage';
      opponent.state = 'ropeRun';
      opponent.ropeRunTimer = 1.5;
      opponent.damage = clamp(opponent.damage + move.damage, 0, 100);
      this.lastLog = `${actor.profile.name} ${move.log}.`;
      return;
    }

    if (move.id === 'basic_slam') {
      actor.state = 'advantage';
      opponent.state = 'downed';
      opponent.downTimer = 1.4;
      opponent.damage = clamp(opponent.damage + move.damage, 0, 100);
      this.lastLog = `${actor.profile.name} ${move.log}.`;
      return;
    }

    if (move.id === 'pin_attempt') {
      actor.state = 'pinning';
      opponent.state = 'pinned';
      opponent.pinTimer = 1.2;
      const kickoutChance = clamp(78 - opponent.damage + opponent.profile.grit * 0.1, 5, 92);
      this.lastLog = `${actor.profile.name} ${move.log}. Kickout chance is roughly ${Math.round(kickoutChance)} percent in this prototype.`;
    }
  }

  getSnapshot() {
    return {
      red: this.red,
      blue: this.blue,
      referee: this.referee,
      log: this.lastLog,
      clock: this.matchClock,
      ruleSet: this.ruleSet
    };
  }
}
