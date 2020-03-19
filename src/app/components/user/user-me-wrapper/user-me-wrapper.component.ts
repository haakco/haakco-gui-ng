import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';
import {InterfaceStateApp} from '../../../reducers';
import {selectAuthUser} from '../../../selectors/auth.selectors';

@Component({
  selector: 'app-user-me-wrapper',
  templateUrl: './user-me-wrapper.component.html',
  styleUrls: ['./user-me-wrapper.component.scss']
})
export class UserMeWrapperComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();

  user$: Observable<InterfaceUser>;

  constructor(
    private store: Store<InterfaceStateApp>,
  ) {
    this.user$ = this.store
      .select(selectAuthUser)
      .pipe(takeUntil(this.stop$));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }

}
