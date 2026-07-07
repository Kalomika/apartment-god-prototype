export class WrestlerProxy {
  constructor(scene, profile) {
    this.scene = scene;
    this.profile = profile;
    this.container = scene.add.container(0, 0);
    this.shadow = scene.add.graphics();
    this.graphics = scene.add.graphics();
    this.nameText = scene.add.text(0, 0, profile.shortName, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    this.container.add([this.shadow, this.graphics, this.nameText]);
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
    const g = this.graphics;
    const s = this.shadow;
    g.clear();
    s.clear();

    const line = this.profile.outlineColor ?? 0x050505;
    const skin = 0xf2f2f2;
    const gear = this.profile.gearColor ?? 0xdedede;
    const hair = this.profile.hairColor ?? 0x111111;
    const sellingSquash = this.state === 'downed' || this.state === 'pinned';
    const strikeReach = this.state === 'striking' ? 14 : 0;
    const lockRaise = this.state === 'lockup' || this.state === 'grappleAdvantage' ? -12 : 0;
    const runLean = this.state === 'ropeRun' || this.state === 'closingDistance' ? 6 : 0;

    s.fillStyle(0x000000, 0.24);
    s.fillEllipse(0, 18, 78, 112);

    // Legs, visible from strict overhead with staggered stance.
    const leftLegForward = 48 + runLean;
    const rightLegForward = 34 - runLean * 0.35;
    this.drawCapsule(g, -15, 17, -25, leftLegForward, 7.5, skin, line);
    this.drawCapsule(g, 15, 17, 23, rightLegForward, 7.5, skin, line);
    this.drawCapsule(g, -25, leftLegForward - 2, -30, leftLegForward + 20, 8.5, gear, line);
    this.drawCapsule(g, 23, rightLegForward - 2, 29, rightLegForward + 21, 8.5, gear, line);

    // Knee pads.
    g.fillStyle(gear, 1);
    g.lineStyle(2, line, 1);
    g.fillEllipse(-21, 34, 19, 13);
    g.strokeEllipse(-21, 34, 19, 13);
    g.fillEllipse(19, 30, 19, 13);
    g.strokeEllipse(19, 30, 19, 13);

    // Torso shoulders and trunks. This is direct overhead, no camera angle.
    g.fillStyle(skin, 1);
    g.lineStyle(3, line, 1);
    g.fillEllipse(0, -5, 70, 49);
    g.strokeEllipse(0, -5, 70, 49);
    g.fillEllipse(-29, -9, 19, 26);
    g.strokeEllipse(-29, -9, 19, 26);
    g.fillEllipse(29, -9, 19, 26);
    g.strokeEllipse(29, -9, 19, 26);

    g.fillStyle(gear, 1);
    g.fillEllipse(0, 22, 45, 27);
    g.strokeEllipse(0, 22, 45, 27);
    g.lineStyle(2, line, 1);
    g.lineBetween(-22, 10, 22, 10);

    // Arms, separated into upper arm and forearm so they can later become rig bones.
    this.drawCapsule(g, -33, -5, -48, 18 + lockRaise, 8, skin, line);
    this.drawCapsule(g, -48, 18 + lockRaise, -38, 42 + lockRaise, 7, skin, line);
    this.drawCapsule(g, 33, -5, 48 + strikeReach, 18 + lockRaise, 8, skin, line);
    this.drawCapsule(g, 48 + strikeReach, 18 + lockRaise, 38 + strikeReach, 42 + lockRaise, 7, skin, line);

    // Wrist tape and hands.
    g.fillStyle(gear, 1);
    g.fillCircle(-41, 35 + lockRaise, 6);
    g.strokeCircle(-41, 35 + lockRaise, 6);
    g.fillCircle(41 + strikeReach, 35 + lockRaise, 6);
    g.strokeCircle(41 + strikeReach, 35 + lockRaise, 6);
    g.fillStyle(skin, 1);
    g.fillEllipse(-38, 48 + lockRaise, 14, 11);
    g.strokeEllipse(-38, 48 + lockRaise, 14, 11);
    g.fillEllipse(38 + strikeReach, 48 + lockRaise, 14, 11);
    g.strokeEllipse(38 + strikeReach, 48 + lockRaise, 14, 11);

    // Head and hair mass, direct top of head with no facial angle.
    g.fillStyle(skin, 1);
    g.fillEllipse(0, -43, 28, 36);
    g.strokeEllipse(0, -43, 28, 36);
    g.fillStyle(hair, 1);
    if (this.profile.hair === 'bald') {
      g.fillEllipse(0, -51, 14, 7);
    } else {
      g.fillEllipse(0, -56, 29, 13);
      g.fillEllipse(-9, -51, 10, 8);
      g.fillEllipse(9, -51, 10, 8);
    }

    // State readability markers.
    if (this.state === 'grappleAdvantage' || this.state === 'advantage') {
      g.lineStyle(2, 0x000000, 0.8);
      g.strokeCircle(0, -3, 41);
    }

    if (sellingSquash) {
      this.container.setAngle(90);
    } else if (this.container.angle === 90) {
      this.container.setAngle(0);
    }

    this.nameText.setY(68);
  }

  drawCapsule(g, x1, y1, x2, y2, radius, fill, line) {
    g.lineStyle(radius * 2 + 2, line, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(radius * 2, fill, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.fillStyle(fill, 1);
    g.fillCircle(x1, y1, radius);
    g.fillCircle(x2, y2, radius);
    g.lineStyle(2, line, 1);
    g.strokeCircle(x1, y1, radius);
    g.strokeCircle(x2, y2, radius);
  }
}
