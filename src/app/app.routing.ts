import { RouterModule } from '@angular/router';
import { DashboardsRoutes } from './+dashboards/dashboards.routes';

const routes = [
  ...DashboardsRoutes,
  { path: '', redirectTo: 'dashboards', pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(routes);
