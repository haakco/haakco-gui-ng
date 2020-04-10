import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {concatMap, tap, withLatestFrom} from 'rxjs/operators';
import {
  AuthLogin,
  AuthLoginGetUrlAfterLogin,
  AuthLoginSetToken,
  AuthLoginSetUrlAfterLogin,
  AuthLogout,
  AuthPasswordReset,
  AuthPasswordResetToken,
  AuthSignUp,
} from '../actions/auth.actions';
import {RouterGo} from '../actions/router.actions';
import {InterfaceStateApp} from '../reducers';
import {selectAuthState} from '../selectors/auth.selectors';
import {AuthService} from '../services/api/auth.service';

@Injectable()
export class AuthEffects {

  login$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthLogin,
          ),
          tap(action => {
            this.authService.login(action.payload);
          }),
        ),
    {dispatch: false},
  );

  logout$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthLogout,
          ),
          tap(() => {
            this.authService.logOut();
          }),
        ),
    {dispatch: false},
  );

  setToken$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthLoginSetToken,
          ),
          concatMap((action: any) => of(action)
            .pipe(
              withLatestFrom(this.store.pipe(select(selectAuthState))),
            )),
          tap(([action, authState]) => {
            this.authService.loadInitialAuthenticatedData();
            if (
              authState.urlAfterLogin && authState.urlAfterLogin.path && authState.urlAfterLogin.path.length > 0 &&
              authState.urlAfterLogin.path[0] !== 'login'
            ) {
              this.store.dispatch(AuthLoginSetUrlAfterLogin(null));
              this.store.dispatch(RouterGo(authState.urlAfterLogin));
            } else if (this.router.url.includes('/login')) {
              this.store.dispatch(
                RouterGo({
                           path: ['/home'],
                         }),
              );
            }
          }),
        ),
    {dispatch: false},
  );

  getUrl$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthLoginGetUrlAfterLogin,
          ),
          tap(() => {
            const pathAndQueryParameters = window.location.hash.split('?');
            const queryParams = {};
            if (pathAndQueryParameters[1]) {
              pathAndQueryParameters[1]
                .split('&')
                .map(queryParamFull => {
                  queryParamFull.split('=');
                  const queryParamSplit = queryParamFull.split('=');
                  queryParams[queryParamSplit[0]] = queryParamSplit[1] || '';
                });
            }
            const currentPath = pathAndQueryParameters[0].split('/');
            currentPath.splice(0, 1);

            if (currentPath[0] !== 'login') {
              this.store.dispatch(AuthLoginSetUrlAfterLogin({
                                                              payload: {
                                                                path: currentPath,
                                                                queryParams,
                                                              },
                                                            }));
            }
          }),
        ),
    {dispatch: false},
  );

  authSignUp$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthSignUp,
          ),
          tap(action => {
            this.authService.sigUp(action.payload);
          }),
        ),
    {dispatch: false},
  );

  authPasswordReset$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthPasswordReset,
          ),
          tap(action => {
            this.authService.sendPasswordResetEmail(action.payload);
          }),
        ),
    {dispatch: false},
  );

  authPasswordResetToken$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AuthPasswordResetToken,
          ),
          tap(action => {
            this.authService.sendPasswordResetToken(action.payload);
          }),
        ),
    {dispatch: false},
  );

  constructor(
    private actions$: Actions,
    private store: Store<InterfaceStateApp>,
    private authService: AuthService,
    private router: Router,
  ) {
  }
}
