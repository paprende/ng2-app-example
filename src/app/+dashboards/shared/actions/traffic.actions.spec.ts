/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgRedux } from 'ng2-redux';
import { Injectable } from '@angular/core';
import { TrafficHttp } from '../http/traffic.http';
import { ITraffic } from '../models/traffic.model';
import { IAppState } from '../../../app.store';
import { TrafficActions, TRAFFIC_ACTIONS } from './traffic.actions';
import { rootReducer } from '../../../app.store';

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

@Injectable()
class TrafficHttpMock {
  fetchAll() { return new Promise<any>(resolve => resolve(data)); }
}

describe('Actions: Traffic', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TrafficActions,
          useFactory: (ngRedux: NgRedux<IAppState>, trafficHttp: TrafficHttp) => {
            return new TrafficActions(ngRedux, trafficHttp);
          },
          deps: [NgRedux, TrafficHttp]
        },
        { provide: TrafficHttp, useClass: TrafficHttpMock },
        { provide: NgRedux, useClass: NgRedux }
      ]
    });

    inject([NgRedux], (ngRedux: NgRedux<IAppState>) => {
      ngRedux.configureStore(rootReducer, Object.assign({}), [], []);
    })();

  });

  it('should be injectable', inject([TrafficActions], (actions) => {
    expect(actions).toBeTruthy();
  }));

  it('should get traffic and add update store', inject([TrafficActions, NgRedux],
    fakeAsync((actions: TrafficActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();
      tick();

      ngRedux.select('traffic').subscribe((instances: ITraffic[]) => {
        state = instances;
      });

      tick();
      assertBothToBeEqual(state, data);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: TRAFFIC_ACTIONS.LOAD_ALL,
        payload: data
      });
    }))
  );

});

const assertBothToBeEqual = (instance1, instance2) => instance1.forEach((value, index) => {
  expect(value.type).toBe(instance2[index].type);
  expect(value.date).toBe(instance2[index].date);
  expect(value.value).toBe(instance2[index].value);
});
