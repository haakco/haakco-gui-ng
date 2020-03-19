import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthPasswordResetToken} from '../../../actions/auth.actions';
import {InterfaceAuthDetails} from '../../../interfaces/InterfaceAuthDetails';
import {InterfaceStateApp} from '../../../reducers';

@Component({
  selector: 'app-login-reset-password',
  templateUrl: './login-reset-password.component.html',
  styleUrls: ['./login-reset-password.component.scss'],
})
export class LoginResetPasswordComponent implements OnInit {

  form: InterfaceAuthDetails = {
    email: '',
    password: '',
    password_confirmation: '',
    token: '',
  };

  constructor(private store: Store<InterfaceStateApp>,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.form.email = params.get('email');
        this.form.token = params.get('token');
      },
    );
  }

  onSubmit() {
    this.store.dispatch(
      AuthPasswordResetToken({
        userDetails: {
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password,
          token: this.form.token,
        },
      }),
    );
  }

}
