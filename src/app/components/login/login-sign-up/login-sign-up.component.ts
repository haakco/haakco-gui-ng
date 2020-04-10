import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthSignUp} from '../../../actions/auth.actions';
import {ConstantValidation} from '../../../constants/ConstantValidation';
import {InterfaceAuthDetails} from '../../../interfaces/InterfaceAuthDetails';
import {InterfaceStateApp} from '../../../reducers';

@Component({
  selector: 'app-login-sign-up',
  templateUrl: './login-sign-up.component.html',
  styleUrls: ['./login-sign-up.component.scss'],
})
export class LoginSignUpComponent implements OnInit {
  ConstantValidation = ConstantValidation;

  form: InterfaceAuthDetails = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  constructor(private store: Store<InterfaceStateApp>) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.form.password_confirmation = this.form.password;
    this.store.dispatch(
      AuthSignUp({
        payload: {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password,
        },
      }),
    );
  }
}
