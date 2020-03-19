import {RouterReducerState} from '@ngrx/router-store';
import {createFeatureSelector} from '@ngrx/store';
import {InterfaceRouterStateUrl} from '../interfaces/InterfaceRouterStateUrl';

export const selectRouteState = createFeatureSelector<RouterReducerState<InterfaceRouterStateUrl>>('router');
