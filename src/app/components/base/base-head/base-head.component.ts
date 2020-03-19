import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthLogout} from '../../../actions/auth.actions';
import {LayoutSetSideBar} from '../../../actions/layout.actions';
import {ConstantAppConfig} from '../../../constants/ConstantAppConfig';
import {EnumPermissions} from '../../../enums/EnumPermissions';
import {InterfaceStateApp} from '../../../reducers';
import {InterfaceStateAuth} from '../../../reducers/auth.reducer';
import {InterfaceStateLayout} from '../../../reducers/layout.reducer';

@Component({
  selector: 'app-base-head',
  templateUrl: './base-head.component.html',
  styleUrls: ['./base-head.component.scss'],
})
export class BaseHeadComponent implements OnInit {

  @Input() authState: InterfaceStateAuth;
  @Input() layoutState: InterfaceStateLayout;
  constantAppConfig = ConstantAppConfig;

  mainMenu = [
    {
      title: 'Admin',
      allowed: [
        EnumPermissions.CLIENT_USERS_VIEW_NAME,
        EnumPermissions.CLIENT_USERS_EDIT_NAME,
        EnumPermissions.CLIENT_USERS_RIGHTS_EDIT_NAME,
      ],
      children: [
        {
          title: 'Manage Users',
          route: 'admin/users',
          allowed: [
            EnumPermissions.CLIENT_USERS_RIGHTS_EDIT_NAME,
          ],
        },
      ],
    },
  ];

  constructor(private store: Store<InterfaceStateApp>) {
  }

  ngOnInit() {
  }

  logOut() {
    this.store.dispatch(AuthLogout());
  }

  toggleSideBar() {
    this.store.dispatch(LayoutSetSideBar({payload: !this.layoutState.isSideBarCollapsed}));
  }
}
