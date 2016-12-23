import {
  Component,
  OnInit,
  ViewChild,
  ContentChild,
  Output,
  ElementRef,
  EventEmitter
} from '@angular/core';

export interface DialogCommands {
  showModal: Function;
  close: Function;
  showLoading: Function;
  hideLoading: Function;
}

@Component({
  selector: 'cs-modal-dialog',
  templateUrl: 'modal-dialog.component.html',
  styleUrls: ['modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  public isLoading = false;

  @Output() onInit = new EventEmitter<DialogCommands>();
  @Output() onClose = new EventEmitter();
  @Output() onConfirm = new EventEmitter();

  @ViewChild('dialog') dialog: ElementRef;

  @ContentChild('confirm') confirmButton: ElementRef;
  @ContentChild('close') closeButton: ElementRef;

  private element: any;

  ngOnInit() {
    this.element = this.dialog.nativeElement;
    this.onInit.emit({
      showModal: this.showModal.bind(this),
      close: this.close.bind(this),
      showLoading: this.showLoading.bind(this),
      hideLoading: this.hideLoading.bind(this)
    });

    // attach transcluded events
    this.closeButton.nativeElement.addEventListener('click', this.close.bind(this), false);
    this.confirmButton.nativeElement.addEventListener('click', this.confirm.bind(this), false);
  }

  confirm() {
    this.onConfirm.emit({});
  }

  showModal() {
    this.element.showModal();
  }

  showLoading() {
    this.isLoading = true;
  }

  hideLoading() {
    this.isLoading = false;
  }

  close() {
    this.element.addEventListener('close', () => {
      this.onClose.emit();
      this.isLoading = false;
    });
    this.element.close();
  }
}
