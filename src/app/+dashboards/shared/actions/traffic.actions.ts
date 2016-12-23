import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { TrafficHttp } from '../http/traffic.http';

export const TRAFFIC_ACTIONS = {
  LOAD_ALL: 'TRAFFIC_LOAD_ALL',
};

const LOAD_ALL_ACTION = (data) => ({
  type: TRAFFIC_ACTIONS.LOAD_ALL,
  payload: data
});

@Injectable()
export class TrafficActions {

  constructor(
    private ngRedux: NgRedux<any>,
    private http: TrafficHttp,
  ) { }

  fetchAll() {
    return this.http.fetchAll()
      .then((data) => {
        return Promise.resolve(this.ngRedux.dispatch(LOAD_ALL_ACTION(data)));
      });
  }

}
