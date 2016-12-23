import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { tick, fakeAsync } from '@angular/core/testing';

import { ICloudInstance } from '../models/instance.model';
import { InstanceHttp, FETCH_ALL_URL, GET_URL, STATUS_URL } from './instance.http';

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

describe('Http: Instance', () => {

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
        { provide: InstanceHttp, useClass: InstanceHttp },
        { provide: MockBackend, useClass: MockBackend },
        { provide: BaseRequestOptions, useClass: BaseRequestOptions },
      ]
    });

  });

  it('should be injectable', inject([InstanceHttp], (actions) => {
    expect(actions).toBeTruthy();
  }));

  it('should get instances', inject([InstanceHttp, MockBackend],
    fakeAsync((actions: InstanceHttp, mockBackend: MockBackend) => {

      let instances: Array<ICloudInstance>;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(FETCH_ALL_URL);
        let response = new ResponseOptions({ body: JSON.stringify(data) });
        c.mockRespond(new Response(response));
      });

      actions.fetchAll().then((d: any) => instances = d);

      tick();
      expect(instances).toEqual(data);
    }))
  );

  it('should create instance', inject([InstanceHttp, MockBackend],
    fakeAsync((actions: InstanceHttp, mockBackend: MockBackend) => {

      let instance = {
        name: 'a1010abcd',
        type: 't2.medium',
        region: 'eu-east-1',
        publicIP: '10.10.10.10',
        privateIP: '10.10.10.10',
        state: 'stopped',
        selected: false
      } as ICloudInstance;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(GET_URL(instance));
        expect(c.request._body).toBe(instance);
        let response = new ResponseOptions({ status: 200 });
        c.mockRespond(new Response(response));
      });

      actions.create(instance);
    }))
  );

  it('should update instance', inject([InstanceHttp, MockBackend],
    fakeAsync((actions: InstanceHttp, mockBackend: MockBackend) => {

      let instance = {
        name: 'a1010abcd',
        type: 't2.medium',
        region: 'eu-east-1',
        publicIP: '10.10.10.10',
        privateIP: '10.10.10.10',
        state: 'stopped',
        selected: false
      } as ICloudInstance;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(GET_URL(instance));
        expect(c.request._body).toBe(instance);
        let response = new ResponseOptions({ status: 200 });
        c.mockRespond(new Response(response));
      });

      actions.update(instance);
    }))
  );

  it('should remove instance', inject([InstanceHttp, MockBackend],
    fakeAsync((actions: InstanceHttp, mockBackend: MockBackend) => {

      let instance = {
        name: 'a1010abcd',
        type: 't2.medium',
        region: 'eu-east-1',
        publicIP: '10.10.10.10',
        privateIP: '10.10.10.10',
        state: 'stopped',
        selected: false
      } as ICloudInstance;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(GET_URL(instance));
        let response = new ResponseOptions({ status: 200 });
        c.mockRespond(new Response(response));
      });

      actions.remove(instance);
    }))
  );

  it('should update state', inject([InstanceHttp, MockBackend],
    fakeAsync((actions: InstanceHttp, mockBackend: MockBackend) => {

      let instance = {
        name: 'a1010abcd',
        type: 't2.medium',
        region: 'eu-east-1',
        publicIP: '10.10.10.10',
        privateIP: '10.10.10.10',
        state: 'stopped',
        selected: false
      } as ICloudInstance;

      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe(STATUS_URL(instance));
        expect(c.request._body).toBe(true);
        let response = new ResponseOptions({ status: 200 });
        c.mockRespond(new Response(response));
      });

      actions.updateState(instance, true);
    }))
  );

});
