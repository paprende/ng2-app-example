import { Output, Injectable, EventEmitter } from '@angular/core';

export interface SnackBarParams {
  message: string;
  timeout?: number;
  actionHandler?: Function;
  actionText?: string;
}

@Injectable()
export class MdlSnackbarService {

  @Output() private showSnackbarEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  showSnackbar(data: SnackBarParams) {
    this.showSnackbarEvent.emit(data);
  }

  onShowSnackbar(): EventEmitter<any> {
    return this.showSnackbarEvent;
  }

}
