import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss']
})
export class ButtonComponent {
  @Input() disabled = false;
}
