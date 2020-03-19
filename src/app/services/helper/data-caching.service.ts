import {Injectable} from '@angular/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataCachingService {

  constructor(protected storageMap: StorageMap) {
  }

  save(cacheKey: string, item: any, cacheTimeSeconds = 60) {

    const cacheObject = {
      created_at: moment(),
      item,
      cacheTime: cacheTimeSeconds,
    };

    return this
      .storageMap
      .set(cacheKey, JSON.stringify(cacheObject))
      .subscribe(() => {
      }, (err) => {
        console.error(err);
      });
  }

  removeSavedItem(cacheKey: string) {
    return this
      .storageMap
      .delete(cacheKey)
      .subscribe(() => {
      }, (err) => {
        console.error(err);
      });
  }

  getSavedItem(cacheKey: string): Observable<any> {
    return this.storageMap
      .get(cacheKey)
      .pipe(map((data: any) => {
        if (data !== undefined) {
          let item;
          if (data && data.value) {
            item = JSON.parse(data.value);
          } else {
            item = JSON.parse(data);
          }
          if (
            item.cacheTime < 0 ||
            moment().diff(moment(item.created_at), 'seconds') < item.cacheTime
          ) {
            return item.item;
          }
        }
        return null;
      }));
  }

  clear() {
    return this
      .storageMap
      .clear()
      .subscribe(() => {
      }, (err) => {
        console.error(err);
      });
  }
}
