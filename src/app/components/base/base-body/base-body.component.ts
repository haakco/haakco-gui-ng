import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterfaceStateApp} from '../../../reducers';
import {InterfaceStateAuth} from '../../../reducers/auth.reducer';
import {selectAuthState} from '../../../selectors/auth.selectors';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrls: ['./base-body.component.scss'],
})
export class BaseBodyComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();
  authState$: Observable<InterfaceStateAuth>;

  constructor(private store: Store<InterfaceStateApp>) {
    this.authState$ = this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.stop$));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }

}
