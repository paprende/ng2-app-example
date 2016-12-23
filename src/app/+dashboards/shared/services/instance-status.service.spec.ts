/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgRedux } from 'ng2-redux';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs/Rx';

import { InstanceStatusService } from './instance-status.service';
import { WebSocketService } from './websocket.service';
import { ICloudInstance } from '../models/instance.model';
import { INSTANCE_ACTIONS } from '../actions/instance.actions';
import { IAppState } from '../../../app.store';
import { rootReducer } from '../../../app.store';

const data: any = [{
  name: 'a1010abcd',
  state: 'stopped'
}, {
  name: 'a1011abcd',
  state: 'starting'
}, {
  name: 'a1012abcd',
  state: 'running'
}];

@Injectable()
class WebSocketServiceMock {
  public message: Subject<any> = new BehaviorSubject<any>({ data: '[]' });
  connect() {
    return this.message.asObservable();
  }
}

describe('Service: Instance Status', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: InstanceStatusService,
          useFactory: (ngRedux: NgRedux<IAppState>, webSocketService: WebSocketService) => {
            return new InstanceStatusService(ngRedux, webSocketService);
          },
          deps: [NgRedux, WebSocketService]
        },
        { provide: WebSocketService, useClass: WebSocketServiceMock },
        { provide: NgRedux, useClass: NgRedux }
      ]
    });

    inject([NgRedux], (ngRedux: NgRedux<IAppState>) => {
      ngRedux.configureStore(rootReducer, Object.assign({}), [], []);
    })();

  });

  it('should be injectable', inject([InstanceStatusService, NgRedux], (service, reduxMock) => {
    expect(service).toBeTruthy();
  }));

  it('should get next message and dispatch action',
    inject([InstanceStatusService, WebSocketService, NgRedux], (service, wb: WebSocketServiceMock, reduxMock) => {
      spyOn(reduxMock, 'dispatch');

      wb.message.next({ data: JSON.stringify(data) });
      service.messages.subscribe(() => {});
      expect(reduxMock.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.UPDATE_STATE,
        payload: data
      });
    })
  );

});
