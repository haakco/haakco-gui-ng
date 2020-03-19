import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {NGXLogger} from 'ngx-logger';
import {interval} from 'rxjs';

@Injectable()
export class CheckForUpdateService {

  constructor(private logger: NGXLogger,
              private updates: SwUpdate) {
    this.logger.debug('Checking for update');
    interval(6 * 60 * 1000).subscribe(() => this.updates.checkForUpdate());
  }
}
