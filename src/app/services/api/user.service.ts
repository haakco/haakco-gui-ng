import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {NGXLogger} from 'ngx-logger';
import {NgxPermissionsService} from 'ngx-permissions';
import {first} from 'rxjs/operators';
import {AlertAdd} from '../../actions/alert.actions';
import {AuthLoginSuccessSetUser, AuthSetPermissions, AuthSetRoles} from '../../actions/auth.actions';
import {UserSetAllUsersDetails, UserSetSingleUsersDetails} from '../../actions/user.actions';
import {EnumAlertTypes} from '../../enums/EnumAlertTypes';
import {InterfaceUser} from '../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../reducers';
import {selectAuthUser} from '../../selectors/auth.selectors';
import {HttpService} from '../helper/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  user: InterfaceUser;

  loadMyUserDetails() {
    this.httpService.getRequest(`/me`)
      .subscribe((user: InterfaceUser) => {
        this.user = user;
        this.store.dispatch(UserSetSingleUsersDetails(
          {
            payload: this.user,
          }));
        this.store.dispatch(AuthLoginSuccessSetUser(
          {
            payload: this.user,
          }));
        this.store.dispatch(
          AuthSetPermissions({
            payload: user.permissions,
          }),
        );
        this.store.dispatch(
          AuthSetRoles({
            payload: user.roles,
          }),
        );
      });
  }

  loadUserDetails(userUuid: string) {
    this.httpService.getRequest(`/user/${userUuid}`)
      .subscribe((user: InterfaceUser) => {
        this.user = user;
        this.store.dispatch(UserSetSingleUsersDetails(
          {
            payload: this.user,
          }));

        this.store
          .select(selectAuthUser)
          .pipe(
            first(),
          )
          .subscribe((authUser) => {
            if (authUser.uuid === this.user.uuid) {
              this.store.dispatch(AuthLoginSuccessSetUser(
                {
                  payload: this.user,
                }));
            }
          });
      });
  }

  updateUserDetails(userDetails: InterfaceUser) {
    this.httpService.postRequest(`/user/${userDetails.uuid}`, {
      email: userDetails.email,
      name: userDetails.name,
    })
      .subscribe((user: InterfaceUser) => {
        this.user = user;
        this.store.dispatch(UserSetSingleUsersDetails(
          {
            payload: this.user,
          }));
        this.store.dispatch(AlertAdd(
          {
            payload: {
              alertType: EnumAlertTypes.ALERT_TYPE_SUCCESS,
              message: 'User Updated',
            },
          }));
      });
  }

  updateUserPassword(userUuid: string, oldPassword: string, newPassword: string) {
    this.httpService.postRequest(`/user/${userUuid}/password`, {
      oldPassword,
      newPassword,
    })
      .subscribe((user: InterfaceUser) => {
        this.user = user;
        this.store.dispatch(AlertAdd(
          {
            payload: {
              alertType: EnumAlertTypes.ALERT_TYPE_SUCCESS,
              message: 'Password Updated',
            },
          }));
      });
  }

  loadAllUsers() {
    this.httpService.getRequest(`/users`, 60)
      .subscribe((usersData: InterfaceUser[]) => {
        const users = usersData
          .reduce((previous, user: InterfaceUser) => {
            previous[user.uuid] = user;
            return previous;
          }, {});
        this.store.dispatch(UserSetAllUsersDetails(
          {
            payload: users,
          }));
      });
  }

  constructor(
    private logger: NGXLogger,
    private httpService: HttpService,
    private store: Store<InterfaceStateApp>,
  )
  {
  }
}
