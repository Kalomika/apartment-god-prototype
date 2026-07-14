import { describe, expect, it } from 'vitest';
import { createState } from '../src/state.js';
import { FRONT_YARD_FLOOR, beginFrontYardVehicleDeparture, beginFrontYardVehicleReturn, installFrontYardWorld, updateFrontYardVehicleDeparture, updateFrontYardVehicleReturn } from '../src/frontYardDriveway.js';
import { getObject, floors } from '../src/world.js';

describe('front yard driveway slice', () => {
  it('installs the South front yard floor and garage driveway portal', () => {
    installFrontYardWorld();

    expect(floors.some(floor => floor.id === FRONT_YARD_FLOOR && floor.name === 'Front Yard South')).toBe(true);
    expect(getObject('garage_driveway_exit')?.toFloor).toBe(FRONT_YARD_FLOOR);
    expect(getObject('front_driveway_garage_mouth')?.toFloor).toBe(3);
  });

  it('moves a departing vehicle from driveway to road exit', () => {
    const state = createState();
    const vehicle = { vehicleId: 'car_1', vehicleKind: 'car', actionId: 'work', partyIds: ['resident'], x: 196, y: 268, parkX: 196, parkY: 268, w: 126, h: 238, phase: 'leaving' };

    expect(beginFrontYardVehicleDeparture(state, vehicle)).toBe(true);
    expect(state.floor).toBe(FRONT_YARD_FLOOR);

    let result = false;
    for (let i = 0; i < 120 && result !== 'complete'; i++) {
      vehicle.t += 0.1;
      result = updateFrontYardVehicleDeparture(state, vehicle, 0.1);
    }

    expect(result).toBe('complete');
  });

  it('moves a returning vehicle from road back to garage handoff', () => {
    const state = createState();
    const vehicle = { vehicleId: 'car_1', vehicleKind: 'car', actionId: 'work', partyIds: ['resident'], x: 196, y: 268, parkX: 196, parkY: 268, w: 126, h: 238, phase: 'arriving' };

    expect(beginFrontYardVehicleReturn(state, vehicle)).toBe(true);
    expect(state.floor).toBe(FRONT_YARD_FLOOR);

    let result = false;
    for (let i = 0; i < 160 && result !== 'garage'; i++) {
      vehicle.t += 0.1;
      result = updateFrontYardVehicleReturn(state, vehicle, 0.1);
    }

    expect(result).toBe('garage');
  });
});
