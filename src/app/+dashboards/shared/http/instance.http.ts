import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ICloudInstance } from '../models/instance.model';

import 'rxjs/add/operator/map';

export const FETCH_ALL_URL = `http://localhost:3000/api/instances`;
export const GET_URL = (instance: ICloudInstance) => `${ FETCH_ALL_URL }/${ instance.name }`;
export const STATUS_URL = (instance: ICloudInstance) => `${ FETCH_ALL_URL }/${ instance.name }/status`;

@Injectable()
export class InstanceHttp {

  constructor(private http: Http) { }

  fetchAll() {
    return this.http
      .get(FETCH_ALL_URL)
      .map<any>((res) => res.json())
      .toPromise();
  }

  create(instance: ICloudInstance) {
    return this.http
      .post(GET_URL(instance), instance)
      .map<any>((res) => res.json())
      .toPromise();
  }

  update(instance: ICloudInstance) {
    return this.http
      .put(GET_URL(instance), instance)
      .toPromise();
  }

  remove(instance: ICloudInstance) {
    return this.http
      .delete(GET_URL(instance))
      .toPromise();
  }

  updateState(instance: ICloudInstance, state: any) {
    return this.http
      .post(STATUS_URL(instance), state)
      .toPromise();
  }

}
