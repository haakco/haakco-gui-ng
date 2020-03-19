import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs/operators';
import {RouterGo} from '../actions/router.actions';


@Injectable()
export class RouteEffects {

  routerGo$ = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            RouterGo,
          ),
          tap(action => {
            this.router.navigate(action.path, {queryParams: action.queryParams, ...action.extras});
          }),
        ),
    {dispatch: false},
  );

  constructor(private actions$: Actions,
              private router: Router) {
  }
}
