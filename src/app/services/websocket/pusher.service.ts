import {Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {NGXLogger} from 'ngx-logger';
import * as Pusher from 'pusher-js';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConstantAppConfig} from '../../constants/ConstantAppConfig';
import {ConstantPusherConfig} from '../../constants/ConstantPusherConfig';
import {InterfaceToken} from '../../interfaces/InterfaceToken';
import {InterfaceStateApp} from '../../reducers';
import {selectAuthToken, selectAuthUserUuid} from '../../selectors/auth.selectors';
import {WindowRef} from '../helper/window-ref.service';

@Injectable({
              providedIn: 'root',
            })
export class PusherService implements OnDestroy {

  token: InterfaceToken | null;
  token$: Observable<InterfaceToken>;

  userUuid: string;
  userUuid$: Observable<string>;

  baseUrl = '';
  private stop$: Subject<boolean> = new Subject();

  pusher;
  channel;

  constructor(
    private logger: NGXLogger,
    private store: Store<InterfaceStateApp>,
    private winRef: WindowRef,
  ) {
    if (ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname]) {
      this.baseUrl = ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname];
    } else {
      this.baseUrl = ``;
    }
    this.baseUrl += `${ConstantAppConfig.apiBasePath}/broadcasting/auth`;

    this.token$ = this.store
      .pipe(select(selectAuthToken))
      .pipe(takeUntil(this.stop$));

    this.userUuid$ = this.store
      .pipe(select(selectAuthUserUuid))
      .pipe(takeUntil(this.stop$));

    this.token$
      .subscribe((token: InterfaceToken) => {
        this.token = token;
        this.initialise();
      });

    this.userUuid$
      .subscribe((userUuid: string) => {
        this.userUuid = userUuid;
        this.initialise();
      });
  }

  initialise() {
    if (this.token && this.userUuid && ConstantPusherConfig.enabled) {

      if (this.pusher && this.pusher.disconnect) {
        this.pusher.disconnect();
      }

      this.pusher = new Pusher.default(ConstantPusherConfig.devKey, {
        cluster: ConstantPusherConfig.cluster,
        encrypted: true,
        authEndpoint: this.baseUrl,
        auth: {
          headers: {
            Authorization: `Bearer ${this.token.access_token}`,
          },
          params: {}
        },
      });

      // this.logger.debug('private-user.' + this.userUuid);

      this.channel = this.pusher.subscribe('private-user.' + this.userUuid);

      this.channel.bind(
        'UserNotifyEvent',
        (data) => {
          this.logger.debug(data);
        },
      );
    }
  }

  ngOnDestroy(): void {
    if (this.pusher && this.pusher.disconnect) {
      this.pusher.disconnect();
    }
    this.stop$.next(true);
  }
}
