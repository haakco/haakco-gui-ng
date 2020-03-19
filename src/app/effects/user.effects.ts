import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {
  UserLoadAllUsersDetails,
  UserLoadMyUserDetails,
  UserLoadUserDetails,
  UserUpdateUsersDetails,
  UserUpdateUsersPassword,
} from '../actions/user.actions';
import {InterfaceStateApp} from '../reducers';
import {UserService} from '../services/api/user.service';


@Injectable()
export class UserEffects {

  loadMyUserDetails = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            UserLoadMyUserDetails,
          ),
          tap(action => {
            this.userService.loadMyUserDetails();
          }),
        ),
    {dispatch: false},
  );

  loadUserDetails = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            UserLoadUserDetails,
          ),
          tap((action) => {
            this.userService.loadUserDetails(action.payload);
          }),
        ),
    {dispatch: false},
  );

  loadAllUsersDetails = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            UserLoadAllUsersDetails,
          ),
          tap(action => {
            this.userService.loadAllUsers();
          }),
        ),
    {dispatch: false},
  );

  updateUserDetails = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            UserUpdateUsersDetails,
          ),
          tap((action) => {
            this.userService.updateUserDetails(action.payload);
          }),
        ),
    {dispatch: false},
  );

  updateUserPassword = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            UserUpdateUsersPassword,
          ),
          tap((action) => {
            this.userService.updateUserPassword(action.payload.userUuid, action.payload.oldPassword, action.payload.newPassword);
          }),
        ),
    {dispatch: false},
  );

  constructor(
    private actions$: Actions,
    private store: Store<InterfaceStateApp>,
    private userService: UserService,
  ) {
  }

}
