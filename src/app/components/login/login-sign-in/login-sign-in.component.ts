import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AuthLogin} from '../../../actions/auth.actions';
import {ConstantValidation} from '../../../constants/ConstantValidation';
import {InterfaceAuthDetails} from '../../../interfaces/InterfaceAuthDetails';
import {InterfaceStateApp} from '../../../reducers';
import {InterfaceStateAuth} from '../../../reducers/auth.reducer';
import {selectAuthState} from '../../../selectors/auth.selectors';

@Component({
  selector: 'app-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss'],
})
export class LoginSignInComponent implements OnInit {

  ConstantValidation = ConstantValidation;

  form: InterfaceAuthDetails = {
    email: '',
    password: '',
    rememberMe: false,
  };

  authState$: Observable<InterfaceStateAuth>;

  constructor(private store: Store<InterfaceStateApp>) {
    this.authState$ = store.pipe(select(selectAuthState));
  }

  ngOnInit() {
  }

  onSubmit() {
    this.store.dispatch(
      AuthLogin({
        userDetails: this.form,
      }),
    );
  }
}
