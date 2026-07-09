import * as THREE from '../vendor/three.module.js';
import { createPlaceholderActor, getBodyHurtZones, getLimbHitVolumes } from '../src/three/actors3D.js';

const suit = createPlaceholderActor(THREE, 'suit_operative');
const commando = createPlaceholderActor(THREE, 'survival_commando');

if (!suit?.group || !commando?.group) throw new Error('Actors did not create Three groups.');
if (!suit.detail?.holster || !suit.detail?.lapelLeft || !suit.parts?.jaw || !suit.parts?.brow) throw new Error('Suit operative missing redesign details.');
if (!commando.detail?.vestPlate || !commando.detail?.magPouch0 || !commando.detail?.cargoLeft || !commando.parts?.jaw) throw new Error('Survival commando missing redesign details.');

const suitMeshes = [];
const commandoMeshes = [];
suit.group.traverse(child => { if (child.isMesh) suitMeshes.push(child); });
commando.group.traverse(child => { if (child.isMesh) commandoMeshes.push(child); });
if (suitMeshes.length < 34) throw new Error(`Suit model too sparse: ${suitMeshes.length} meshes.`);
if (commandoMeshes.length < 40) throw new Error(`Commando model too sparse: ${commandoMeshes.length} meshes.`);

const fighter = { extracted: false, facing: 0, pose: 'idle_guard', lastMove: 0, preview: false, shadowHidden: false, cqc: {} };
suit.update(fighter, 1 / 60, { x: 0, z: 0 });
commando.update(fighter, 1 / 60, { x: 1, z: 0 });

if (!getBodyHurtZones(suit).find(zone => zone.id === 'head')) throw new Error('Suit hurt zones missing head.');
if (!getLimbHitVolumes(commando).find(zone => zone.id === 'weapon_hand')) throw new Error('Commando limb volumes missing weapon hand.');

console.log(`Model smoke passed. Suit meshes ${suitMeshes.length}, commando meshes ${commandoMeshes.length}.`);
