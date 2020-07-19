import {Action, createReducer, on} from '@ngrx/store';
import {
  AuthLoginSetToken,
  AuthLoginSetUrlAfterLogin,
  AuthLoginSubmit,
  AuthLoginSuccessSetUser,
  AuthLogout, AuthSetPermissions, AuthSetRoles,
} from '../actions/auth.actions';
import {InterfaceRoute} from '../interfaces/InterfaceRoute';
import {InterfaceToken} from '../interfaces/InterfaceToken';
import {InterfaceUser} from '../interfaces/InterfaceUser';

export interface InterfaceStateAuth {
  loginSubmit: boolean;
  loggedIn: boolean;
  userUuid: string;
  user: InterfaceUser;
  permissions: { [uuid: string]: string };
  roles: { [uuid: string]: string };
  access_token: string;
  token: InterfaceToken;
  urlAfterLogin: InterfaceRoute;
}

export const initialState: InterfaceStateAuth = {
  loginSubmit: false,
  loggedIn: false,
  userUuid: null,
  user: null,
  permissions: {},
  roles: {},
  access_token: null,
  token: null,
  urlAfterLogin: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthLoginSubmit, (state, {payload}) => ({...state, loginSubmit: payload})),
  on(AuthLoginSetToken, (state, {payload}) => (
    {
      ...state,
      token: payload,
      access_token: payload.access_token,
    }
  )),
  on(AuthLoginSuccessSetUser, (state, {payload}) => ({
    ...state,
    userUuid: payload.uuid,
    user: payload,
    loggedIn: true,
  })),
  on(AuthSetPermissions, (state, {payload}) => ({...state, permissions: payload})),
  on(AuthSetRoles, (state, {payload}) => ({...state, roles: payload})),
  on(AuthLoginSetUrlAfterLogin, (state, {payload}) => ({...state, urlAfterLogin: payload})),
  on(AuthLogout, (state) => ({...initialState, urlAfterLogin: state.urlAfterLogin})),
);

export function reducer(state: InterfaceStateAuth | undefined, action: Action) {
  return authReducer(state, action);
}
