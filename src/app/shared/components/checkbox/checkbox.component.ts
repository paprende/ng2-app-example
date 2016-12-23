import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'cs-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss']
})
export class CheckBoxComponent implements OnChanges {

  @Input() value = false;
  @Output() onChanged = new EventEmitter();
  @ViewChild('checkbox') checkbox: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  changeClicked() {
    this.value = !this.value;
    this.onChanged.emit(this.value);
  }

  ngOnChanges() {
    const $element = this.checkbox.nativeElement;
    if (this.value) {
      $element.classList.add('is-checked');
    } else {
      $element.classList.remove('is-checked');
    }
    this.changeDetectorRef.detectChanges();
  }

}
