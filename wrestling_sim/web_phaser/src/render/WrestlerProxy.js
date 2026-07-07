export class WrestlerProxy {
  constructor(scene, profile, textureKey = null) {
    this.scene = scene;
    this.profile = profile;
    this.textureKey = textureKey;
    this.container = scene.add.container(0, 0);
    this.graphics = scene.add.graphics();
    this.sprite = null;

    if (textureKey && scene.textures.exists(textureKey)) {
      this.sprite = scene.add.image(0, 0, textureKey).setOrigin(0.5, 0.52);
      this.sprite.setDisplaySize(98, 112);
      this.graphics.setVisible(false);
    }

    this.nameText = scene.add.text(0, 60, profile.shortName, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '10px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    this.container.add(this.sprite ? [this.sprite, this.graphics, this.nameText] : [this.graphics, this.nameText]);
    this.state = 'idle';
    this.scale = 1;
    this.draw();
  }

  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.draw();
    }
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  setFacingRadians(angle) {
    this.container.setRotation(angle);
  }

  setSpriteScale(scale) {
    this.scale = scale * (this.profile.bodyScale ?? 1);
    this.container.setScale(this.scale);
  }

  draw() {
    if (this.sprite) {
      this.drawSpritePose();
      return;
    }

    this.drawFallbackLineArt();
  }

  drawSpritePose() {
    this.graphics.clear();
    const locking = this.state === 'lockup' || this.state === 'grappleAdvantage';
    const down = this.state === 'downed' || this.state === 'pinned';

    this.sprite.setAngle(down ? 86 : 0);
    this.sprite.setPosition(0, down ? 3 : 0);
    this.sprite.setAlpha(down ? 0.95 : 1);
    this.sprite.setTint(0xffffff);

    if (locking) {
      this.graphics.setVisible(true);
      this.graphics.clear();
      this.graphics.lineStyle(2, 0x111111, 0.85);
      this.graphics.strokeCircle(0, -4, 36);
    } else {
      this.graphics.clear();
      this.graphics.setVisible(false);
    }

    this.nameText.setY(down ? 48 : 58);
  }

  drawFallbackLineArt() {
    const g = this.graphics;
    g.setVisible(true);
    g.clear();

    const ink = 0x3c3c3c;
    const softInk = 0x8a8a8a;
    const bodyFill = 0xffffff;
    const gear = this.profile.gearColor ?? 0xefefef;
    const hair = this.profile.hairColor ?? 0x111111;

    const locking = this.state === 'lockup' || this.state === 'grappleAdvantage';
    const striking = this.state === 'striking';
    const running = this.state === 'ropeRun' || this.state === 'closingDistance';
    const down = this.state === 'downed' || this.state === 'pinned';
    const selling = this.state === 'selling' || this.state === 'recovering';

    if (down) {
      this.drawDowned(g, ink, softInk, bodyFill, gear, hair);
      this.nameText.setY(48);
      return;
    }

    const armReach = locking ? -20 : 0;
    const strikeReach = striking ? -28 : 0;
    const step = running ? 10 : selling ? 5 : 0;

    this.drawSegment(g, -13, 18, -20, 42 + step, 4.5, ink, bodyFill);
    this.drawSegment(g, 13, 18, 20, 36 - step * 0.4, 4.5, ink, bodyFill);
    this.drawFoot(g, -20, 57 + step * 0.25, ink, gear);
    this.drawFoot(g, 22, 51 - step * 0.35, ink, gear);
    this.ellipse(g, -19, 39 + step, 13, 8, ink, gear, 1.2);
    this.ellipse(g, 19, 34 - step * 0.35, 13, 8, ink, gear, 1.2);
    this.ellipse(g, 0, -8, 58, 46, ink, bodyFill, 1.6);
    this.ellipse(g, -26, -11, 17, 22, ink, bodyFill, 1.3);
    this.ellipse(g, 26, -11, 17, 22, ink, bodyFill, 1.3);
    this.ellipse(g, 0, 18, 39, 24, ink, gear, 1.3);

    g.lineStyle(1, softInk, 0.65);
    g.lineBetween(0, -28, 0, 2);
    g.lineBetween(-17, -12, -3, -7);
    g.lineBetween(17, -12, 3, -7);
    g.lineBetween(-18, 13, 18, 13);

    this.drawSegment(g, -29, -8, -42, 11 + armReach, 4.3, ink, bodyFill);
    this.drawSegment(g, -42, 11 + armReach, -37, 31 + armReach, 3.9, ink, bodyFill);
    this.drawSegment(g, 29, -8, 42 + strikeReach * 0.4, 11 + armReach, 4.3, ink, bodyFill);
    this.drawSegment(g, 42 + strikeReach * 0.4, 11 + armReach, 37 + strikeReach, 31 + armReach, 3.9, ink, bodyFill);
    this.ellipse(g, -38, 31 + armReach, 8, 6, ink, gear, 1.1);
    this.ellipse(g, 37 + strikeReach, 31 + armReach, 8, 6, ink, gear, 1.1);
    this.ellipse(g, -37, 41 + armReach, 10, 8, ink, bodyFill, 1.1);
    this.ellipse(g, 37 + strikeReach, 41 + armReach, 10, 8, ink, bodyFill, 1.1);
    this.ellipse(g, 0, -44, 24, 30, ink, bodyFill, 1.5);

    g.fillStyle(hair, 1);
    if (this.profile.hair === 'bald') {
      g.fillEllipse(0, -55, 9, 5);
    } else {
      g.fillEllipse(0, -58, 27, 11);
      g.fillEllipse(-8, -53, 9, 7);
      g.fillEllipse(8, -53, 9, 7);
    }

    if (locking) {
      g.lineStyle(1, softInk, 0.65);
      g.strokeCircle(0, -2, 34);
    }

    this.nameText.setY(66);
  }

  drawDowned(g, ink, softInk, bodyFill, gear, hair) {
    this.ellipse(g, 0, 0, 72, 36, ink, bodyFill, 1.6);
    this.ellipse(g, 43, -10, 24, 21, ink, bodyFill, 1.4);
    g.fillStyle(hair, 1);
    g.fillEllipse(51, -16, 15, 8);
    this.drawSegment(g, -13, 14, -33, 34, 4.0, ink, bodyFill);
    this.drawSegment(g, 9, 14, 31, 34, 4.0, ink, bodyFill);
    this.drawFoot(g, -43, 40, ink, gear);
    this.drawFoot(g, 39, 39, ink, gear);
    this.drawSegment(g, -22, -12, -47, -10, 3.8, ink, bodyFill);
    this.drawSegment(g, 18, -15, 42, -28, 3.8, ink, bodyFill);
    this.ellipse(g, -55, -9, 9, 7, ink, bodyFill, 1.1);
    this.ellipse(g, 50, -32, 9, 7, ink, bodyFill, 1.1);
    g.lineStyle(1, softInk, 0.55);
    g.lineBetween(-20, -8, 22, -11);
    g.lineBetween(-18, 8, 26, 6);
  }

  drawSegment(g, x1, y1, x2, y2, width, ink, fill) {
    g.lineStyle(width + 2, ink, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(width, fill, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(1, ink, 1);
    g.strokeCircle(x1, y1, width * 0.55);
    g.strokeCircle(x2, y2, width * 0.55);
  }

  drawFoot(g, x, y, ink, fill) {
    this.ellipse(g, x, y, 10, 18, ink, fill, 1.1);
  }

  ellipse(g, x, y, w, h, ink, fill, lineWidth = 1.5) {
    g.fillStyle(fill, 1);
    g.lineStyle(lineWidth, ink, 1);
    g.fillEllipse(x, y, w, h);
    g.strokeEllipse(x, y, w, h);
  }
}
