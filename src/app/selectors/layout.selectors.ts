import {createFeatureSelector} from '@ngrx/store';
import {InterfaceStateLayout, layoutFeatureKey} from '../reducers/layout.reducer';

export const selectLayoutState = createFeatureSelector<InterfaceStateLayout>(layoutFeatureKey);
