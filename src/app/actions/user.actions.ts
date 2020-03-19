import {createAction, props} from '@ngrx/store';
import {InterfaceUser} from '../interfaces/InterfaceUser';
import {InterfaceUsersObject} from '../interfaces/InterfaceUsersObject';

export const UserLoadMyUserDetails = createAction(
  '[User] Load My User Details',
);

export const UserLoadUserDetails = createAction(
  '[User] Load User Details',
  props<{ payload: string }>(),
);

export const UserLoadAllUsersDetails = createAction(
  '[User] Load All Users Details',
);

export const UserSetSingleUsersDetails = createAction(
  '[User] Set Single User Details',
  props<{ payload: InterfaceUser }>(),
);

export const UserSetAllUsersDetails = createAction(
  '[User] Set All Users Details',
  props<{ payload: InterfaceUsersObject }>(),
);

export const UserUpdateUsersDetails = createAction(
  '[User] Update Users Details',
  props<{ payload: InterfaceUser }>(),
);


export const UserUpdateUsersPassword = createAction(
  '[User] Update Users Password',
  props<{
    payload: {
      userUuid: string;
      oldPassword: string;
      newPassword: string;
    }
  }>(),
);




