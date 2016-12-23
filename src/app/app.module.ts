import { ApplicationRef, NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgRedux, DevToolsExtension } from 'ng2-redux';

import { AppComponent } from './app.component';
import { IAppState, rootReducer } from './app.store';

import { routing } from './app.routing';

const createLogger = require('redux-logger');

// hot reload modules
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

// splNavBar
import { ngModuleNavBarDeclarations } from './+nav-bar/index';

// splDashboards
import { ngModelDashboardDeclarations, ngModelDashboardProviders } from './+dashboards/index';

// splLoadingOverlay
import { ngModuleLoadingOverlayDeclarations } from './+loading-overlay/index';

// shared
import { ngModuleSharedDeclarations, ngModuleSharedProviders } from './shared/index';

@NgModule({
  declarations: [
    AppComponent,
    ...ngModuleNavBarDeclarations,
    ...ngModelDashboardDeclarations,
    ...ngModuleLoadingOverlayDeclarations,
    ...ngModuleSharedDeclarations
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ...ngModelDashboardProviders,
    ...ngModuleSharedProviders,
    DevToolsExtension,
    NgRedux,
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    private ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension
  ) {
    this.ngRedux.configureStore(
      rootReducer,
      Object.assign({}),
      [ createLogger() ],
      [ isDevMode() && devTools.isEnabled() ? devTools.enhancer() : f => f ]
    );
  }

  hmrOnInit(store) {
    console.log('HMR store', store);
  }

  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
