import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import filter from 'lodash-es/filter';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {UserLoadAllUsersDetails} from '../../../actions/user.actions';
import {InterfaceUsersObject} from '../../../interfaces/InterfaceUsersObject';
import {InterfaceStateApp} from '../../../reducers';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss'],
})
export class AdminUsersListComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();
  _users: InterfaceUsersObject;

  @Input() set users(users: InterfaceUsersObject) {
    this._users = users;
    this.filterUsers();
  }

  filteredUserUuids: string[];

  private routeSub$: Subscription;

  userFilter = '';
  filterChanged: Subject<string> = new Subject<string>();

  constructor(
    private store: Store<InterfaceStateApp>,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.store.dispatch(UserLoadAllUsersDetails());

    this.routeSub$ = this.activeRoute.queryParamMap
      .pipe(
        takeUntil(this.stop$),
      )
      .subscribe(
        (paramMap: ParamMap) => {
          this.userFilter = paramMap.get('userFilter') || '';
          this.filterUsers();
        });

    this.filterChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((userFilter: string) => {
        this.router.navigate(
          [],
          {
            relativeTo: this.activeRoute,
            queryParams: {userFilter: this.userFilter},
            queryParamsHandling: 'merge',
          });
      });
  }

  ngOnInit() {
  }

  filterInputChange(filterTxt) {
    this.userFilter = filterTxt;
    this.filterChanged.next(filterTxt);
  }

  filterUsers() {
    this.filteredUserUuids = filter(this._users, (user) => {
      return this.userFilter === '' || user.name
        .toLowerCase()
        .indexOf(this.userFilter) !== -1;
    }).map(user => user.uuid);
  }

  ngOnDestroy(): void {
    this.stop$.next(true);
  }
}
