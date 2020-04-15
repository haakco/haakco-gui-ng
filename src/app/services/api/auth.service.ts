import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {NGXLogger} from 'ngx-logger';
import {NgxPermissionsService} from 'ngx-permissions';
import {finalize, first} from 'rxjs/operators';
import {AuthLoginSetToken, AuthLoginSubmit, AuthLogout} from '../../actions/auth.actions';
import {RouterGo} from '../../actions/router.actions';
import {UserLoadMyUserDetails} from '../../actions/user.actions';
import {ConstantAuth} from '../../constants/ConstantAuth';
import {EnumAlertTypes} from '../../enums/EnumAlertTypes';
import {InterfaceAuthDetails} from '../../interfaces/InterfaceAuthDetails';
import {InterfaceToken} from '../../interfaces/InterfaceToken';
import {InterfaceUser} from '../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../reducers';
import {selectAuthLoggedIn} from '../../selectors/auth.selectors';
import {AlertService} from '../helper/alert-service.service';
import {DataCachingService} from '../helper/data-caching.service';
import {HttpService} from '../helper/http.service';
import {WindowRef} from '../helper/window-ref.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user: InterfaceUser;
  loggedIn = false;
  token: InterfaceToken = null;

  private TOKEN_CACHE_KEY = 'AUTH_SERVICE_TOKEN';

  constructor(
    private logger: NGXLogger,
    private dataCachingService: DataCachingService,
    private httpService: HttpService,
    private store: Store<InterfaceStateApp>,
    private permissionsService: NgxPermissionsService,
    private winRef: WindowRef,
    private alertService: AlertService,
  )
  {
    this.store
      .select(selectAuthLoggedIn)
      .subscribe((loggedIn) => {
        this.loggedIn = loggedIn;
      });
  }

  loginStateChanged() {

  }

  login(authDetails: InterfaceAuthDetails) {
    const loginData = {
      grant_type: 'password',
      client_id: ConstantAuth.client_id,
      client_secret: ConstantAuth.client_secret,
      username: authDetails.email,
      password: authDetails.password,
      scope: ConstantAuth.scope,
    };

    this.store.dispatch(AuthLoginSubmit({payload: true}));

    // Custom error to hand strang auth failure message
    const customErrorFunction: (err: HttpErrorResponse) => boolean = (err: HttpErrorResponse) => {
      if (err.status === 400 &&
        err.error.error === 'invalid_grant') {
        this.alertService.addAlert('Login failed', EnumAlertTypes.ALERT_TYPE_DANGER, 'Error:');
        return true;
      }
      return false;
    };
    return this.httpService.postRequest('/oauth/token', loginData, 0, customErrorFunction)
      .pipe(finalize(() => {
        this.store.dispatch(AuthLoginSubmit({payload: false}));
      }))
      .subscribe((token: InterfaceToken) => {

        token.recieved_at = moment().unix();

        this.dataCachingService.save(this.TOKEN_CACHE_KEY, token, -1);

        this.logIn(token);
      });
  }

  logIn(token: InterfaceToken) {
    this.token = token;
    this.loggedIn = true;
    this.store.dispatch(
      AuthLoginSetToken({
        payload: token,
      }));
  }

  logOut() {
    this.httpService.getRequest('/logout')
      .subscribe(result => {
        this.logger.debug(`${this.constructor.name}: Logged out`);
      });
    this.store.dispatch(
      RouterGo({
        path: ['/login'],
      }),
    );
    this.permissionsService.flushPermissions();
    this.dataCachingService.clear();
  }

  loadInitialAuthenticatedData() {
    this.store.dispatch(UserLoadMyUserDetails());
  }

  loadInitialData() {
    this.hydrateAccessToken();
  }

  sigUp(signUpForm: InterfaceAuthDetails) {
    this.httpService.postRequest('/login/register', signUpForm)
      .subscribe((result: {
        success: {
          access_token: string,
          name: string,
          uuid: string,
        }
      }) => {
        this.alertService.addAlert('You are now registered.<br> Please login.', EnumAlertTypes.ALERT_TYPE_SUCCESS);
        const token = {
          recieved_at: moment().unix(),
          access_token: result.success.access_token,
        };

        // this.dataCachingService.save(this.TOKEN_CACHE_KEY, token, -1);
        //
        // this.logIn(token);
        this.store.dispatch(
          RouterGo({
            path: ['/login'],
          }),
        );
      });
  }

  sendPasswordResetEmail(resetForm: InterfaceAuthDetails) {
    this.httpService.postRequest('/login/password/forgot', resetForm)
      .subscribe((result: any) => {
        this.store.dispatch(
          RouterGo({
            path: ['/login'],
          }),
        );
        this.alertService.addAlert('Password Reset Email Sent', EnumAlertTypes.ALERT_TYPE_SUCCESS);
      });
  }

  sendPasswordResetToken(resetForm: InterfaceAuthDetails) {
    this.httpService.postRequest(`/login/password/reset`, resetForm)
      .subscribe((result: any) => {
        this.store.dispatch(
          RouterGo({
            path: ['/login'],
          }),
        );
        this.alertService.addAlert('Password Reset', EnumAlertTypes.ALERT_TYPE_SUCCESS);
      });
  }

  private hydrateAccessToken() {
    this.dataCachingService
      .getSavedItem(this.TOKEN_CACHE_KEY)
      .pipe(
        first(),
      )
      .subscribe((token: InterfaceToken) => {
        if (token) {
          this.logIn(token);
        } else {
          this.store.dispatch(
            AuthLogout(),
          );
        }
      }, (err) => {
        console.error(err);
      });
  }
}
