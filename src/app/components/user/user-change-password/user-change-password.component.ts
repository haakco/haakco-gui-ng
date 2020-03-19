import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {UserUpdateUsersPassword} from '../../../actions/user.actions';
import {ConstantValidation} from '../../../constants/ConstantValidation';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../../reducers';

@Component({
             selector: 'app-user-change-password',
             templateUrl: './user-change-password.component.html',
             styleUrls: ['./user-change-password.component.scss'],
           })
export class UserChangePasswordComponent implements OnInit {

  @Input() user: InterfaceUser;

  ConstantValidation = ConstantValidation;
  canEdit = false;

  oldPassword = '';
  newPassword = '';

  constructor(private store: Store<InterfaceStateApp>) {
  }

  ngOnInit(): void {
  }

  edit() {
    this.canEdit = true;
  }

  editCancel() {
    this.canEdit = false;
    this.oldPassword = '';
    this.newPassword = '';
  }

  onSubmit() {
    this.canEdit = false;
    this.store.dispatch(UserUpdateUsersPassword(
      {
        payload: {
          userUuid: this.user.uuid,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        },
      }));
  }

}
