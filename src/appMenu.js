import { orderFood } from './economy.js';

export function openDeviceHome(state, actor, openMenu) {
  actor.action = 'Using cell';
  openMenu(660, 86, 'Cell', [
    { label: 'Order Food', run: () => orderFood(state, actor, false) },
    { label: 'Shop', run: () => {} },
    { label: 'Music', run: () => {} }
  ]);
}
