import {createFeatureSelector, createSelector} from '@ngrx/store';
import {InterfaceStateAlert} from '../reducers/alert.reducer';

export const selectAlertState = createFeatureSelector<InterfaceStateAlert>('alert');
export const selectAlerts = createSelector(selectAlertState, (state: InterfaceStateAlert) => state.alerts);
