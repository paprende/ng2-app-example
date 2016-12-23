import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

declare var componentHandler;

export interface MdlSelectComponentItems {
  caption: string;
  value: any;
  selected?: true;
}

@Component({
  selector: 'mdl-select',
  templateUrl: 'mdl-select.component.html',
  styleUrls: ['mdl-select.component.scss']
})
export class MdlSelectComponent implements OnInit, AfterViewInit {

  @ViewChild('button') button: ElementRef;
  @ViewChild('list') list: ElementRef;

  @Input() items = [];
  @Output() onMenuItemSelected: EventEmitter<any> = new EventEmitter();

  public caption = 'Select';
  public isOpen = false;

  private $button: HTMLButtonElement;
  private $list: HTMLDListElement;

  ngOnInit() {
    this.$button = this.button.nativeElement;
    this.$list = this.list.nativeElement;
  }

  ngAfterViewInit() {
    this.$button.addEventListener('menuselect', this.menuSelect.bind(this));
    this.$list.addEventListener('_closemenu', this.closeMenu.bind(this));
    this.$button['MaterialExtMenuButton'].setSelectedMenuItem(this.$list.children[0]);
    this.caption = this.$list.children[0].getAttribute('data-caption');
  }

  menuSelect(event) {
    this.caption = event.detail.source.getAttribute('data-caption');
    this.onMenuItemSelected.emit({
      selected: event.detail.source.getAttribute('data-value')
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

}
