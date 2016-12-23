/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { ITraffic } from '../models/traffic.model';
import { TRAFFIC_ACTIONS } from '../actions/traffic.actions';
import { trafficReducer } from './traffic.reducer';

const INITIAL_STATE: Array<ITraffic> = [];
const data = [
  { type: 'TEST', date: '2016-01-01', value: '0' },
  { type: 'TEST', date: '2016-01-02', value: '0' },
  { type: 'TEST', date: '2016-01-03', value: '0' },
  { type: 'TEST', date: '2016-01-04', value: '0' },
  { type: 'TEST', date: '2016-01-05', value: '0' },
  { type: 'TEST', date: '2016-01-06', value: '0' },
  { type: 'TEST', date: '2016-01-07', value: '0' },
  { type: 'TEST', date: '2016-01-08', value: '0' },
  { type: 'TEST', date: '2016-01-09', value: '0' },
  { type: 'TEST', date: '2016-01-10', value: '0' },
  { type: 'TEST', date: '2016-01-11', value: '0' },
  { type: 'TEST', date: '2016-01-12', value: '0' },
  { type: 'TEST', date: '2016-01-13', value: '0' },
  { type: 'TEST', date: '2016-01-14', value: '0' }
];

describe('Reducer: Traffic', () => {

  beforeEach(() => trafficReducer(INITIAL_STATE, { type: 'NONE' }));

  it('should return the initial state', () => {
    expect(
      trafficReducer(INITIAL_STATE, { type: 'NONE' })
    ).toEqual(INITIAL_STATE);
  });

  it('should handle LOAD_ALL action', () => {
    const state = trafficReducer(INITIAL_STATE, {
      type: TRAFFIC_ACTIONS.LOAD_ALL,
      payload: data
    });

    assertBothToBeEqual(state, data);
  });

});

const assertBothToBeEqual = (instance1, instance2) => instance1.forEach((value, index) => {
  expect(value.type).toBe(instance2[index].type);
  expect(value.date).toBe(instance2[index].date);
  expect(value.value).toBe(instance2[index].value);
});
