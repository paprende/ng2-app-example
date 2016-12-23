import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-icon-button',
  templateUrl: 'icon-button.component.html',
  styleUrls: ['icon-button.component.scss']
})
export class IconButtonComponent {
  @Input() type = '';
  @Input() disabled = false;
}
