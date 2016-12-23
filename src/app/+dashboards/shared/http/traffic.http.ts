import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

export const URL = 'http://localhost:3000/api/traffic';

@Injectable()
export class TrafficHttp {

  constructor(private http: Http) { }

  fetchAll() {
    return this.http
      .get(URL)
      .map<any>((res) => res.json())
      .toPromise();
  }

}
