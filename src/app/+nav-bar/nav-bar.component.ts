import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'splNavBar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit {

  ngOnInit() {
  }

  signOut() {
  }

}
