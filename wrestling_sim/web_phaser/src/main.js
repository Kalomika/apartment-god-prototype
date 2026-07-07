import Phaser from 'phaser';
import './styles.css';
import { ArenaScene } from './scenes/ArenaScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#080808',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  render: {
    antialias: true,
    roundPixels: false
  },
  input: {
    activePointers: 4
  },
  scene: [ArenaScene]
};

new Phaser.Game(config);
