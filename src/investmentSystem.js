import { log } from './state.js';

export const INVESTMENTS = [
  { id: 'theater_chain', label: 'Movie Theater Chain', buyIn: 180, volatility: 0.08, dividend: 4 },
  { id: 'airline_counter', label: 'Airline Customer Service', buyIn: 260, volatility: 0.12, dividend: 6 },
  { id: 'beach_resort', label: 'Beach Resort', buyIn: 320, volatility: 0.1, dividend: 7 },
  { id: 'arcade_brand', label: 'Arcade Brand', buyIn: 140, volatility: 0.14, dividend: 3 },
  { id: 'gym_franchise', label: 'Gym Franchise', buyIn: 220, volatility: 0.09, dividend: 5 },
  { id: 'magic_fund', label: 'Magic Fund', buyIn: 120, volatility: 0.42, dividend: 2, cryptoLike: true }
];

export function buyInvestment(state, id) {
  const item = INVESTMENTS.find(x => x.id === id);
  if (!item) return false;
  state.investments ??= { holdings: {}, tick: 0, lifetime: 0 };
  if (state.money < item.buyIn) { log(state, `Need $${item.buyIn} to invest in ${item.label}.`); return false; }
  state.money -= item.buyIn;
  state.investments.holdings[id] = (state.investments.holdings[id] || 0) + 1;
  log(state, `Bought 1 share of ${item.label}.`);
  return true;
}

export function updateInvestments(state, dt) {
  if (!state.investments?.holdings) return;
  state.investments.tick = (state.investments.tick || 0) + dt;
  if (state.investments.tick < 8) return;
  state.investments.tick = 0;
  let net = 0;
  for (const item of INVESTMENTS) {
    const shares = state.investments.holdings[item.id] || 0;
    if (!shares) continue;
    const market = Math.sin((state.time + shares * 17 + item.buyIn) / (item.cryptoLike ? 23 : 47));
    const crashWave = Math.sin((state.time + item.buyIn * 3) / (item.cryptoLike ? 71 : 131));
    const moonWave = Math.sin((state.time + item.buyIn * 5) / 53);
    const shock = crashWave < (item.cryptoLike ? -0.82 : -0.92) ? -1 : item.cryptoLike && moonWave > 0.91 ? 1 : 0;
    const shockValue = shock < 0 ? -shares * Math.ceil(item.buyIn * (item.cryptoLike ? 0.09 : 0.035)) : shares * Math.ceil(item.buyIn * 0.12);
    const dividend = Math.round(shares * item.dividend * (1 + market * item.volatility) + shockValue);
    net += dividend;
  }
  if (!net) return;
  state.money += net;
  state.investments.lifetime = (state.investments.lifetime || 0) + net;
  log(state, net >= 0 ? `Investments paid $${net}.` : `A business slump cost investments $${Math.abs(net)}.`);
}

export function investmentSummary(state) {
  const holdings = state.investments?.holdings || {};
  const rows = INVESTMENTS.map(item => `${item.label}: ${holdings[item.id] || 0}`).join('<br>');
  return `${rows}<br>Lifetime returns: $${Math.round(state.investments?.lifetime || 0)}`;
}
