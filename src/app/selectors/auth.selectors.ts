import {createFeatureSelector, createSelector} from '@ngrx/store';
import {InterfaceStateAuth} from '../reducers/auth.reducer';


export const selectAuthState = createFeatureSelector<InterfaceStateAuth>('auth');

export const selectAuthLoggedIn = createSelector(selectAuthState, (state: InterfaceStateAuth) => state.loggedIn);
export const selectAuthUserUuid = createSelector(selectAuthState, (state: InterfaceStateAuth) => state.userUuid);
export const selectAuthUser = createSelector(selectAuthState, (state: InterfaceStateAuth) => state.user);
export const selectAuthToken = createSelector(selectAuthState, (state: InterfaceStateAuth) => state.token);
