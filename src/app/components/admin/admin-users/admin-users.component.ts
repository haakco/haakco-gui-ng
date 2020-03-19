import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserLoadAllUsersDetails} from '../../../actions/user.actions';
import {InterfaceUsersObject} from '../../../interfaces/InterfaceUsersObject';
import {InterfaceStateApp} from '../../../reducers';
import {selectUserUsers} from '../../../selectors/user.selectors';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();

  users$: Observable<InterfaceUsersObject>;
  users: InterfaceUsersObject;
  userUuid: string;

  private routeSub$: Subscription;

  constructor(
    private store: Store<InterfaceStateApp>,
    private route: ActivatedRoute,
  ) {
    this.store.dispatch(UserLoadAllUsersDetails());

    this.routeSub$ = this.route.paramMap
      .pipe(
        takeUntil(this.stop$),
      )
      .subscribe(
        (paramMap: ParamMap) => {
          this.userUuid = paramMap.get('userUuid');
          this.setData();
        });

    this.users$ = this.store
      .select(selectUserUsers)
      .pipe(takeUntil(this.stop$));
  }

  ngOnInit() {
  }

  setData() {
  }

  ngOnDestroy(): void {
    this.stop$.next(true);
  }

}
