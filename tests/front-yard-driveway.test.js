import { describe, expect, it } from 'vitest';
import { createState } from '../src/state.js';
import { DRIVEWAY_FLOOR, FRONT_YARD_FLOOR, beginFrontYardVehicleDeparture, beginFrontYardVehicleReturn, installFrontYardWorld, updateFrontYardVehicleDeparture, updateFrontYardVehicleReturn } from '../src/frontYardDriveway.js';
import { getObject, floors } from '../src/world.js';

describe('front yard driveway slice', () => {
  it('installs separate front yard and west driveway floors with correct portals', () => {
    installFrontYardWorld();

    expect(floors.some(floor => floor.id === FRONT_YARD_FLOOR && floor.name === 'Front Yard South')).toBe(true);
    expect(floors.some(floor => floor.id === DRIVEWAY_FLOOR && floor.name === 'Driveway West')).toBe(true);
    expect(getObject('main_front_yard_exit')?.toFloor).toBe(FRONT_YARD_FLOOR);
    expect(getObject('front_yard_driveway_edge')?.toFloor).toBe(DRIVEWAY_FLOOR);
    expect(getObject('garage_driveway_exit')?.toFloor).toBe(DRIVEWAY_FLOOR);
    expect(getObject('front_driveway_garage_mouth')?.toFloor).toBe(3);
  });

  it('keeps the main front yard as porch garden and play frontage instead of driveway', () => {
    installFrontYardWorld();
    const front = floors.find(floor => floor.id === FRONT_YARD_FLOOR);
    const driveway = floors.find(floor => floor.id === DRIVEWAY_FLOOR);

    expect(front?.rooms.map(room => room.id)).toContain('front_porch');
    expect(front?.rooms.map(room => room.id)).toContain('front_play_corner');
    expect(front?.rooms.map(room => room.id)).not.toContain('west_driveway');
    expect(driveway?.rooms.map(room => room.id)).toContain('west_driveway');
    expect(driveway?.rooms.map(room => room.id)).toContain('driveway_garage_mouth');
  });

  it('moves a departing vehicle from west driveway to road exit', () => {
    const state = createState();
    const vehicle = { vehicleId: 'car_1', vehicleKind: 'car', actionId: 'work', partyIds: ['resident'], x: 196, y: 268, parkX: 196, parkY: 268, w: 126, h: 238, phase: 'leaving' };

    expect(beginFrontYardVehicleDeparture(state, vehicle)).toBe(true);
    expect(state.floor).toBe(DRIVEWAY_FLOOR);

    let result = false;
    for (let i = 0; i < 120 && result !== 'complete'; i++) {
      vehicle.t += 0.1;
      result = updateFrontYardVehicleDeparture(state, vehicle, 0.1);
    }

    expect(result).toBe('complete');
  });

  it('moves a returning vehicle from road back to garage handoff through west driveway', () => {
    const state = createState();
    const vehicle = { vehicleId: 'car_1', vehicleKind: 'car', actionId: 'work', partyIds: ['resident'], x: 196, y: 268, parkX: 196, parkY: 268, w: 126, h: 238, phase: 'arriving' };

    expect(beginFrontYardVehicleReturn(state, vehicle)).toBe(true);
    expect(state.floor).toBe(DRIVEWAY_FLOOR);

    let result = false;
    for (let i = 0; i < 160 && result !== 'garage'; i++) {
      vehicle.t += 0.1;
      result = updateFrontYardVehicleReturn(state, vehicle, 0.1);
    }

    expect(result).toBe('garage');
  });
});
