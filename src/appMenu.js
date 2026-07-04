import { startObjectAction } from './actions.js';
import { startCookingFlow } from './cooking.js';
import { orderFood } from './economy.js';
import { startMusic } from './music.js';
import { objects } from './world.js';

export function openDeviceHome(state, actor, openMenu) {
  actor.action = 'Using cell';
  const cell = (title, items) => openMenu(660, 86, `Cell: ${title}`, [...items, { label: 'Back to Cell', run: () => openDeviceHome(state, actor, openMenu) }]);
  const foodMenu = () => cell('Food / Delivery', [
    { label: 'Order Food Delivery', run: () => orderFood(state, actor, false) },
    { label: 'Get Snack From Fridge', run: () => startObjectAction(state, actor, objects.find(o => o.id === 'fridge'), 'snack') },
    { label: 'Cook Meal', run: () => startCookingFlow(state, actor) }
  ]);
  const musicMenu = () => cell('Music Apps', ['rap', 'jazz', 'cyberpunk', 'ambient', 'rock', 'dance'].map(genre => ({ label: `Play ${genre}`, run: () => startMusic(state, actor, genre) })));
  openMenu(660, 86, 'Cell', [
    { label: 'Food / Delivery', run: foodMenu },
    { label: 'Music Apps', run: musicMenu }
  ]);
}
