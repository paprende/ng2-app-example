/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { DebugElement, ChangeDetectorRef, Component, NO_ERRORS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture, fakeAsync, inject, tick } from '@angular/core/testing';

import { DeleteInstanceDialogComponent } from './delete-instance-dialog.component';
import { ModalDialogComponent, DialogCommands } from '../../shared/components/modal-dialog/modal-dialog.component';
import { InstanceActions } from '../shared/actions/instance.actions';
import { ICloudInstance, ICloudInstanceState } from '../shared/models/instance.model';
import { MDL } from '../../shared/directives/mdl-upgrade.directive';

@Component({
  selector: 'test-component',
  template: '<cs-delete-instance-dialog #child (onInit)="onDialogInit($event)"></cs-delete-instance-dialog>'
})
export class TestComponent {
  @ViewChild('child') child: DeleteInstanceDialogComponent;
  dialogActions: DialogCommands;

  onDialogInit(dialogActions: DialogCommands) {
    this.dialogActions = dialogActions;
  }
}

class InstanceActionsMock {
  removeInstance = () => {};
}

describe('Component: Delete Instance Dialog', () => {

  let _fixture: ComponentFixture<TestComponent> = null;
  let _component: HTMLElement;
  let _element: HTMLElement;
  let _child: DeleteInstanceDialogComponent;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        ModalDialogComponent,
        DeleteInstanceDialogComponent,
        MDL
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: InstanceActions, useClass: InstanceActionsMock }
      ],
      imports: [
        ReactiveFormsModule
      ]
    });

    inject([InstanceActions], fakeAsync((instanceActions: InstanceActions) => {
      TestBed.compileComponents()
        .then(() => {
          _fixture = TestBed.createComponent(TestComponent);
          _component = _fixture.debugElement.nativeElement;
          _child = _fixture.componentInstance.child;
          _fixture.detectChanges();
        });
    }))();

  });

  it('should render component', () => {
    expect(_fixture).toBeDefined();
    expect(_fixture.componentInstance.child).toBeDefined();
  });

  it('should show dialog', () => {
    _fixture.componentInstance.dialogActions.showModal();
    _fixture.detectChanges();
    expect(_component.querySelector('dialog').attributes.getNamedItem('open')).not.toBeNull();
  });

  it('should show dialog with singular message', () => {
    _fixture.componentInstance.dialogActions.showModal([{
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2'
    }]);

    _fixture.detectChanges();

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    expect($title.innerText).toEqual('Delete Instance?');
  });

  it('should show dialog with singular message', () => {
    _fixture.componentInstance.dialogActions.showModal([{
      name: 'a1000abcd'
    }, {
      name: 'a1001abcd'
    }]);

    _fixture.detectChanges();

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    expect($title.innerText).toEqual('Delete 2 Instances?');
  });

  it('should submit dialog and emit remove action', inject([InstanceActions], (instanceActions: InstanceActions) => {
    spyOn(instanceActions, 'removeInstance');

    _fixture.componentInstance.dialogActions.showModal([{
      name: 'a1000abcd'
    }, {
      name: 'a1001abcd'
    }]);

    _fixture.detectChanges();

    const $submit = _component.querySelector('#submit') as HTMLButtonElement;
    $submit.click();

    expect(instanceActions.removeInstance).toHaveBeenCalledTimes(2);
  }));

});
