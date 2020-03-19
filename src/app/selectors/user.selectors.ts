import {createFeatureSelector, createSelector} from '@ngrx/store';
import {InterfaceStateUser, userFeatureKey} from '../reducers/user.reducer';


export const selectUserState = createFeatureSelector<InterfaceStateUser>(userFeatureKey);

export const selectUserUsers = createSelector(selectUserState, (state: InterfaceStateUser) => state.users);
