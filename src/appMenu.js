import { handleBuildRequest } from './buildRequests.js';
import { startObjectAction, startOffsite } from './actions.js';
import { assignCareer, CAREER_TRACKS, careerFor, quitCareer, trackForCareer, workDueText } from './careerSystem.js';
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
  const careerMenu = () => {
    const career = careerFor(state, actor);
    const track = trackForCareer(career);
    const items = [
      { label: workDueText(state, actor), run: careerMenu },
      { label: track ? `Work Shift Now: ${track.label}` : 'Temp Work Shift Now', run: () => startOffsite(state, actor, 'work', [], 'auto') }
    ];
    if (track) items.push({ label: `Quit ${track.label}`, run: () => quitCareer(state, actor) });
    for (const option of CAREER_TRACKS) items.push({ label: `Apply: ${option.label} (${option.scheduleLabel})`, run: () => assignCareer(state, actor, option.id) });
    cell('Career / Work', items);
  };
  openMenu(660, 86, 'Cell', [
    { label: 'Food / Delivery', run: foodMenu },
    { label: 'Career / Work', run: careerMenu },
    { label: 'Shop / Build Items', run: shopMenu },
    { label: 'Music Apps', run: musicMenu }
  ]);
}
