/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { ICloudInstance, ICloudInstanceState } from '../models/instance.model';
import { INSTANCE_ACTIONS } from '../actions/instance.actions';
import { instanceReducer, IInstanceState } from './instance.reducer';

const INITIAL_STATE: IInstanceState = {
  instances: [] as Array<ICloudInstance>,
  categories: [
    { type: 'running', amount: 0, color: '#39FF14' },
    { type: 'starting', amount: 0, color: '#1439FF' },
    { type: 'stopped', amount: 0, color: '#F44336' }
  ] as Array<ICloudInstanceState>,
  isAllSelected: false,
  isAllRunning: false,
  isSomeSelected: false
};

const data = [{
  name: 'a1010abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '10.10.10.10',
  privateIP: '10.10.10.10',
  state: 'stopped',
  selected: false
}, {
  name: 'a1011abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '11.11.11.11',
  privateIP: '11.11.11.11',
  state: 'stopped',
  selected: false
}, {
  name: 'a1012abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '12.12.12.12',
  privateIP: '12.12.12.12',
  state: 'stopped',
  selected: false
}];

describe('Reducer: Instance', () => {

  beforeEach(() => instanceReducer(INITIAL_STATE, { type: 'NONE' }));

  it('should return the initial state', () => {
    expect(
      instanceReducer(INITIAL_STATE, { type: 'NONE' })
    ).toEqual(INITIAL_STATE);
  });

  it('should handle LOAD_ALL action', () => {
    const state = instanceReducer(INITIAL_STATE, {
      type: INSTANCE_ACTIONS.LOAD_ALL,
      payload: data
    });

    assertBothToBeEqual(state.instances, data);
    expect(state.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 3, color: '#F44336' }
    ]);
    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(false);
  });

  it('should handle SELECT action', () => {
    const state = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.SELECT,
      payload: {
        name: 'a1010abcd'
      }
    });

    assertBothToBeEqual(state.instances, data);
    expect(state.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 3, color: '#F44336' }
    ]);

    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(true);
  });

  it('should handle REMOVE action', () => {
    const state = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.REMOVE,
      payload: {
        name: 'a1010abcd'
      }
    });

    assertBothToBeEqual(state.instances, [ data[1], data[2] ]);
    expect(state.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 2, color: '#F44336' }
    ]);

    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(false);
  });

  it('should handle SELECT_ALL and DESELECT action', () => {
    const state1 = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.SELECT_ALL
    });

    const expected1 = data.map((v) => {
      v.selected = true;
      return v;
    });

    assertBothToBeEqual(state1.instances, expected1);
    expect(state1.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 3, color: '#F44336' }
    ]);

    expect(state1.isAllSelected).toEqual(true);
    expect(state1.isAllRunning).toEqual(false);
    expect(state1.isSomeSelected).toEqual(true);

    const state2 = instanceReducer(state1, {
      type: INSTANCE_ACTIONS.DESELECT_ALL
    });

    const expected2 = data.map((v) => {
      v.selected = false;
      return v;
    });

    assertBothToBeEqual(state2.instances, expected2);
    expect(state2.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 3, color: '#F44336' }
    ]);

    expect(state2.isAllSelected).toEqual(false);
    expect(state2.isAllRunning).toEqual(false);
    expect(state2.isSomeSelected).toEqual(false);
  });

  it('should handle ADD action', () => {
    const state = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.ADD,
      payload: {
        name: 'a1010abcd',
        type: 't2.medium',
        region: 'eu-east-1',
        publicIP: '12.12.12.12',
        privateIP: '12.12.12.12',
        state: 'stopped',
        selected: false
      }
    });

    assertBothToBeEqual(state.instances, [...data, {
      name: 'a1010abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '12.12.12.12',
      privateIP: '12.12.12.12',
      state: 'stopped',
      selected: false
    }]);

    expect(state.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 4, color: '#F44336' }
    ]);

    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(false);
  });

  it('should handle UPDATE action', () => {
    const state = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.UPDATE,
      payload: {
        name: 'a1012abcd',
        type: 't2.micro',
        region: 'eu-west-1',
        publicIP: '14.14.14.14',
        privateIP: '14.14.14.14',
        state: 'stopped',
        selected: false
      }
    });

    assertBothToBeEqual(state.instances, [data[0], data[1], {
      name: 'a1012abcd',
      type: 't2.micro',
      region: 'eu-west-1',
      publicIP: '14.14.14.14',
      privateIP: '14.14.14.14',
      state: 'stopped',
      selected: false
    }]);

    expect(state.categories).toEqual([
      { type: 'running', amount: 0, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 3, color: '#F44336' }
    ]);

    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(false);
  });

 it('should handle UPDATE_STATE action', () => {
    const state = instanceReducer(Object.assign(INITIAL_STATE, { instances: data }), {
      type: INSTANCE_ACTIONS.UPDATE,
      payload: {
        name: 'a1012abcd',
        state: 'running'
      }
    });

    assertBothToBeEqual(state.instances, [data[0], data[1], {
      name: 'a1012abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '12.12.12.12',
      privateIP: '12.12.12.12',
      state: 'running',
      selected: false
    }]);

    expect(state.categories).toEqual([
      { type: 'running', amount: 1, color: '#39FF14' },
      { type: 'starting', amount: 0, color: '#1439FF' },
      { type: 'stopped', amount: 2, color: '#F44336' }
    ]);

    expect(state.isAllSelected).toEqual(false);
    expect(state.isAllRunning).toEqual(false);
    expect(state.isSomeSelected).toEqual(false);
  });

});

const assertBothToBeEqual = (instance1, instance2) => instance1.forEach((value, index) => {
  expect(value.name).toBe(instance2[index].name);
  expect(value.type).toBe(instance2[index].type);
  expect(value.region).toBe(instance2[index].region);
  expect(value.publicIP).toBe(instance2[index].publicIP);
  expect(value.privateIP).toBe(instance2[index].privateIP);
  expect(value.state).toBe(instance2[index].state);
});
