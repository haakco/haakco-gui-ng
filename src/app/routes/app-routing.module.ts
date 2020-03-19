import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseBlankComponent} from '../components/base/base-blank/base-blank.component';
import {TermsOfServiceComponent} from '../components/base/terms-of-service/terms-of-service.component';
import {LoginForgotPasswordComponent} from '../components/login/login-forgot-password/login-forgot-password.component';
import {LoginResetPasswordComponent} from '../components/login/login-reset-password/login-reset-password.component';
import {LoginSignInComponent} from '../components/login/login-sign-in/login-sign-in.component';
import {LoginSignUpComponent} from '../components/login/login-sign-up/login-sign-up.component';
import {UserMeWrapperComponent} from '../components/user/user-me-wrapper/user-me-wrapper.component';
import {AuthGuard} from '../guards/auth.guard';
import {AdminRoutingModule} from './admin-routing.module';


const routes: Routes = [
  {
    path: 'login',
    component: LoginSignInComponent,
    data: {title: 'Login'},
  },
  {
    path: 'home',
    component: BaseBlankComponent,
    data: {title: 'Home'},
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-up',
    component: LoginSignUpComponent,
    data: {title: 'Sign Up'},
  },
  {
    path: 'forgot-password',
    component: LoginForgotPasswordComponent,
    data: {title: 'Forgot Password'},
  },
  {
    path: 'password/reset/:email/:token',
    component: LoginResetPasswordComponent,
    data: {title: 'Forgot Password'},
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    data: {title: 'Terms Of Service'},
  },
  {
    path: 'user/account',
    component: UserMeWrapperComponent,
    data: {title: 'Account'},
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [
    AdminRoutingModule,
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard,
  ],
})
export class AppRoutingModule {
}
