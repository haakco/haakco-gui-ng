import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs/operators';
import {AlertAdd} from '../actions/alert.actions';
import {AlertService} from '../services/helper/alert-service.service';


@Injectable()
export class AlertEffects {

  addAlert = createEffect(
    () =>
      this.actions$
        .pipe(
          ofType(
            AlertAdd,
          ),
          tap(action => {
            this.alertService.addAlert(
              action.payload.message,
              action.payload.type,
              action.payload.head,
            );
          }),
        ),
    {dispatch: false},
  );

  constructor(
    private actions$: Actions,
    private alertService: AlertService,
  ) {
  }

}
