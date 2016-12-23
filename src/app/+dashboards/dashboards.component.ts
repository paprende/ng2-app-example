import {
  Component,
  HostBinding,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

import {
  FormGroup,
  FormBuilder
} from '@angular/forms';

import { NgRedux } from 'ng2-redux';
import { IAppState } from '../app.store';
import { ICloudInstance } from './shared/models/instance.model';

import { InstanceActions } from './shared/actions/instance.actions';
import { TrafficActions } from './shared/actions/traffic.actions';

import { InstanceStatusService } from './shared/services/instance-status.service';

@Component({
  selector: 'cs-dashboard',
  animations: [
    trigger('fadeIn', [
      state('*', style({transform: 'translate3d(0, 0, 0)', opacity: 1})),
      transition('void => *', [
        animate('.3s ease-in-out', keyframes([
          style({opacity: 0, transform: 'translate3d(-20px, 0, 0)', offset: 0}),
          style({opacity: 1, transform: 'translate3d(0, 0, 0)',  offset: 1}),
        ]))
      ])
    ])
  ],
  styleUrls: ['dashboards.component.scss'],
  templateUrl: 'dashboards.component.html'
})
export class DashboardsComponent {

  @HostBinding('@fadeIn') get animate() { return true; };

  public $state = {
    instances: [] as Array<ICloudInstance>,
    categories: [],
    traffic: [],
    isAllSelected: false,
    isAllRunning: false,
    isSomeSelected: false
  };

  public page: Array<ICloudInstance> = [];
  public form: FormGroup;

  public filterArgs = {
    filter: ''
  };

  private deleteInstanceDialogRef: any = null;
  private createInstanceDialogRef: any = null;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private instanceActions: InstanceActions,
    private trafficActions: TrafficActions,
    private status: InstanceStatusService,
    private fb: FormBuilder
) {

    Promise.all([
      this.instanceActions.fetchAll(),
      this.trafficActions.fetchAll()
    ])
      .then(() => {
        this.ngRedux.select('instances')
          .subscribe((state: any) => {
            this.$state.instances = state.instances;
            this.$state.categories = state.categories;
            this.$state.isAllSelected = state.isAllSelected;
            this.$state.isAllRunning = state.isAllRunning;
            this.$state.isSomeSelected = state.isSomeSelected;
          });
        this.ngRedux.select('traffic')
          .subscribe((state: any) => this.$state.traffic = state);
      });

    this.status.messages.subscribe(() => {});

    this.form = fb.group({
      'search': ['']
    });

    this.form.controls['search']
      .valueChanges
      .debounceTime(500)
      .subscribe((value) => {
        this.filterArgs = {
          filter: value
        };
      });
  }

  public getStateClass(state) {
    const prefix = `dashboard__status-icon`;
    switch (state) {
      case 'stopped':
        return `${prefix}--stopped`;
      case 'starting':
        return `${prefix}--starting`;
      case 'running':
        return `${prefix}--running`;
    }
  }

  // events
  public onCreateInstanceInit($event: any) {
    this.createInstanceDialogRef = $event;
  }

  public onDeleteInstanceInit($event: any) {
    this.deleteInstanceDialogRef = $event;
  }

  public onShowDeleteMultipleInstances() {
    this.deleteInstanceDialogRef.showModal(
      this.$state.instances.filter((i) => i.selected === true)
    );
  }

  public onShowCreateInstance(instance) {
    this.createInstanceDialogRef.showModal(instance);
  }

  public onShowDeleteInstance(instance) {
    this.deleteInstanceDialogRef.showModal(instance);
  }

  public onStartAllInstances() {
    this.instanceActions.startAllInstances();
  }

  public onStopAllInstances() {
    this.instanceActions.stopAllInstances();
  }

  public onPageChanged($event) {
    this.page = $event.pageItems;
  }

  public onToggleSelectAll() {
    this.instanceActions.toggleSelectAll();
  }

  public onToggleSelect(instance) {
    this.instanceActions.toggleSelect(instance);
  }


}
