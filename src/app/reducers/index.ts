import {routerReducer, RouterReducerState} from '@ngrx/router-store';
import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import {localStorageSync} from 'ngrx-store-localstorage';
import {environment} from '../../environments/environment';
import {InterfaceRouterStateUrl} from '../interfaces/InterfaceRouterStateUrl';
import * as fromAlert from './alert.reducer';
import {InterfaceStateAlert} from './alert.reducer';
import * as fromAuth from './auth.reducer';
import {InterfaceStateAuth} from './auth.reducer';
import * as fromLayout from './layout.reducer';
import {InterfaceStateLayout} from './layout.reducer';
import * as fromUser from './user.reducer';

export interface InterfaceStateApp {
  router: RouterReducerState<InterfaceRouterStateUrl>;
  alert: InterfaceStateAlert;
  auth: InterfaceStateAuth;
  layout: InterfaceStateLayout;
  [fromUser.userFeatureKey]: fromUser.InterfaceStateUser;
}

export const reducers: ActionReducerMap<InterfaceStateApp> = {
  router: routerReducer,
  alert: fromAlert.reducer,
  auth: fromAuth.reducer,
  [fromLayout.layoutFeatureKey]: fromLayout.reducer,
  [fromUser.userFeatureKey]: fromUser.reducer,
};

export function localStorageSyncReducer(reducer: ActionReducer<InterfaceStateApp>): ActionReducer<any, any> {
  return localStorageSync({
    keys: [
      'router',
      'alert',
      'auth',
      fromLayout.layoutFeatureKey,
      fromUser.userFeatureKey,
    ],
    rehydrate: true,
    restoreDates: false,
  })(reducer);
}

export const metaReducers: MetaReducer<any>[] = [];

if (!environment.production) {
  metaReducers.push(storeFreeze);
}
metaReducers.push(localStorageSyncReducer);
