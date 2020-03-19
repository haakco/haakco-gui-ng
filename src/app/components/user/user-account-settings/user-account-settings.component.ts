import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserUpdateUsersDetails} from '../../../actions/user.actions';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../../reducers';
import {selectAuthUser} from '../../../selectors/auth.selectors';

@Component({
             selector: 'app-account-user-settings',
             templateUrl: './user-account-settings.component.html',
             styleUrls: ['./user-account-settings.component.scss'],
           })
export class UserAccountSettingsComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();
  authUser: Observable<InterfaceUser>;

  canEdit = false;

  _user: InterfaceUser = {
    uuid: '',
    email: '',
    name: '',
  };
  _editUser: InterfaceUser = {
    uuid: '',
    email: '',
    name: '',
  };

  @Input() set user(user: InterfaceUser) {
    this._user = {
      ...user
    };
    this._editUser = {
      ...this._user
    };
  };

  constructor(private store: Store<InterfaceStateApp>) {
    this.authUser = this.store.select(selectAuthUser)
      .pipe(takeUntil(this.stop$));
  }

  ngOnInit() {

  }

  edit() {
    this.canEdit = true;
  }

  resetEdit() {
    this._editUser = {
      ...this._user
    };
  }

  editCancel() {
    this.canEdit = false;
    this.resetEdit();
  }

  onSubmit() {
    this.canEdit = false;
    this.store.dispatch(
      UserUpdateUsersDetails({payload: this._editUser}),
    );
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }

}
