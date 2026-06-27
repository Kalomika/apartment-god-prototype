import { changeNeed, log, say, setMood } from './state.js';
import { objects } from './world.js';

const GENRES = {
  rap: { label: 'Rap', mood: 'hyped', fun: 10, social: 5, intellect: 0, stamina: 2, bubble: 'RAP' },
  rock: { label: 'Rock', mood: 'hyped', fun: 12, social: 2, intellect: 0, stamina: 4, bubble: 'ROCK' },
  classical: { label: 'Classical', mood: 'calm', fun: 4, social: 0, intellect: 4, stamina: 0, bubble: 'CLASS' },
  jazz: { label: 'Jazz', mood: 'calm', fun: 7, social: 3, intellect: 2, stamina: 0, bubble: 'JAZZ' },
  afrobeat: { label: 'Afrobeat', mood: 'happy', fun: 11, social: 5, intellect: 0, stamina: 3, bubble: 'BEAT' },
  electronic: { label: 'Electronic', mood: 'hyped', fun: 9, social: 2, intellect: 1, stamina: 2, bubble: 'EDM' }
};

export function genreList() {
  return Object.keys(GENRES).join(', ');
}

export function startMusic(state, actor, genreName = 'rap') {
  const key = String(genreName || 'rap').toLowerCase().trim();
  const genre = GENRES[key] || GENRES.rap;
  ensureStereo();
  state.music = { genre: genre.label, t: 14, actorId: actor.id };
  actor.action = `Listening to ${genre.label} music`;
  actor.actionT = 14;
  actor.actionTotal = 14;
  actor.pose = 'dance';
  setMood(actor, genre.mood);
  say(actor, genre.bubble);
  log(state, `${actor.name} started pretend ${genre.label} music.`);
  return true;
}

export function updateMusic(state) {
  if (!state.music) return;
  const actor = state.entities.find(e => e.id === state.music.actorId);
  if (!actor || actor.actionT > 0) return;
  const genre = Object.values(GENRES).find(g => g.label === state.music.genre) || GENRES.rap;
  changeNeed(actor, 'fun', genre.fun);
  changeNeed(actor, 'social', genre.social);
  changeNeed(actor, 'stamina', genre.stamina);
  if (genre.intellect && actor.skills) actor.skills.intellect = Math.min(actor.skillCaps?.intellect ?? 7, +(actor.skills.intellect + genre.intellect * 0.05).toFixed(2));
  actor.pose = 'stand';
  actor.action = 'Idle';
  say(actor, '♪');
  state.music = null;
}

function ensureStereo() {
  if (objects.some(o => o.id === 'stereo')) return;
  objects.push({ id: 'stereo', label: 'Stereo', kind: 'stereo', floor: 0, room: 'living', x: 336, y: 132, w: 58, h: 34, solid: true });
}
