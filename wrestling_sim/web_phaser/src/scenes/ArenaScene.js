import Phaser from 'phaser';
import { TopDownCanvasRenderer } from '../render/TopDownCanvasRenderer.js';
import { ChoicePanel } from '../ui/ChoicePanel.js';
import { initialMatch, roster } from '../data/roster.js';
import { MatchEngine } from '../sim/matchEngine.js';

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super('ArenaScene');
    this.layout = null;
    this.snapshot = null;
  }

  create() {
    const red = roster.find((wrestler) => wrestler.id === initialMatch.redCornerId);
    const blue = roster.find((wrestler) => wrestler.id === initialMatch.blueCornerId);

    this.engine = new MatchEngine({ red, blue, ruleSet: initialMatch.ruleSet });
    this.matchView = new TopDownCanvasRenderer(this);
    this.choicePanel = new ChoicePanel(this);
    this.hudText = this.add.text(0, 0, '', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0);

    this.choicePanel.setMode('match');
    this.choicePanel.setChoices(this.engine.getChoiceList(), (choice) => {
      this.engine.queueSuggestion(choice.id);
      this.choicePanel.setDialogue('GM', `Suggest ${choice.label}.`);
    });

    this.scale.on('resize', this.handleResize, this);
    this.handleResize({ width: this.scale.width, height: this.scale.height });
    this.choicePanel.setDialogue('GM OFFICE', `${red.name} versus ${blue.name} is booked.`);
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const arenaHeight = Math.floor(height * 0.50);
    this.layout = { width, height, arenaHeight };
    this.matchView.layout(this.layout);
    this.choicePanel.layout(this.layout);
    this.positionFromSnapshot();
  }

  update(time, delta) {
    if (!this.layout || !this.engine) return;
    this.snapshot = this.engine.update(delta);
    this.positionFromSnapshot();
    this.choicePanel.setLog(this.snapshot.log);
  }

  positionFromSnapshot() {
    if (!this.snapshot) {
      const first = this.engine?.getSnapshot();
      if (!first) return;
      this.snapshot = first;
    }

    this.matchView.draw(this.layout, this.snapshot);
    this.hudText.setPosition(Math.round(this.layout.width * 0.5), 8);
    this.hudText.setFontSize(this.layout.width < 430 ? 13 : 16);
    this.hudText.setText(`${this.snapshot.red.profile.shortName} STA ${Math.round(this.snapshot.red.stamina)} DMG ${Math.round(this.snapshot.red.damage)}   ${this.snapshot.blue.profile.shortName} STA ${Math.round(this.snapshot.blue.stamina)} DMG ${Math.round(this.snapshot.blue.damage)}`);
  }
}
