import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthPasswordReset} from '../../../actions/auth.actions';
import {InterfaceAuthDetails} from '../../../interfaces/InterfaceAuthDetails';
import {InterfaceStateApp} from '../../../reducers';

@Component({
             selector: 'app-login-forgot-password',
             templateUrl: './login-forgot-password.component.html',
             styleUrls: ['./login-forgot-password.component.scss'],
           })
export class LoginForgotPasswordComponent implements OnInit {

  form: InterfaceAuthDetails = {
    email: '',
  };

  constructor(private store: Store<InterfaceStateApp>) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.store.dispatch(
      AuthPasswordReset({
                          payload: this.form,
                        }),
    );
  }

}
