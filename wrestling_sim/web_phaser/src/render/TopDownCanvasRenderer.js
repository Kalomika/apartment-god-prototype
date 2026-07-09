const INTERNAL_WIDTH = 960;
const INTERNAL_HEIGHT = 540;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToCss(value) {
  const hex = Number(value ?? 0xffffff).toString(16).padStart(6, '0');
  return `#${hex}`;
}

function ellipsePath(ctx, x, y, rx, ry, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
}

function drawFilledEllipse(ctx, x, y, rx, ry, fill, stroke = '#050505', line = 3, rotation = 0) {
  ellipsePath(ctx, x, y, rx, ry, rotation);
  ctx.fillStyle = fill;
  ctx.fill();
  if (line > 0) {
    ctx.lineWidth = line;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function drawLine(ctx, x1, y1, x2, y2, stroke, width, cap = 'round') {
  ctx.beginPath();
  ctx.lineCap = cap;
  ctx.lineJoin = 'round';
  ctx.lineWidth = width;
  ctx.strokeStyle = stroke;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawLimb(ctx, x1, y1, x2, y2, fill, ink, width) {
  drawLine(ctx, x1, y1, x2, y2, ink, width + 5);
  drawLine(ctx, x1, y1, x2, y2, fill, width);
}

function drawQuadraticLimb(ctx, x1, y1, cx, cy, x2, y2, fill, ink, width) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = width + 5;
  ctx.strokeStyle = ink;
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = width;
  ctx.strokeStyle = fill;
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.stroke();
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = '#050505', line = 3) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (line > 0) {
    ctx.lineWidth = line;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export class TopDownCanvasRenderer {
  constructor(scene) {
    this.scene = scene;
    this.key = 'grapple-gods-match-canvas';

    if (scene.textures.exists(this.key)) {
      scene.textures.remove(this.key);
    }

    this.texture = scene.textures.createCanvas(this.key, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    this.canvas = this.texture.getSourceImage();
    this.ctx = this.texture.getContext();
    this.image = scene.add.image(0, 0, this.key).setOrigin(0, 0);
    this.bounds = null;
  }

  layout(layout) {
    this.image.setPosition(0, 0);
    this.image.setDisplaySize(layout.width, layout.arenaHeight);
  }

  draw(layout, snapshot) {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    this.drawArena(ctx, snapshot);
    this.drawRing(ctx);

    if (snapshot) {
      this.drawWrestler(ctx, snapshot.red, true, snapshot.clock);
      this.drawWrestler(ctx, snapshot.blue, false, snapshot.clock);
      this.drawReferee(ctx, snapshot.referee, snapshot.clock);
    }

    ctx.restore();
    this.texture.refresh();
  }

  computeRingBounds() {
    const ringOuter = Math.min(INTERNAL_WIDTH * 0.88, INTERNAL_HEIGHT * 0.88);
    const cx = INTERNAL_WIDTH * 0.5;
    const cy = INTERNAL_HEIGHT * 0.49;
    const matSize = ringOuter * 0.67;
    const matX = cx - matSize * 0.5;
    const matY = cy - matSize * 0.5;
    const ropeOffset = ringOuter * 0.073;
    const ropeGap = Math.max(10, ringOuter * 0.024);

    this.bounds = {
      cx,
      cy,
      matX,
      matY,
      matSize,
      matRight: matX + matSize,
      matBottom: matY + matSize,
      ropeOffset,
      ropeGap,
      apronPad: ropeOffset + ropeGap * 3,
      postReach: ropeOffset + ropeGap * 2.15
    };

    return this.bounds;
  }

  drawArena(ctx, snapshot) {
    const gradient = ctx.createRadialGradient(INTERNAL_WIDTH * 0.5, INTERNAL_HEIGHT * 0.5, 90, INTERNAL_WIDTH * 0.5, INTERNAL_HEIGHT * 0.5, INTERNAL_WIDTH * 0.72);
    gradient.addColorStop(0, '#202020');
    gradient.addColorStop(0.55, '#111111');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

    ctx.strokeStyle = 'rgba(255,255,255,0.11)';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, INTERNAL_WIDTH - 56, INTERNAL_HEIGHT - 56);

    this.drawCrowd(ctx, snapshot?.clock ?? 0);
  }

  drawCrowd(ctx, clock) {
    const rows = [40, 62, 84, INTERNAL_HEIGHT - 82, INTERNAL_HEIGHT - 58, INTERNAL_HEIGHT - 36];
    rows.forEach((y, row) => {
      const count = row < 3 ? 34 : 38;
      const start = row % 2 ? 20 : 8;
      for (let i = 0; i < count; i += 1) {
        const x = start + i * 27;
        if (x > INTERNAL_WIDTH - 8) continue;
        const pulse = Math.sin(clock * 2.4 + i * 0.7 + row) * 0.06;
        ctx.fillStyle = `rgba(255,255,255,${0.11 + row * 0.018 + pulse})`;
        ctx.beginPath();
        ctx.arc(x, y, 3.4 + (row % 3) * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    drawLine(ctx, 0, INTERNAL_HEIGHT - 108, INTERNAL_WIDTH, INTERNAL_HEIGHT - 108, 'rgba(255,255,255,0.16)', 3, 'butt');
    drawLine(ctx, 0, 108, INTERNAL_WIDTH, 108, 'rgba(255,255,255,0.08)', 2, 'butt');
  }

  drawRing(ctx) {
    const b = this.computeRingBounds();
    const apronX = b.matX - b.apronPad;
    const apronY = b.matY - b.apronPad;
    const apronSize = b.matSize + b.apronPad * 2;

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#070707';
    ctx.fillRect(apronX, apronY, apronSize, apronSize);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(apronX, apronY, apronSize, apronSize);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.17)';
    ctx.strokeRect(apronX + 10, apronY + 10, apronSize - 20, apronSize - 20);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.matX, b.matY, b.matSize, b.matSize);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#050505';
    ctx.strokeRect(b.matX, b.matY, b.matSize, b.matSize);

    const matGradient = ctx.createLinearGradient(b.matX, b.matY, b.matRight, b.matBottom);
    matGradient.addColorStop(0, 'rgba(0,0,0,0.05)');
    matGradient.addColorStop(0.45, 'rgba(255,255,255,0.0)');
    matGradient.addColorStop(1, 'rgba(0,0,0,0.055)');
    ctx.fillStyle = matGradient;
    ctx.fillRect(b.matX + 4, b.matY + 4, b.matSize - 8, b.matSize - 8);

    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    const inner = b.matSize * 0.045;
    ctx.strokeRect(b.matX + inner, b.matY + inner, b.matSize - inner * 2, b.matSize - inner * 2);

    ctx.strokeStyle = 'rgba(0,0,0,0.055)';
    const stitch = b.matSize / 7;
    for (let i = 1; i < 7; i += 1) {
      drawLine(ctx, b.matX + stitch * i, b.matY + inner, b.matX + stitch * i, b.matBottom - inner, ctx.strokeStyle, 1, 'butt');
      drawLine(ctx, b.matX + inner, b.matY + stitch * i, b.matRight - inner, b.matY + stitch * i, ctx.strokeStyle, 1, 'butt');
    }

    this.drawRopes(ctx, b);
    this.drawCorner(ctx, b.matX, b.matY, -1, -1, b);
    this.drawCorner(ctx, b.matRight, b.matY, 1, -1, b);
    this.drawCorner(ctx, b.matX, b.matBottom, -1, 1, b);
    this.drawCorner(ctx, b.matRight, b.matBottom, 1, 1, b);
  }

  drawRopes(ctx, b) {
    const leftPostX = b.matX - b.postReach;
    const rightPostX = b.matRight + b.postReach;
    const topPostY = b.matY - b.postReach;
    const bottomPostY = b.matBottom + b.postReach;

    for (let i = 0; i < 3; i += 1) {
      const gap = i * b.ropeGap;
      const topY = b.matY - b.ropeOffset - gap;
      const bottomY = b.matBottom + b.ropeOffset + gap;
      const leftX = b.matX - b.ropeOffset - gap;
      const rightX = b.matRight + b.ropeOffset + gap;

      this.rope(ctx, leftPostX, topY, rightPostX, topY);
      this.rope(ctx, leftPostX, bottomY, rightPostX, bottomY);
      this.rope(ctx, leftX, topPostY, leftX, bottomPostY);
      this.rope(ctx, rightX, topPostY, rightX, bottomPostY);
    }
  }

  rope(ctx, x1, y1, x2, y2) {
    drawLine(ctx, x1, y1, x2, y2, 'rgba(255,255,255,0.28)', 8);
    drawLine(ctx, x1, y1, x2, y2, '#000000', 4.2);
  }

  drawCorner(ctx, x, y, sx, sy, b) {
    const postX = x + sx * b.postReach;
    const postY = y + sy * b.postReach;
    const padW = 46;
    const padH = 34;
    const padX = x + (sx > 0 ? -padW * 0.12 : -padW * 0.88);
    const padY = y + (sy > 0 ? -padH * 0.12 : -padH * 0.88);

    drawLine(ctx, x, y, postX, postY, '#000000', 6);
    drawFilledEllipse(ctx, postX, postY, 19, 19, '#000000', '#000000', 0);
    drawFilledEllipse(ctx, postX, postY, 10, 10, '#ffffff', '#000000', 3);

    drawRoundedRect(ctx, padX - 4, padY - 4, padW + 8, padH + 8, 7, '#000000', '#000000', 0);
    drawRoundedRect(ctx, padX, padY, padW, padH, 6, '#ffffff', '#000000', 3);
    drawLine(ctx, padX + 5, padY + padH * 0.5, padX + padW - 5, padY + padH * 0.5, 'rgba(0,0,0,0.45)', 1.4, 'butt');
  }

  ringToCanvas(nx, ny) {
    const b = this.bounds ?? this.computeRingBounds();
    return {
      x: b.matX + (nx * 0.5 + 0.5) * b.matSize,
      y: b.matY + (ny * 0.5 + 0.5) * b.matSize
    };
  }

  drawWrestler(ctx, actor, isRex, clock) {
    const pos = this.ringToCanvas(actor.position.x, actor.position.y);
    const p = this.paletteFor(actor, isRex);
    const down = actor.state === 'downed' || actor.state === 'pinned';
    const statePose = this.poseFor(actor.state, clock, isRex);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(actor.facing || 0);
    ctx.scale(isRex ? 1.07 : 0.98, isRex ? 1.07 : 1.0);
    if (down) {
      ctx.rotate(Math.PI / 2);
      this.drawDownedWrestler(ctx, p, actor.state);
    } else {
      this.drawStandingWrestler(ctx, p, statePose);
    }
    ctx.restore();

    this.drawNameTag(ctx, pos.x, pos.y + 55, actor.profile.shortName, isRex);
  }

  paletteFor(actor, isRex) {
    const gear = hexToCss(actor.profile.gearColor ?? (isRex ? 0xf4f4f4 : 0x17191f));
    const darkGear = (actor.profile.gearColor ?? 0xffffff) < 0x555555;
    return {
      ink: '#050505',
      skin: isRex ? '#f3dcc4' : '#e6bd9c',
      soft: darkGear ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)',
      gear,
      gearLine: darkGear ? '#f4f4f4' : '#171717',
      hair: hexToCss(actor.profile.hairColor ?? (isRex ? 0xd8b449 : 0x18110f)),
      boot: darkGear ? '#111111' : '#f0f0f0',
      tape: '#ffffff'
    };
  }

  poseFor(state, clock, isRex) {
    const walk = Math.sin(clock * 8 + (isRex ? 0 : Math.PI)) * 4;
    const locking = state === 'lockup' || state === 'grappleAdvantage';
    const running = state === 'ropeRun' || state === 'closingDistance';
    const striking = state === 'striking';
    const selling = state === 'selling' || state === 'recovering';
    const pinning = state === 'pinning';

    return {
      step: running ? 11 + walk : selling ? 5 : 0,
      crouch: locking ? 5 : selling ? 3 : 0,
      armLift: locking ? -47 : 0,
      strike: striking ? -32 : 0,
      openHands: locking || pinning,
      pinning,
      selling
    };
  }

  drawStandingWrestler(ctx, p, pose) {
    drawFilledEllipse(ctx, 0, 10, 34, 47, 'rgba(0,0,0,0.16)', 'transparent', 0);

    drawLimb(ctx, -13, 25 + pose.crouch, -19, 75 + pose.step * 0.35, p.skin, p.ink, 7);
    drawLimb(ctx, 13, 25 + pose.crouch, 19, 69 - pose.step * 0.35, p.skin, p.ink, 7);
    drawFilledEllipse(ctx, -19, 82 + pose.step * 0.25, 6.5, 12, p.boot, p.ink, 2);
    drawFilledEllipse(ctx, 19, 76 - pose.step * 0.25, 6.5, 12, p.boot, p.ink, 2);
    drawFilledEllipse(ctx, -19, 54 + pose.step, 9, 5, p.gear, p.ink, 1.6);
    drawFilledEllipse(ctx, 19, 48 - pose.step * 0.45, 9, 5, p.gear, p.ink, 1.6);

    drawFilledEllipse(ctx, 0, -9 + pose.crouch, 36, 28, p.skin, p.ink, 3);
    drawFilledEllipse(ctx, -28, -12 + pose.crouch, 10, 14, p.skin, p.ink, 2.2);
    drawFilledEllipse(ctx, 28, -12 + pose.crouch, 10, 14, p.skin, p.ink, 2.2);
    drawFilledEllipse(ctx, 0, 24 + pose.crouch, 24, 14, p.gear, p.ink, 2.2);

    drawLine(ctx, 0, -33 + pose.crouch, 0, 12 + pose.crouch, p.soft, 1.4);
    drawLine(ctx, -22, -17 + pose.crouch, -6, -5 + pose.crouch, p.soft, 1.3);
    drawLine(ctx, 22, -17 + pose.crouch, 6, -5 + pose.crouch, p.soft, 1.3);
    drawLine(ctx, -17, 30 + pose.crouch, 17, 30 + pose.crouch, p.gearLine, 1.2, 'butt');

    const leftHandY = 47 + pose.armLift;
    const rightHandY = 47 + pose.armLift + pose.strike;
    drawQuadraticLimb(ctx, -34, -9 + pose.crouch, -46, 8 + pose.armLift, -38, 38 + pose.armLift, p.skin, p.ink, 7);
    drawQuadraticLimb(ctx, 34, -9 + pose.crouch, 46, 8 + pose.armLift + pose.strike * 0.2, 38, 38 + pose.armLift + pose.strike, p.skin, p.ink, 7);
    drawFilledEllipse(ctx, -38, 38 + pose.armLift, 5, 4, p.tape, p.ink, 1.5);
    drawFilledEllipse(ctx, 38, 38 + pose.armLift + pose.strike, 5, 4, p.tape, p.ink, 1.5);
    this.hand(ctx, -38, leftHandY, p, pose.openHands);
    this.hand(ctx, 38, rightHandY, p, pose.openHands);

    drawFilledEllipse(ctx, 0, -51 + pose.crouch, 14, 17, p.skin, p.ink, 2.6);
    drawFilledEllipse(ctx, 0, -66 + pose.crouch, 16, 8, p.hair, p.ink, 2);
    drawFilledEllipse(ctx, -8, -60 + pose.crouch, 6, 5, p.hair, p.ink, 1.4);
    drawFilledEllipse(ctx, 8, -60 + pose.crouch, 6, 5, p.hair, p.ink, 1.4);
  }

  hand(ctx, x, y, p, open) {
    drawFilledEllipse(ctx, x, y, open ? 7 : 5.5, open ? 6 : 5, p.skin, p.ink, 1.7);
    if (open) {
      drawLine(ctx, x - 4, y - 1.5, x + 4, y - 1.5, 'rgba(0,0,0,0.5)', 1, 'butt');
      drawLine(ctx, x - 4, y + 2, x + 4, y + 2, 'rgba(0,0,0,0.42)', 1, 'butt');
    }
  }

  drawDownedWrestler(ctx, p, state) {
    drawFilledEllipse(ctx, 0, 4, 45, 22, 'rgba(0,0,0,0.18)', 'transparent', 0);
    drawFilledEllipse(ctx, 0, 0, 41, 22, p.skin, p.ink, 2.5);
    drawFilledEllipse(ctx, 47, -10, 14, 13, p.skin, p.ink, 2.2);
    drawFilledEllipse(ctx, 53, -20, 10, 6, p.hair, p.ink, 1.5);
    drawFilledEllipse(ctx, 0, 13, 23, 10, p.gear, p.ink, 1.8);
    drawLimb(ctx, -14, 14, -50, 43, p.skin, p.ink, 6);
    drawLimb(ctx, 12, 14, 44, 42, p.skin, p.ink, 6);
    drawFilledEllipse(ctx, -53, 46, 6, 11, p.boot, p.ink, 1.7);
    drawFilledEllipse(ctx, 47, 45, 6, 11, p.boot, p.ink, 1.7);
    drawLimb(ctx, -23, -12, -57, -1, p.skin, p.ink, 6);
    drawLimb(ctx, 20, -16, 55, -33, p.skin, p.ink, 6);
    this.hand(ctx, -60, 0, p, true);
    this.hand(ctx, 58, -35, p, true);

    if (state === 'pinned') {
      ctx.strokeStyle = 'rgba(0,0,0,0.75)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-48, -28, 96, 65);
    }
  }

  drawReferee(ctx, ref, clock) {
    const pos = this.ringToCanvas(ref.position.x, ref.position.y);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(Math.sin(clock * 1.7) * 0.18);
    drawFilledEllipse(ctx, 0, 2, 13, 18, '#ffffff', '#050505', 2.3);
    drawLine(ctx, -8, -9, -8, 14, '#050505', 4, 'butt');
    drawLine(ctx, 3, -9, 3, 14, '#050505', 4, 'butt');
    drawFilledEllipse(ctx, 0, -21, 8, 9, '#f1d4bd', '#050505', 2);
    drawFilledEllipse(ctx, 0, -27, 8, 4.5, '#111111', '#050505', 1.3);
    ctx.restore();

    this.drawNameTag(ctx, pos.x, pos.y + 28, 'REF', false, true);
  }

  drawNameTag(ctx, x, y, text, isRex, small = false) {
    ctx.save();
    ctx.font = `${small ? 13 : 15}px Arial Black, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = isRex ? '#ffffff' : '#f4f4f4';
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
