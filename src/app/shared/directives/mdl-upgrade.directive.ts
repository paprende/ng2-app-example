import { Directive, OnInit, ElementRef } from '@angular/core';

declare var componentHandler: any;

@Directive({
  selector: '[mdl]'
})
export class MDL implements OnInit {
  constructor(private elem: ElementRef) {}

  ngOnInit() {
    componentHandler.upgradeElements(this.elem.nativeElement);
  }

}
