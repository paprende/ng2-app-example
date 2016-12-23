import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogCommands } from '../../shared/components/modal-dialog/modal-dialog.component';
import { MdlSnackbarService } from '../../shared/components/mdl-snackbar/mdl-snackbar.service';
import { ICloudInstance } from '../shared/models/instance.model';

import { InstanceActions } from '../shared/actions/instance.actions';

@Component({
  selector: 'cs-delete-instance-dialog',
  templateUrl: 'delete-instance-dialog.component.html',
  styleUrls: ['delete-instance-dialog.component.scss'],
})
export class DeleteInstanceDialogComponent implements OnInit {

  @Output() onInit: EventEmitter<any> = new EventEmitter();
  public dialogRef: DialogCommands;

  private instances: Array<ICloudInstance> = [];

  constructor(
    private actions: InstanceActions
  ) { }

  ngOnInit() { }

  dialogInit(dialogRef) {
    this.dialogRef = dialogRef;
    this.onInit.emit({
      showModal: this.showDialog.bind(this)
    });
  }

  onDialogClose() {}

  showDialog(instance: ICloudInstance | Array<ICloudInstance>) {
    this.instances = [].concat(instance);
    this.dialogRef.showModal();
  }

  get message() {
    return this.instances.length > 1 ? `Delete ${ this.instances.length } Instances?` : `Delete Instance?`;
  }

  submitForm($event: Event) {
    this.dialogRef.showLoading();

    Promise.all(this.instances.map(
      (i) => this.actions.removeInstance(i)
    ))
      .then(() => {
        this.dialogRef.hideLoading();
        this.dialogRef.close();
      });
  }

}
