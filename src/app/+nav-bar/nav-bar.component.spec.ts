/* tslint:disable:no-unused-variable */

import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Http, HttpModule } from '@angular/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';

class AuthServiceMock {
  logout() {}
}

describe('Component: NavBar', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      providers: [
        provideRoutes([]),
      ],
      imports: [
        RouterTestingModule
      ],
    });

  }));

  it('should create an instance', async(() => {
    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(NavBarComponent);
      expect(fixture).toBeTruthy();
    });
  }));

});
