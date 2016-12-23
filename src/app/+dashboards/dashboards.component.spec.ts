/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { DebugElement, ChangeDetectorRef, Component, NO_ERRORS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgRedux } from 'ng2-redux';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { TestBed, ComponentFixture, fakeAsync, inject, tick } from '@angular/core/testing';
import { DashboardsComponent } from './dashboards.component';
import { InstanceActions } from './shared/actions/instance.actions';
import { TrafficActions } from './shared/actions/traffic.actions';
import { InstanceStatusService } from './shared/services/instance-status.service';
import { MDL } from '../shared/directives/mdl-upgrade.directive';
import { ICloudInstance, ICloudInstanceState } from './shared/models/instance.model';
import { ITraffic } from './shared/models/traffic.model';
import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { IconButtonComponent } from '../shared/components/icon-button/icon-button.component';
import { CheckBoxComponent } from '../shared/components/checkbox/checkbox.component';

@Component({
  selector: 'test-component',
  template: ''
})
export class TestComponent {
  @ViewChild('child') child: DashboardsComponent;
}

class NgReduxMock {

  readonly instanceInitialState = {
    instances: [] as ICloudInstance[],
    categories: [] as ICloudInstanceState[],
    isAllSelected: false,
    isAllRunning: false,
    isSomeSelected: false
  };

  readonly trafficInitalState = [];

  public instanceState: Subject<any> = new BehaviorSubject<any>(this.instanceInitialState);
  public trafficState: Subject<ICloudInstance[]> = new BehaviorSubject<ICloudInstance[]>(this.trafficInitalState);

  select(type: string): any {
    switch (type) {
      case 'instances':
        return this.instanceState;
      case 'traffic':
        return this.trafficState;
      default:
        return null;
    }
  }
}

class InstanceActionsMock {
  startAllInstances = () => {};
  stopAllInstances = () => {};
  startInstance = () => {};
  stopInstance = () => {};
  toggleSelectAll = () => {};
  toggleSelect = () => {};
  fetchAll = () => Promise.resolve();
}

class TrafficActionsMock {
  fetchAll() { return Promise.resolve(); }
}

class ChangeDetectorRefMock {
  detechChanges() { }
}

class InstanceStatusServiceMock {
  messages = {
    subscribe: () => {  }
  };
}

describe('Component: Dashboards', () => {

  let _fixture: ComponentFixture<TestComponent> = null;
  let _component: HTMLElement;
  let _createInstanceDialog = null;
  let _deleteInstanceDialog = null;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DashboardsComponent,
        SearchFilterPipe,
        PaginationComponent,
        ButtonComponent,
        IconButtonComponent,
        CheckBoxComponent,
        MDL
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: NgRedux, useClass: NgReduxMock },
        { provide: ChangeDetectorRef, useClass: ChangeDetectorRefMock },
        { provide: InstanceActions, useClass: InstanceActionsMock },
        { provide: TrafficActions, useClass: TrafficActionsMock },
        { provide: InstanceStatusService, useClass: InstanceStatusServiceMock }
      ],
      imports: [
        ReactiveFormsModule
      ]
    }).overrideComponent(TestComponent, {
      set: {
        template: '<cs-dashboard #child></cs-dashboard>'
      }
    });

    inject([NgRedux, InstanceActions], fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActions) => {
      TestBed.compileComponents()
        .then(() => {
          // add mock data
          reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState));
          reduxMock.trafficState.next(Object.assign(reduxMock.trafficInitalState));

          _fixture = TestBed.createComponent(TestComponent);
          _component = _fixture.debugElement.nativeElement;

          _createInstanceDialog = { showModal: jasmine.createSpy('showModal') };
          _deleteInstanceDialog = { showModal: jasmine.createSpy('showModal') };

          _fixture.componentInstance.child.onCreateInstanceInit(_createInstanceDialog);
          _fixture.componentInstance.child.onDeleteInstanceInit(_deleteInstanceDialog);
          _fixture.detectChanges();
        });
    }))();

  });

  it('should render component', () => {
    expect(_fixture).toBeDefined();
    expect(_fixture.componentInstance.child).toBeDefined();
  });

  it('should display instances in list', inject([NgRedux], fakeAsync((reduxMock: NgReduxMock) => {
    reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
      instances: [...createCloudInstances(3)]
    }));

    _fixture.detectChanges();
    const $rows: any = _component.querySelectorAll('tbody tr');

    expectRowsToEqual($rows, [{
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '0.0.0.0',
      privateIP: '0.0.0.0',
      state: 'stopped'
    }, {
      name: 'a1001abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '1.1.1.1',
      privateIP: '1.1.1.1',
      state: 'stopped'
    }, {
      name: 'a1002abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2',
      state: 'stopped'
    }]);

  })));

  it('should display action buttons per list item', inject([NgRedux], fakeAsync((reduxMock: NgReduxMock) => {
    reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
      instances: [...createCloudInstances(3)]
    }));

    _fixture.detectChanges();

    const $rows: any = _component.querySelectorAll('tbody tr');
    $rows.forEach(($element, index) => expect($element.querySelectorAll('cs-icon-button').length).toEqual(4));
  })));

  it('should have searchbar', inject([NgRedux], fakeAsync((reduxMock: NgReduxMock) => {
    _fixture.detectChanges();
    expect(_component.querySelectorAll('#serviceListSearch')).toBeDefined();
  })));

  it('should have pagination', inject([NgRedux], fakeAsync((reduxMock: NgReduxMock) => {
    reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
      instances: [...createCloudInstances(3)]
    }));

    _fixture.detectChanges();

    const $pagination = _component.querySelector('.mdl-pagination') as HTMLElement;
    const $pageNumbers = _component.querySelector('.mdl-pagination__page-number') as HTMLSpanElement;
    const $buttons = $pagination.querySelectorAll('.mdl-pagination__actions button');

    expect($pagination).toBeDefined();
    expect($buttons.length).toEqual(8);
    expect($pageNumbers.innerText).toEqual('0 - 3 of 3');
  })));

  it('should display items in next page', inject([NgRedux], fakeAsync((reduxMock: NgReduxMock) => {
    reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
      instances: [...createCloudInstances(13)]
    }));

    _fixture.detectChanges();
    const $nextButton = _component.querySelector('.mdl-button--next-page') as HTMLButtonElement;
    $nextButton.click();

    tick();
    _fixture.detectChanges();

    const $rows = _component.querySelectorAll('tbody tr');
    expect($rows.length).toEqual(3);
    expectRowsToEqual($rows, [{
      name: 'a1010abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '10.10.10.10',
      privateIP: '10.10.10.10',
      state: 'stopped'
    }, {
      name: 'a1011abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '11.11.11.11',
      privateIP: '11.11.11.11',
      state: 'stopped'
    }, {
      name: 'a1012abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '12.12.12.12',
      privateIP: '12.12.12.12',
      state: 'stopped'
    }]);
  })));

  it('should show create instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {

      const $addInstanceButton = _component.querySelector('#addInstanceButton button') as HTMLButtonElement;
      $addInstanceButton.click();
      _fixture.detectChanges();

      expect(_createInstanceDialog['showModal']).toHaveBeenCalled();
    }))
  );

  it('should show delete instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      let instances = createCloudInstances(3);
      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...createCloudInstances(3)]
      }));

      spyOn(instanceActions, 'toggleSelect').and.callFake(() => {
        instances[0].selected = true;
        reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
          instances: instances,
          isSomeSelected: true
        }));
      });
      _fixture.detectChanges();

      const $checkbox = _component.querySelector('tbody tr .mdl-checkbox') as HTMLElement;
      $checkbox.click();
      _fixture.detectChanges();

      const $deleteInstancesButton = _component.querySelector('#deleteInstancesButton button') as HTMLButtonElement;
      $deleteInstancesButton.click();

      _fixture.detectChanges();
      expect(_deleteInstanceDialog['showModal']).toHaveBeenCalledWith([instances[0]]);
    }))
  );

  it('should emit start all instances on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...createCloudInstances(3)],
        isSomeSelected: true
      }));

      spyOn(instanceActions, 'startAllInstances');
      _fixture.detectChanges();

      const $button = _component.querySelector('#startAllInstancesButton button') as HTMLButtonElement;
      $button.click();

      _fixture.detectChanges();
      expect(instanceActions.startAllInstances).toHaveBeenCalled();
    }))
  );

  it('should emit stop all instances on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...createCloudInstances(3)],
        isSomeSelected: true
      }));

      spyOn(instanceActions, 'stopAllInstances');
      _fixture.detectChanges();

      const $button = _component.querySelector('#stopAllInstancesButton button') as HTMLButtonElement;
      $button.click();

      _fixture.detectChanges();
      expect(instanceActions.stopAllInstances).toHaveBeenCalled();
    }))
  );

  it('should emit start instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      const instance = createCloudInstances(1);
      instance[0].state = 'stopped';

      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...instance],
        isSomeSelected: true
      }));

      spyOn(instanceActions, 'startInstance');
      _fixture.detectChanges();

      const $button = _component.querySelector('.startInstanceButton button') as HTMLButtonElement;
      $button.click();

      _fixture.detectChanges();
      expect(instanceActions.startInstance).toHaveBeenCalledWith(instance[0]);
    }))
  );

  it('should emit delete instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      const instance = createCloudInstances(1);
      instance[0].state = 'running';

      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...instance],
        isSomeSelected: true
      }));

      spyOn(instanceActions, 'stopInstance');
      _fixture.detectChanges();

      const $button = _component.querySelector('.stopInstanceButton button') as HTMLButtonElement;
      $button.click();

      _fixture.detectChanges();
      expect(instanceActions.stopInstance).toHaveBeenCalledWith(instance[0]);
    }))
  );

  it('should emit edit instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      const instance = createCloudInstances(1);
      instance[0].state = 'running';

      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...instance],
        isSomeSelected: true
      }));
      _fixture.detectChanges();

      const $button = _component.querySelector('.editInstanceButton button') as HTMLButtonElement;
      $button.click();
      _fixture.detectChanges();

      expect(_createInstanceDialog['showModal']).toHaveBeenCalledWith(instance[0]);
    }))
  );

  it('should emit delete instance on click', inject([NgRedux, InstanceActions],
    fakeAsync((reduxMock: NgReduxMock, instanceActions: InstanceActionsMock) => {
      const instance = createCloudInstances(1);
      instance[0].state = 'running';

      reduxMock.instanceState.next(Object.assign(reduxMock.instanceInitialState, {
        instances: [...instance],
        isSomeSelected: true
      }));
      _fixture.detectChanges();

      const $button = _component.querySelector('.deleteInstanceButton button') as HTMLButtonElement;
      $button.click();
      _fixture.detectChanges();

      expect(_deleteInstanceDialog['showModal']).toHaveBeenCalledWith(instance[0]);
    }))
  );

});

const createCloudInstances = (count = 0) => {
  const instances = [];
  for (let i = 0; i < count; i++) {
    instances.push({
      name: `a${i + 1000}abcd`,
      type: 't2.medium',
      state: 'stopped',
      region: 'eu-east-1',
      publicIP: `${i}.${i}.${i}.${i}`,
      privateIP: `${i}.${i}.${i}.${i}`,
      traffic: [],
      selected: false
    });
  }
  return instances;
};

const expectRowsToEqual = ($rows, values = []) => {
  $rows.forEach(($element, index) => {
    expect($rows[index].querySelector('.mdl-data-table__cell--name').innerText).toBe(values[index].name);
    expect($rows[index].querySelector('.mdl-data-table__cell--type').innerText).toBe(values[index].type);
    expect($rows[index].querySelector('.mdl-data-table__cell--region').innerText).toBe(values[index].region);
    expect($rows[index].querySelector('.mdl-data-table__cell--public-ip').innerText).toBe(values[index].publicIP);
    expect($rows[index].querySelector('.mdl-data-table__cell--private-ip').innerText).toBe(values[index].privateIP);
    expect($rows[index].querySelector('.dashboard__status-icon')
      .classList
      .contains(`dashboard__status-icon--${ values[index].state }`)).toBeTruthy();
  });
};
