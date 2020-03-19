import {Action, createReducer} from '@ngrx/store';
import {InterfaceAlert} from '../interfaces/InterfaceAlert';

export interface InterfaceStateAlert {
  alerts: InterfaceAlert[];
}

export const initialState: InterfaceStateAlert = {
  alerts: [],
};

const alertReducer = createReducer(
  initialState,
);

export function reducer(state: InterfaceStateAlert | undefined, action: Action) {
  return alertReducer(state, action);
}
