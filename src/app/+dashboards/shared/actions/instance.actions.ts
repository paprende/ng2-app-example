import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { InstanceHttp } from '../http/instance.http';
import { ICloudInstance } from '../models/instance.model';
import { IAppState } from '../../../app.store';

export const INSTANCE_ACTIONS = {
  ADD: 'INSTANCES_ADD',
  LOAD_ALL: 'INSTANCES_LOAD_ALL',
  REMOVE: 'INSTANCES_REMOVE',
  UPDATE: 'INSTANCES_UPDATE',
  UPDATE_STATE: 'INSTANCES_UPDATE_STATE',
  SELECT: 'INSTANCES_SELECT',
  SELECT_ALL: 'INSTANCES_SELECT_ALL',
  DESELECT_ALL: 'INSTANCES_DESELECT_ALL'
};

export const LOAD_ALL = (instances) => ({
  type: INSTANCE_ACTIONS.LOAD_ALL,
  payload: instances
});

export const ADD = (instances) => ({
  type: INSTANCE_ACTIONS.ADD,
  payload: instances
});

export const UPDATE = (instances) => ({
  type: INSTANCE_ACTIONS.UPDATE,
  payload: instances
});

export const UPDATE_STATE = (instances) => ({
  type: INSTANCE_ACTIONS.UPDATE_STATE,
  payload: instances
});

export const REMOVE = (instances) => ({
  type: INSTANCE_ACTIONS.REMOVE,
  payload: instances
});

export const SELECT = (instance) => ({
  type: INSTANCE_ACTIONS.SELECT,
  payload: instance
});

export const SELECT_ALL = () => ({
  type: INSTANCE_ACTIONS.SELECT_ALL
});

export const DESELECT_ALL = () => ({
  type: INSTANCE_ACTIONS.DESELECT_ALL
});

@Injectable()
export class InstanceActions {

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private http: InstanceHttp,
  ) { }

  fetchAll() {
    return this.http
      .fetchAll()
      .then((data) => {
        return Promise.resolve(this.ngRedux.dispatch(LOAD_ALL(data)));
      });
  }

  createInstance(instance: ICloudInstance) {
    return this.http
      .create(instance)
      .then((instance: ICloudInstance) => {
        this.ngRedux.dispatch(ADD(instance));
      });
  }

  updateInstance(instance: ICloudInstance) {
    return this.http
      .update(instance)
      .then(() => {
        this.ngRedux.dispatch(UPDATE(instance));
      });
  }

  removeInstance(instance: ICloudInstance) {
    return this.http
      .remove(instance)
      .then(() => {
        this.ngRedux.dispatch(REMOVE(instance));
      });
  }

  startInstance(instance: ICloudInstance) {
    return this.http
      .updateState(instance, {
        state: 'starting'
      }).then(() => {
        instance.state = 'starting';
        this.ngRedux.dispatch(UPDATE_STATE([ instance ]));
      });
  }

  stopInstance(instance: ICloudInstance) {
    return this.http
      .updateState(instance, {
        state: 'stopped'
      }).then(() => {
        instance.state = 'stopped';
        this.ngRedux.dispatch(UPDATE_STATE([ instance ]));
      });
  }

  startAllInstances() {
    this.ngRedux
      .getState().instances.instances
      .filter((i) => i.selected)
      .forEach(i => this.startInstance(i));
  }

  stopAllInstances() {
    this.ngRedux
      .getState().instances.instances
      .filter((i) => i.selected)
      .forEach(i => this.stopInstance(i));
  }

  toggleSelect(instance: ICloudInstance) {
    this.ngRedux.dispatch(SELECT(instance));
  }

  selectAll() {
    this.ngRedux.dispatch(SELECT_ALL());
  }

  deselectAll() {
    this.ngRedux.dispatch(DESELECT_ALL());
  }

  toggleSelectAll() {
    if (this.ngRedux.getState().instances.isAllSelected) {
      this.ngRedux.dispatch(DESELECT_ALL());
    } else {
      this.ngRedux.dispatch(SELECT_ALL());
    }
  }

}
