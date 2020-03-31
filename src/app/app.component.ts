import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {NgxPermissionsService} from 'ngx-permissions';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterfaceUsersObject} from './interfaces/InterfaceUsersObject';
import {InterfaceStateApp} from './reducers';
import {InterfaceStateAuth} from './reducers/auth.reducer';
import {InterfaceStateLayout} from './reducers/layout.reducer';
import {selectAuthState} from './selectors/auth.selectors';
import {selectLayoutState} from './selectors/layout.selectors';
import {AuthService} from './services/api/auth.service';
import {TitleServiceService} from './services/helper/title-service.service';
import {PusherService} from './services/websocket/pusher.service';

@Component({
             selector: 'app-root',
             templateUrl: './app.component.html',
             styleUrls: ['./app.component.scss'],
           })
export class AppComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();

  layoutState$: Observable<InterfaceStateLayout>;
  authState$: Observable<InterfaceStateAuth>;
  users$: Observable<InterfaceUsersObject>;

  constructor(
    private store: Store<InterfaceStateApp>,
    private authService: AuthService,
    private permissionsService: NgxPermissionsService,
    private titleServiceService: TitleServiceService,
    private pusherService: PusherService,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
  ) {
    angulartics2GoogleAnalytics.startTracking();
    this.layoutState$ = this.store
      .select(selectLayoutState)
      .pipe(takeUntil(this.stop$));

    this.authState$ = this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.stop$));

    authService.loadInitialData();
  }

  ngOnInit() {
    this.titleServiceService.setTitle();
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }
}
