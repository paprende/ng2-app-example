/* tslint:disable:no-unused-variable */
/* tslint:disable:no-use-before-declare */

import { DebugElement, ChangeDetectorRef, Component, NO_ERRORS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture, fakeAsync, inject, tick } from '@angular/core/testing';

import { CreateInstanceDialogComponent } from './create-instance-dialog.component';
import { ModalDialogComponent, DialogCommands } from '../../shared/components/modal-dialog/modal-dialog.component';
import { InstanceActions } from '../shared/actions/instance.actions';
import { ICloudInstance, ICloudInstanceState } from '../shared/models/instance.model';
import { MDL } from '../../shared/directives/mdl-upgrade.directive';

@Component({
  selector: 'test-component',
  template: '<cs-create-instance-dialog #child (onInit)="onDialogInit($event)"></cs-create-instance-dialog>'
})
export class TestComponent {
  @ViewChild('child') child: CreateInstanceDialogComponent;
  dialogActions: DialogCommands;

  onDialogInit(dialogActions: DialogCommands) {
    this.dialogActions = dialogActions;
  }
}

class InstanceActionsMock {
  startAllInstances = () => {};
  stopAllInstances = () => {};
  startInstance = () => {};
  stopInstance = () => {};
  toggleSelectAll = () => {};
  toggleSelect = () => {};
  updateInstance = () => {};
  createInstance = () => {};
}

describe('Component: Create Instance Dialog', () => {

  let _fixture: ComponentFixture<TestComponent> = null;
  let _component: HTMLElement;
  let _element: HTMLElement;
  let _child: CreateInstanceDialogComponent;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        ModalDialogComponent,
        CreateInstanceDialogComponent,
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

  it('should have options values in selects', () => {
    const $typeSelectField = _component.querySelector('#typeSelectField') as HTMLSelectElement;
    const $typeOptions: any = $typeSelectField.querySelectorAll('option');
    $typeOptions.forEach(($element, index) => {
      expect($element.value).toEqual([
        { caption: '', value: '' },
        { caption: 't2.nano', value: 't2.nano' },
        { caption: 't2.nano', value: 't2.nano' },
        { caption: 't2.micro', value: 't2.micro' },
        { caption: 't2.small', value: 't2.small' },
        { caption: 't2.medium', value: 't2.medium' },
        { caption: 't2.large', value: 't2.large' }
      ][index].value);
    });

    const $regionSelectField = _component.querySelector('#regionSelectField') as HTMLSelectElement;
    const $regionOptions: any = $regionSelectField.querySelectorAll('option');
    $regionOptions.forEach(($element, index) => {
      expect($element.value).toEqual([
        { caption: '', value: '' },
        { caption: 'us-east-1', value: 'us-east-1' },
        { caption: 'us-west-2', value: 'us-west-2' },
        { caption: 'us-west-1', value: 'us-west-1' },
        { caption: 'eu-west-1', value: 'eu-west-1' },
        { caption: 'eu-east-1', value: 'eu-east-1' }
      ][index].value);
    });
  });

  it('should show dialog is default values', () => {
    _fixture.componentInstance.dialogActions.showModal();
    _fixture.detectChanges();

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    const $nameTextField = _component.querySelector('#nameTextField') as HTMLInputElement;
    const $typeSelectField = _component.querySelector('#typeSelectField') as HTMLSelectElement;
    const $regionSelectField = _component.querySelector('#regionSelectField') as HTMLSelectElement;
    const $textFieldPublicIP = _component.querySelector('#textFieldPublicIP') as HTMLInputElement;
    const $textFieldPrivateIP = _component.querySelector('#textFieldPrivateIP') as HTMLInputElement;

    expect($title.innerText).toEqual('Create Instance');
    expect($nameTextField.value).toEqual('');
    expect($typeSelectField.value).toEqual('');
    expect($regionSelectField.value).toEqual('');
    expect($textFieldPublicIP.value).toEqual('');
    expect($textFieldPrivateIP.value).toEqual('');
  });

  it('should show dialog is default values', () => {
    _fixture.componentInstance.dialogActions.showModal({
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2'
    } as ICloudInstance);
    _fixture.detectChanges();

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    const $nameTextField = _component.querySelector('#nameTextField') as HTMLInputElement;
    const $typeSelectField = _component.querySelector('#typeSelectField') as HTMLSelectElement;
    const $regionSelectField = _component.querySelector('#regionSelectField') as HTMLSelectElement;
    const $textFieldPublicIP = _component.querySelector('#textFieldPublicIP') as HTMLInputElement;
    const $textFieldPrivateIP = _component.querySelector('#textFieldPrivateIP') as HTMLInputElement;

    expect($title.innerText).toEqual('Modify Instance');
    expect($nameTextField.value).toEqual('a1000abcd');
    expect($typeSelectField.value).toEqual('t2.medium');
    expect($regionSelectField.value).toEqual('eu-east-1');
    expect($textFieldPublicIP.value).toEqual('2.2.2.2');
    expect($textFieldPrivateIP.value).toEqual('2.2.2.2');
  });

  it('should update with instance', inject([InstanceActions], (instanceActions: InstanceActions) => {
    const instance = {
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2'
    };

    _fixture.componentInstance.dialogActions.showModal({
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2'
    } as ICloudInstance);
    _fixture.detectChanges();

    spyOn(instanceActions, 'updateInstance').and.callFake(() => Promise.resolve());

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    const $nameTextField = _component.querySelector('#nameTextField') as HTMLInputElement;
    const $typeSelectField = _component.querySelector('#typeSelectField') as HTMLSelectElement;
    const $regionSelectField = _component.querySelector('#regionSelectField') as HTMLSelectElement;
    const $textFieldPublicIP = _component.querySelector('#textFieldPublicIP') as HTMLInputElement;
    const $textFieldPrivateIP = _component.querySelector('#textFieldPrivateIP') as HTMLInputElement;

    expect($title.innerText).toEqual('Modify Instance');
    expect($nameTextField.value).toEqual('a1000abcd');
    expect($typeSelectField.value).toEqual('t2.medium');
    expect($regionSelectField.value).toEqual('eu-east-1');
    expect($textFieldPublicIP.value).toEqual('2.2.2.2');
    expect($textFieldPrivateIP.value).toEqual('2.2.2.2');

    const $submit = _component.querySelector('#submit') as HTMLButtonElement;
    $submit.click();
    _fixture.detectChanges();

    expect(instanceActions.updateInstance).toHaveBeenCalledWith(instance);
  }));

  it('should create with instance', inject([InstanceActions], (instanceActions: InstanceActions) => {
    const instance = {
      name: 'a1000abcd',
      type: 't2.medium',
      region: 'eu-east-1',
      publicIP: '2.2.2.2',
      privateIP: '2.2.2.2'
    };

    _fixture.componentInstance.dialogActions.showModal();
    _fixture.detectChanges();

    spyOn(instanceActions, 'createInstance').and.callFake(() => Promise.resolve());

    const $title = _component.querySelector('.mdl-dialog__title') as HTMLDivElement;
    const $nameTextField = _component.querySelector('#nameTextField') as HTMLInputElement;
    const $typeSelectField = _component.querySelector('#typeSelectField') as HTMLSelectElement;
    const $regionSelectField = _component.querySelector('#regionSelectField') as HTMLSelectElement;
    const $textFieldPublicIP = _component.querySelector('#textFieldPublicIP') as HTMLInputElement;
    const $textFieldPrivateIP = _component.querySelector('#textFieldPrivateIP') as HTMLInputElement;

    expect($nameTextField.value).toEqual('');
    expect($typeSelectField.value).toEqual('');
    expect($regionSelectField.value).toEqual('');
    expect($textFieldPublicIP.value).toEqual('');
    expect($textFieldPrivateIP.value).toEqual('');

    $title.innerText = 'Modify Instance';
    $nameTextField.value = 'a1000abcd';
    $typeSelectField.value = 't2.medium';
    $regionSelectField.value = 'eu-east-1';
    $textFieldPublicIP.value = '2.2.2.2';
    $textFieldPrivateIP.value = '2.2.2.2';

    expect($nameTextField.value).toEqual('a1000abcd');
    expect($typeSelectField.value).toEqual('t2.medium');
    expect($regionSelectField.value).toEqual('eu-east-1');
    expect($textFieldPublicIP.value).toEqual('2.2.2.2');
    expect($textFieldPrivateIP.value).toEqual('2.2.2.2');

    $title.dispatchEvent(new Event('input'));
    $nameTextField.dispatchEvent(new Event('input'));
    $typeSelectField.dispatchEvent(new Event('change'));
    $regionSelectField.dispatchEvent(new Event('change'));
    $textFieldPublicIP.dispatchEvent(new Event('input'));
    $textFieldPrivateIP.dispatchEvent(new Event('input'));
    _fixture.detectChanges();

    const $submit = _component.querySelector('#submit') as HTMLButtonElement;
    $submit.click();
    _fixture.detectChanges();

    expect(instanceActions.createInstance).toHaveBeenCalledWith(instance);
  }));


});
