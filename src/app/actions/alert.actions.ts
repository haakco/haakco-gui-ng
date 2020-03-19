import {createAction, props} from '@ngrx/store';
import {InterfaceAlert} from '../interfaces/InterfaceAlert';

export const AlertAdd = createAction(
  '[Alert] Add Alert',
  props<{ payload: InterfaceAlert }>(),
);
