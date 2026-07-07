import { log } from './state.js';

export const INVESTMENTS = [
  { id: 'theater_chain', label: 'Movie Theater Chain', buyIn: 180, volatility: 0.08, dividend: 4 },
  { id: 'airline_counter', label: 'Airline Customer Service', buyIn: 260, volatility: 0.12, dividend: 6 },
  { id: 'beach_resort', label: 'Beach Resort', buyIn: 320, volatility: 0.1, dividend: 7 },
  { id: 'arcade_brand', label: 'Arcade Brand', buyIn: 140, volatility: 0.14, dividend: 3 },
  { id: 'gym_franchise', label: 'Gym Franchise', buyIn: 220, volatility: 0.09, dividend: 5 }
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
    const swing = Math.sin((state.time + shares * 17 + item.buyIn) / 97) * item.volatility;
    const dividend = Math.round(shares * item.dividend * (1 + swing));
    net += dividend;
  }
  if (!net) return;
  state.money += net;
  state.investments.lifetime = (state.investments.lifetime || 0) + net;
  log(state, `Investments paid ${net >= 0 ? '$' + net : '-$' + Math.abs(net)}.`);
}

export function investmentSummary(state) {
  const holdings = state.investments?.holdings || {};
  const rows = INVESTMENTS.map(item => `${item.label}: ${holdings[item.id] || 0}`).join('<br>');
  return `${rows}<br>Lifetime returns: $${Math.round(state.investments?.lifetime || 0)}`;
}
