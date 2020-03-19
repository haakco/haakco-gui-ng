import {Params} from '@angular/router';

export interface InterfaceRouterStateUrl {
  url: string;
  params?: Params;
  queryParams?: Params;
}
