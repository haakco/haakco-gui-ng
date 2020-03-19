import {createAction, props} from '@ngrx/store';
import {InterfaceAuthDetails} from '../interfaces/InterfaceAuthDetails';
import {InterfaceRoute} from '../interfaces/InterfaceRoute';
import {InterfaceToken} from '../interfaces/InterfaceToken';
import {InterfaceUser} from '../interfaces/InterfaceUser';

export const AuthLogin = createAction(
  '[Auth] Login',
  props<{ userDetails: InterfaceAuthDetails }>(),
);

export const AuthLoginSubmit = createAction(
  '[Auth] Login Submit',
  props<{ payload: boolean }>(),
);

export const AuthLogout = createAction(
  '[Auth] Logout'
);

export const AuthLoginSetToken = createAction(
  '[Auth] Login Set Token',
  props<{ token: InterfaceToken }>(),
);

export const AuthLoginSetUrlAfterLogin = createAction(
  '[Auth] Login Set Url After Login',
  props<{ urlAfterLogin: InterfaceRoute}>(),
);

export const AuthLoginGetUrlAfterLogin = createAction(
  '[Auth] Login Get URL After Login'
);

export const AuthLoginSuccessSetUser = createAction(
  '[Auth] Login Success Set User',
  props<{ payload: InterfaceUser }>(),
);

export const AuthLoginFailure = createAction(
  '[Auth] Login Failure',
  props<{ payload: any }>(),
);

export const AuthLoginRedirect = createAction(
  '[Auth] Login Redirect',
);

export const AuthSignUp = createAction(
  '[Auth] Sign Up',
  props<{ userDetails: InterfaceAuthDetails }>(),
);

export const AuthPasswordReset = createAction(
  '[Auth] Password Reset',
  props<{ userDetails: InterfaceAuthDetails }>(),
);

export const AuthPasswordResetToken = createAction(
  '[Auth] Password Reset Token',
  props<{ userDetails: InterfaceAuthDetails }>(),
);
