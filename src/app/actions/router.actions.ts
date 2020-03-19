import {NavigationExtras} from '@angular/router';
import {createAction, props} from '@ngrx/store';
import {InterfaceRoute} from '../interfaces/InterfaceRoute';

export const RouterGo = createAction(
  '[Router] Go',
  props<InterfaceRoute>(),
);
