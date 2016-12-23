import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { NgRedux } from 'ng2-redux';
import { UPDATE_STATE } from '../actions/instance.actions';
import { WebSocketService } from './websocket.service';

const STATUS_URL = 'ws://localhost:3000/api/ws/instances';

export interface StatusMessage {
  name: string;
  state: string;
}

@Injectable()
export class InstanceStatusService {
  public messages: Subject<StatusMessage>;

  constructor(
    private ngRedux: NgRedux<any>,
    private webSocketService: WebSocketService
  ) {
    this.messages = <Subject<StatusMessage>>webSocketService
      .connect(STATUS_URL)
      .map((response: MessageEvent): StatusMessage => {
        const instance = JSON.parse(response.data);
        this.ngRedux.dispatch(UPDATE_STATE(instance));
        return instance;
      });
  }
}
