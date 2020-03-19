import {Action, createReducer, on} from '@ngrx/store';
import {AuthLogout} from '../actions/auth.actions';
import {UserSetAllUsersDetails, UserSetSingleUsersDetails} from '../actions/user.actions';
import {InterfaceUsersObject} from '../interfaces/InterfaceUsersObject';


export const userFeatureKey = 'user';

export interface InterfaceStateUser {
  users: InterfaceUsersObject;
}

export const initialState: InterfaceStateUser = {
  users: {},
};

const userReducer = createReducer(
  initialState,
  on(UserSetSingleUsersDetails,
    (state, data) => {
      const user = data.payload;
      const users = {...state.users};
      users[user.uuid] = user;
      return {
        ...state, users,
      };
    },
  ),
  on(UserSetAllUsersDetails, (state, {payload}) => ({...state, users: payload})),
  on(AuthLogout, () => initialState),
);

export function reducer(state: InterfaceStateUser | undefined, action: Action) {
  return userReducer(state, action);
}
