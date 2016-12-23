import { MDL } from './directives/mdl-upgrade.directive';
import { ButtonComponent } from './components/button/button.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { MdlSnackbarComponent } from './components/mdl-snackbar/mdl-snackbar.component';
import { MdlSelectComponent } from './components/mdl-select/mdl-select.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MdlFileUploadComponent } from './components/mdl-file-upload/mdl-file-upload.component';
import { CheckBoxComponent } from './components/checkbox/checkbox.component';

import { SparklineComponent } from './components/sparkline/sparkline.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { MdlSnackbarService } from './components/mdl-snackbar/mdl-snackbar.service';

export const ngModuleSharedDeclarations = [
  MDL,
  ButtonComponent,
  IconButtonComponent,
  ModalDialogComponent,
  MdlSnackbarComponent,
  MdlSelectComponent,
  PaginationComponent,
  MdlFileUploadComponent,
  CheckBoxComponent,
  SparklineComponent,
  PieChartComponent,
  LineChartComponent,
];

export const ngModuleSharedProviders = [
  MdlSnackbarService
];

export { routeAnimation } from './animations/route-animation';
