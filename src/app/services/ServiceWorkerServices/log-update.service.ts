import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class LogUpdateService {

  constructor(
    private logger: NGXLogger,
    private updates: SwUpdate,
  ) {
    this.updates.available.subscribe(event => {
      this.logger.debug(`${this.constructor.name}: current version is`, event.current);
      this.logger.debug(`${this.constructor.name}: available version is`, event.available);
    });
    this.updates.activated.subscribe(event => {
      this.logger.debug(`${this.constructor.name}: old version was`, event.previous);
      this.logger.debug(`${this.constructor.name}: new version is`, event.current);
    });
  }
}
