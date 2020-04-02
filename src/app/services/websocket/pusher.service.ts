import {Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import Echo from 'laravel-echo';
import {NGXLogger} from 'ngx-logger';
import * as Pusher from 'pusher-js';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConstantAppConfig} from '../../constants/ConstantAppConfig';
import {ConstantPusherConfig} from '../../constants/ConstantPusherConfig';
import {InterfaceAlert} from '../../interfaces/InterfaceAlert';
import {InterfaceToken} from '../../interfaces/InterfaceToken';
import {InterfaceStateApp} from '../../reducers';
import {selectAuthToken, selectAuthUserUuid} from '../../selectors/auth.selectors';
import {AlertService} from '../helper/alert-service.service';
import {WindowRef} from '../helper/window-ref.service';

@Injectable({
  providedIn: 'root',
})
export class PusherService implements OnDestroy {

  token: InterfaceToken | null;
  token$: Observable<InterfaceToken>;

  userUuid: string;
  userUuid$: Observable<string>;

  authEndPoint = '';
  private stop$: Subject<boolean> = new Subject();

  pusher;
  echo;

  constructor(
    private logger: NGXLogger,
    private store: Store<InterfaceStateApp>,
    private winRef: WindowRef,
    private alertService: AlertService,
  )
  {
    if (ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname]) {
      this.authEndPoint = ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname];
    } else {
      this.authEndPoint = ``;
    }
    this.authEndPoint += `${ConstantAppConfig.apiBasePath}/broadcasting/auth`;

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
    if (ConstantPusherConfig.enabled) {
      if (this.echo) {
        this.echo.disconnect();
      }
      if (this.token && this.userUuid) {
        // this.logger.debug(`${this.constructor.name}: Required data is available to initialise echo`);
        if (ConstantPusherConfig.useEcho) {
          this.initialiseEcho();
        } else {
          this.initialisePusher();
        }
      }
    }
  }

  initialiseEcho() {
    this.logger.debug(`${this.constructor.name}: Trying to initialise echo`);
    this.echo = new Echo(
      {
        host: 'http://dev.haak.co:6001',
        broadcaster: 'socket.io',
        // key: ConstantPusherConfig.key,
        auth: {
          headers: {
            Authorization: `Bearer ${this.token.access_token}`,
          },
          params: {},
        },
      });

    this.bindUserDirectMessageChannel();
  }

  initialisePusher() {
    this.logger.debug(`${this.constructor.name}: Trying to initialise pusher`);

    if (this.pusher && this.pusher.disconnect) {
      this.pusher.disconnect();
    }

    this.pusher = new Pusher.default(ConstantPusherConfig.key, {
      cluster: ConstantPusherConfig.cluster,
      encrypted: true,
      authEndpoint: this.authEndPoint,
      auth: {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
        },
        params: {},
      },
    });

    this.echo = new Echo(
      {
        broadcaster: 'pusher',
        key: ConstantPusherConfig.key,
        client: this.pusher,
      });
    this.bindUserDirectMessageChannel();
  }

  bindUserDirectMessageChannel() {
    if (this.echo) {
      // this.logger.debug(`${this.constructor.name}: private-user.${this.userUuid}`);
      this.echo.connect();
      const channel = this.echo
        .private('user.' + this.userUuid);
      channel
        .listen('UserNotifyEvent', (alert: InterfaceAlert) => {
          this.alertService.addAlert(alert.message, alert.alertType);
        });
    } else {
      // this.logger.debug(`Invalid broadcaster`);
    }

  }

  ngOnDestroy(): void {
    if (this.pusher && this.pusher.disconnect) {
      if (this.pusher) {
        this.pusher.disconnect();
      }
      if (this.echo) {
        console.log('disconet');
        this.echo.disconnect();
      }
    }
    this.stop$.next(true);
  }
}
