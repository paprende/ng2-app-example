import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'splLoadingOverlay',
  templateUrl: 'loading-overlay.component.html',
  styleUrls: ['loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit {

  @Input() active = false;
  @Input() style = '';

  constructor() { }

  ngOnInit() { }

}
