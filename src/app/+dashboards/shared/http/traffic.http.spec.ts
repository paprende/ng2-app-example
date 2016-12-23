import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { tick, fakeAsync } from '@angular/core/testing';

import { ITraffic } from '../models/traffic.model';
import { TrafficHttp, URL } from './traffic.http';

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

describe('Http: Traffic', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: TrafficHttp, useClass: TrafficHttp },
        { provide: MockBackend, useClass: MockBackend },
        { provide: BaseRequestOptions, useClass: BaseRequestOptions },
      ]
    });

  });

  it('should be injectable', inject([TrafficHttp], (actions) => {
    expect(actions).toBeTruthy();
  }));

  it('should get traffic', inject([TrafficHttp, MockBackend],
    fakeAsync((actions: TrafficHttp, mockBackend: MockBackend) => {

      let traffic: Array<ITraffic>;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(URL);
        let response = new ResponseOptions({ body: JSON.stringify(data) });
        c.mockRespond(new Response(response));
      });

      actions.fetchAll().then((d: any) => traffic = d);

      tick();
      expect(traffic).toEqual(data);
    }))
  );

});
