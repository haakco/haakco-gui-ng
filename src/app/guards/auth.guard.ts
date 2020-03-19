import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AuthLoginGetUrlAfterLogin} from '../actions/auth.actions';
import {EnumAuthPages} from '../enums/EnumAuthPages';
import {InterfaceStateApp} from '../reducers';
import {selectAuthLoggedIn} from '../selectors/auth.selectors';
import {AuthService} from '../services/api/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  loggedIn = false;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<InterfaceStateApp>) {
    this.store
      .select(selectAuthLoggedIn)
      .subscribe((loggedIn) => {
        this.loggedIn = loggedIn;
      });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin(state);
  }

  checkLogin(state: RouterStateSnapshot): boolean {

    this.store.dispatch(AuthLoginGetUrlAfterLogin());
    if (this.loggedIn) {
      return true;
    }

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

    this.store.dispatch(AuthLoginGetUrlAfterLogin());

    if (currentPath[0] in EnumAuthPages) {
      return true;
    }

    // Navigate to the login page with extras
    this.router.navigate(['login']);
    return false;
  }
}
