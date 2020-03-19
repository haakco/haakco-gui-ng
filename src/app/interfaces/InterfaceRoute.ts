import {NavigationExtras} from '@angular/router';

export interface InterfaceRoute {
  path: string[];
  queryParams?: object;
  extras?: NavigationExtras;
}
