import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { MdlSnackbarService } from './mdl-snackbar.service';

@Component({
  selector: 'mdl-snackbar',
  templateUrl: 'mdl-snackbar.component.html',
  styleUrls: ['mdl-snackbar.component.scss']
})
export class MdlSnackbarComponent implements OnInit {

  public message = '';

  @ViewChild('snackBar') snackBar: ElementRef;

  constructor(private service: MdlSnackbarService) { }

  ngOnInit() {
    this.service.onShowSnackbar().subscribe(this.showSnackbar.bind(this));
    window['showSnackbar'] = this.showSnackbar.bind(this);
  }

  showSnackbar(data) {
    this.message = data.message;
    this.snackBar.nativeElement.MaterialSnackbar.showSnackbar(
      Object.assign({}, data, {
        actionHandler: (() => {
          this.snackBar.nativeElement.MaterialSnackbar.cleanup_();
        }).bind(this),
        actionText: 'GOT IT!'
      })
    );
  }

}
