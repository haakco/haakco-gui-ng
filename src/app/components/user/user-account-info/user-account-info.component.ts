import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {UserLoadUserDetails} from '../../../actions/user.actions';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../../reducers';

@Component({
             selector: 'app-user-account-info',
             templateUrl: './user-account-info.component.html',
             styleUrls: ['./user-account-info.component.scss'],
           })
export class UserAccountInfoComponent implements OnInit {

  @Input() user: InterfaceUser;
  public files: Set<File> = new Set();
  acceptTypes = 'image/jpeg,png,fdsfsdf';

  constructor(private store: Store<InterfaceStateApp>) {
  }

  ngOnInit() {
  }

  userImageUploadComplete(response: boolean) {
    this.store.dispatch(
      UserLoadUserDetails(
        {
          payload: this.user.uuid,
        }),
    );
  }

}
