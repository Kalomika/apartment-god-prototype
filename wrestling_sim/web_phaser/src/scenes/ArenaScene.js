import Phaser from 'phaser';
import { HardCamSpriteRingRenderer } from '../render/HardCamSpriteRingRenderer.js';
import { ChoicePanel } from '../ui/ChoicePanel.js';
import { initialMatch, roster } from '../data/roster.js';
import { MatchEngine } from '../sim/matchEngine.js';

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super('ArenaScene');
    this.layout = null;
    this.snapshot = null;
  }

  preload() {
    this.load.svg('hard-cam-crowd-bg-0', 'assets/crowd/hard_cam_crowd_background_frame_0.svg', { width: 960, height: 540 });
    this.load.svg('hard-cam-crowd-bg-1', 'assets/crowd/hard_cam_crowd_background_frame_1.svg', { width: 960, height: 540 });
    this.load.svg('hard-cam-ring-frame-0', 'assets/ring/hard_cam_ring_approval_frame_0.svg', { width: 960, height: 540 });
    this.load.svg('hard-cam-ring-frame-1', 'assets/ring/hard_cam_ring_approval_frame_1.svg', { width: 960, height: 540 });
    this.load.svg('hard-cam-crowd-fg-0', 'assets/crowd/hard_cam_crowd_foreground_frame_0.svg', { width: 960, height: 540 });
    this.load.svg('hard-cam-crowd-fg-1', 'assets/crowd/hard_cam_crowd_foreground_frame_1.svg', { width: 960, height: 540 });
  }

  create() {
    const red = roster.find((wrestler) => wrestler.id === initialMatch.redCornerId);
    const blue = roster.find((wrestler) => wrestler.id === initialMatch.blueCornerId);

    this.engine = new MatchEngine({ red, blue, ruleSet: initialMatch.ruleSet });
    this.ringPreview = new HardCamSpriteRingRenderer(this);
    this.choicePanel = new ChoicePanel(this);
    this.hudText = this.add.text(0, 0, '', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0).setDepth(10);

    this.choicePanel.setMode('match');
    this.choicePanel.setChoices(this.engine.getChoiceList(), (choice) => {
      this.engine.queueSuggestion(choice.id);
      this.choicePanel.setDialogue('GM', `Suggest ${choice.label}.`);
    });

    this.scale.on('resize', this.handleResize, this);
    this.handleResize({ width: this.scale.width, height: this.scale.height });
    this.choicePanel.setDialogue('RING APPROVAL', 'Layered hard cam sprite ring proof. Background crowd, ring, and foreground crowd are separate sprite plates. Wrestlers stay hidden until the ring is approved.');
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const arenaHeight = Math.floor(height * 0.50);
    this.layout = { width, height, arenaHeight };
    this.ringPreview.layout(this.layout);
    this.choicePanel.layout(this.layout);
    this.positionFromSnapshot();
  }

  update(time, delta) {
    if (!this.layout || !this.engine) return;
    this.snapshot = this.engine.update(delta);
    this.ringPreview.update(time);
    this.positionFromSnapshot();
    this.choicePanel.setLog('Ring approval pass only. Wrestlers and sprite cycles are disabled until the layered hard cam ring direction is approved.');
  }

  positionFromSnapshot() {
    if (!this.snapshot) {
      const first = this.engine?.getSnapshot();
      if (!first) return;
      this.snapshot = first;
    }

    this.hudText.setPosition(Math.round(this.layout.width * 0.5), 8);
    this.hudText.setFontSize(this.layout.width < 430 ? 12 : 15);
    this.hudText.setText('LAYERED HARD CAM SPRITE RING   8 FPS A/B CROWD   NO WRESTLERS YET');
  }
}
