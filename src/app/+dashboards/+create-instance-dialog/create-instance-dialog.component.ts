import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogCommands } from '../../shared/components/modal-dialog/modal-dialog.component';
import { ICloudInstance } from '../shared/models/instance.model';

import { InstanceActions } from '../shared/actions/instance.actions';

@Component({
  selector: 'cs-create-instance-dialog',
  templateUrl: 'create-instance-dialog.component.html',
  styleUrls: ['create-instance-dialog.component.scss'],
})
export class CreateInstanceDialogComponent implements OnInit {

  @Output() onInit: EventEmitter<any> = new EventEmitter();

  @ViewChild('nameTextField') nameTextField: ElementRef;
  @ViewChild('typeSelectField') typeSelectField: ElementRef;
  @ViewChild('regionSelectField') regionSelectField: ElementRef;
  @ViewChild('textFieldPublicIP') textFieldPublicIP: ElementRef;
  @ViewChild('textFieldPrivateIP') textFieldPrivateIP: ElementRef;

  public form: FormGroup;
  public dialogRef: DialogCommands;
  public types = [
    { caption: '', value: '' },
    { caption: 't2.nano', value: 't2.nano' },
    { caption: 't2.nano', value: 't2.nano' },
    { caption: 't2.micro', value: 't2.micro' },
    { caption: 't2.small', value: 't2.small' },
    { caption: 't2.medium', value: 't2.medium' },
    { caption: 't2.large', value: 't2.large' }
  ];
  public regions = [
    { caption: '', value: '' },
    { caption: 'us-east-1', value: 'us-east-1' },
    { caption: 'us-west-2', value: 'us-west-2' },
    { caption: 'us-west-1', value: 'us-west-1' },
    { caption: 'eu-west-1', value: 'eu-west-1' },
    { caption: 'eu-east-1', value: 'eu-east-1' }
  ];
  public editMode = false;
  private instance: ICloudInstance;

  constructor(
    private actions: InstanceActions,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'region': ['', Validators.required],
      'publicIP': ['', Validators.required],
      'privateIP': ['', Validators.required],
    });
  }

  ngOnInit() { }

  dialogInit(dialogRef) {
    this.dialogRef = dialogRef;
    this.onInit.emit({
      showModal: this.showDialog.bind(this)
    });
  }

  onDialogClose() {}

  showDialog(instance: ICloudInstance) {
    this.form.reset();
    this.editMode = false;
    this.instance = instance;
    this.form.controls['name'].enable();
    if (this.instance) {
      this.editMode = true;
      this.form.controls['name'].setValue(instance.name);
      this.form.controls['name'].disable();
      this.nameTextField.nativeElement.classList.add('is-dirty');
      this.form.controls['type'].setValue(instance.type);
      this.typeSelectField.nativeElement.classList.add('is-dirty');
      this.form.controls['region'].setValue(instance.region);
      this.regionSelectField.nativeElement.classList.add('is-dirty');
      this.form.controls['publicIP'].setValue(instance.publicIP);
      this.textFieldPublicIP.nativeElement.classList.add('is-dirty');
      this.form.controls['privateIP'].setValue(instance.privateIP);
      this.textFieldPrivateIP.nativeElement.classList.add('is-dirty');
    }
    this.dialogRef.showModal();
  }

  get message() {
    return this.instance ? `Modify Instance` : `Create Instance`;
  }

  submitForm($event: Event) {
    const instance = {
      name: this.form.value['name'] || this.instance.name,
      type: this.form.value['type'],
      region: this.form.value['region'],
      publicIP: this.form.value['privateIP'],
      privateIP: this.form.value['privateIP']
    } as ICloudInstance;

    this.dialogRef.showLoading();

    if (this.editMode) {
      this.actions.updateInstance(instance)
        .then(() => {
          this.dialogRef.hideLoading();
          this.dialogRef.close();
        });
    } else {
      this.actions.createInstance(instance)
        .then(() => {
          this.dialogRef.hideLoading();
          this.dialogRef.close();
        });
    }
  }

}
