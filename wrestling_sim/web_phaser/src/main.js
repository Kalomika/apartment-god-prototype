import Phaser from 'phaser';
import './styles.css';
import { ArenaScene } from './scenes/ArenaScene.js';

const deviceResolution = Math.min(window.devicePixelRatio || 1, 2.5);

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#080808',
  resolution: deviceResolution,
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
    antialiasGL: true,
    roundPixels: true
  },
  input: {
    activePointers: 4
  },
  scene: [ArenaScene]
};

new Phaser.Game(config);
