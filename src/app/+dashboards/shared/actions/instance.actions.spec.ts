/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgRedux } from 'ng2-redux';
import { Injectable } from '@angular/core';
import { InstanceHttp } from '../http/instance.http';
import { ICloudInstance } from '../models/instance.model';
import { IAppState } from '../../../app.store';
import { InstanceActions, INSTANCE_ACTIONS } from './instance.actions';
import { rootReducer } from '../../../app.store';

let data = null;

const newInstance = {
  name: 'a1013abcd',
  type: 't2.medium',
  region: 'eu-east-1',
  publicIP: '12.12.12.12',
  privateIP: '12.12.12.12',
  state: 'stopped',
  selected: true
};

const updateInstance = {
  name: 'a1010abcd',
  type: 't2.large',
  region: 'eu-east-2',
  publicIP: '13.12.12.12',
  privateIP: '13.12.12.12',
  state: 'running',
  selected: true
};

@Injectable()
class InstanceHttpMock {
  fetchAll() { return new Promise<any>(resolve => resolve(data)); }
  create() { return new Promise<any>(resolve => resolve(newInstance)); }
  update() { return new Promise<any>(resolve => resolve()); }
  remove() { return new Promise<any>(resolve => resolve()); }
  updateState() { return new Promise<any>(resolve => resolve()); }
}

describe('Actions: Instance', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: InstanceActions,
          useFactory: (ngRedux: NgRedux<IAppState>, instanceHttp: InstanceHttp) => {
            return new InstanceActions(ngRedux, instanceHttp);
          },
          deps: [NgRedux, InstanceHttp]
        },
        { provide: InstanceHttp, useClass: InstanceHttpMock },
        { provide: NgRedux, useClass: NgRedux }
      ]
    });

    inject([NgRedux], (ngRedux: NgRedux<IAppState>) => {
      ngRedux.configureStore(rootReducer, Object.assign({}), [], []);
    })();

    data = [{
      name: 'a1010abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '10.10.10.10',
      privateIP: '10.10.10.10',
      state: 'stopped',
      selected: true
    }, {
      name: 'a1011abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '11.11.11.11',
      privateIP: '11.11.11.11',
      state: 'stopped',
      selected: true
    }, {
      name: 'a1012abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '12.12.12.12',
      privateIP: '12.12.12.12',
      state: 'stopped',
      selected: true
    }];

  });

  it('should be injectable', inject([InstanceActions], (actions) => {
    expect(actions).toBeTruthy();
  }));

  it('should get instances and add update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();
      tick();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      assertBothToBeEqual(state.instances, data);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.LOAD_ALL,
        payload: data
      });
    }))
  );

  it('should create instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.createInstance(newInstance as ICloudInstance);

      tick();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      assertBothToBeEqual(state.instances, [newInstance, ...data]);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.ADD,
        payload: newInstance
      });
    }))
  );

  it('should update instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.updateInstance(updateInstance as ICloudInstance);
      tick();

      assertBothToBeEqual(state.instances, [updateInstance, data[1], data[2]]);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.UPDATE,
        payload: updateInstance
      });
    }))
  );

  it('should delete instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.removeInstance(updateInstance as ICloudInstance);
      tick();

      assertBothToBeEqual(state.instances, [data[1], data[2]]);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.REMOVE,
        payload: updateInstance
      });
    }))
  );

  it('should start instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.startInstance(updateInstance as ICloudInstance);
      tick();

      expect(state.instances[0].state).toEqual('starting');
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.UPDATE_STATE,
        payload: [updateInstance]
      });
    }))
  );

  it('should stop instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.stopInstance(updateInstance as ICloudInstance);
      tick();

      expect(state.instances[0].state).toEqual('stopped');
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.UPDATE_STATE,
        payload: [updateInstance]
      });
    }))
  );

  it('should start all instances and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.startAllInstances();
      tick();

      expect(state.instances[0].state).toEqual('starting');
      expect(state.instances[1].state).toEqual('starting');
      expect(state.instances[2].state).toEqual('starting');
    }))
  );

  it('should stop all instances and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      actions.stopAllInstances();
      tick();

      expect(state.instances[0].state).toEqual('stopped');
      expect(state.instances[1].state).toEqual('stopped');
      expect(state.instances[2].state).toEqual('stopped');
    }))
  );

  it('should toggle instance and update store', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();
      tick();

      actions.toggleSelect(updateInstance as ICloudInstance);
      tick();

      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      tick();
      expect(state.instances[0].selected).toEqual(false);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.SELECT,
        payload: updateInstance
      });
    }))
  );

  it('should deselect all and then select all', inject([InstanceActions, NgRedux],
    fakeAsync((actions: InstanceActions, ngRedux: NgRedux<IAppState>) => {
      let state: any;
      ngRedux.select('instances').subscribe((instances: ICloudInstance[]) => {
        state = instances;
      });

      spyOn(ngRedux, 'dispatch').and.callThrough();
      actions.fetchAll();
      tick();
      actions.deselectAll();
      tick();

      tick();
      expect(state.instances[0].selected).toEqual(false);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.DESELECT_ALL
      });

      actions.selectAll();
      tick();

      tick();
      expect(state.instances[0].selected).toEqual(true);
      expect(ngRedux.dispatch).toHaveBeenCalledWith({
        type: INSTANCE_ACTIONS.SELECT_ALL
      });
    }))
  );

});

const assertBothToBeEqual = (instance1, instance2) => instance1.forEach((value, index) => {
  expect(value.name).toBe(instance2[index].name);
  expect(value.type).toBe(instance2[index].type);
  expect(value.region).toBe(instance2[index].region);
  expect(value.publicIP).toBe(instance2[index].publicIP);
  expect(value.privateIP).toBe(instance2[index].privateIP);
  expect(value.state).toBe(instance2[index].state);
});
