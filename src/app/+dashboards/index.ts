import { DashboardsComponent } from './dashboards.component';


import { CreateInstanceDialogComponent } from './+create-instance-dialog/create-instance-dialog.component';
import { DeleteInstanceDialogComponent } from './+delete-instance-dialog/delete-instance-dialog.component';
import { SearchFilterPipe } from './shared/pipes/search-filter.pipe';

import { InstanceActions } from './shared/actions/instance.actions';
import { InstanceHttp } from './shared/http/instance.http';

import { TrafficActions } from './shared/actions/traffic.actions';
import { TrafficHttp } from './shared/http/traffic.http';

import { WebSocketService } from './shared/services/websocket.service';
import { InstanceStatusService } from './shared/services/instance-status.service';

export const ngModelDashboardDeclarations = [
  DashboardsComponent,
  CreateInstanceDialogComponent,
  DeleteInstanceDialogComponent,
  SearchFilterPipe
];

export const ngModelDashboardProviders = [
  InstanceActions,
  InstanceHttp,
  TrafficActions,
  TrafficHttp,
  WebSocketService,
  InstanceStatusService
];

export * from './dashboards.routes';
