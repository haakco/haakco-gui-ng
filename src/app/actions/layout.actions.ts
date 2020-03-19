import {createAction, props} from '@ngrx/store';

export const LayoutSetSideBarDisplay = createAction(
  '[Layout] Set Side Bar',
  props<{ payload: boolean }>(),
);
export const LayoutSetSideBar = createAction(
  '[Layout] Set Side Bar',
  props<{ payload: boolean }>(),
);
