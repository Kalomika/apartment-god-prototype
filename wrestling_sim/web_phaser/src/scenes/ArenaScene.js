import Phaser from 'phaser';
import { ReferenceMatchRenderer } from '../render/ReferenceMatchRenderer.js';
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
    this.load.image('reference-match', 'assets/reference/grapple_gods_reference_match.webp');
  }

  create() {
    const red = roster.find((wrestler) => wrestler.id === initialMatch.redCornerId);
    const blue = roster.find((wrestler) => wrestler.id === initialMatch.blueCornerId);

    this.engine = new MatchEngine({ red, blue, ruleSet: initialMatch.ruleSet });
    this.matchView = new ReferenceMatchRenderer(this);
    this.choicePanel = new ChoicePanel(this);

    this.choicePanel.setMode('match');
    this.choicePanel.setChoices(this.engine.getChoiceList(), (choice) => {
      this.engine.queueSuggestion(choice.id);
      this.choicePanel.setDialogue('GM', `Suggest ${choice.label}.`);
    });

    this.scale.on('resize', this.handleResize, this);
    this.handleResize({ width: this.scale.width, height: this.scale.height });
    this.choicePanel.setDialogue('PLAYTEST', `${red.name} versus ${blue.name}. Tap move suggestions and watch stamina, damage, impact flashes, camera shake, and the match log react.`);
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const arenaHeight = Math.floor(height * 0.52);
    this.layout = { width, height, arenaHeight };
    this.matchView.layout(this.layout);
    this.choicePanel.layout(this.layout);
  }

  update(time, delta) {
    if (!this.layout || !this.engine) return;

    this.snapshot = this.engine.update(delta);
    this.matchView.update(time, this.snapshot);
    this.choicePanel.setLog(this.snapshot.log);
  }
}
