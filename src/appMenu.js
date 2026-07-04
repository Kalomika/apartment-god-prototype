import { handleBuildRequest } from './buildRequests.js';
import { startObjectAction } from './actions.js';
import { startCookingFlow } from './cooking.js';
import { orderFood, buyWorkoutGear } from './economy.js';
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
  const shopMenu = () => cell('Shop / Build Items', [
    { label: 'Workout Gear Now', run: () => buyWorkoutGear(state, actor) },
    { label: 'Bookshelf', run: () => handleBuildRequest(state, actor, 'bookshelf') },
    { label: 'Couch', run: () => handleBuildRequest(state, actor, 'couch') },
    { label: 'Desk', run: () => handleBuildRequest(state, actor, 'desk') },
    { label: 'TV', run: () => handleBuildRequest(state, actor, 'tv') },
    { label: 'Pool Table', run: () => handleBuildRequest(state, actor, 'pool table') },
    { label: 'Arcade Machine', run: () => handleBuildRequest(state, actor, 'arcade') },
    { label: 'Console Setup', run: () => handleBuildRequest(state, actor, 'console') },
    { label: 'Dart Board', run: () => handleBuildRequest(state, actor, 'dart board') }
  ]);
  const musicMenu = () => cell('Music Apps', ['rap', 'jazz', 'cyberpunk', 'ambient', 'rock', 'dance'].map(genre => ({ label: `Play ${genre}`, run: () => startMusic(state, actor, genre) })));
  openMenu(660, 86, 'Cell', [
    { label: 'Food / Delivery', run: foodMenu },
    { label: 'Shop / Build Items', run: shopMenu },
    { label: 'Music Apps', run: musicMenu }
  ]);
}
