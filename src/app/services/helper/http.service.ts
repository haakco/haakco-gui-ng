import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {saveAs} from 'file-saver';
import isEmpty from 'lodash-es/isEmpty';
import {Observable, of, Subject, throwError as observableThrowError} from 'rxjs';
import {catchError, takeUntil} from 'rxjs/operators';
import {AuthLogout} from '../../actions/auth.actions';
import {ConstantAppConfig} from '../../constants/ConstantAppConfig';
import {EnumAlertTypes} from '../../enums/EnumAlertTypes';
import {InterfaceToken} from '../../interfaces/InterfaceToken';
import {InterfaceStateApp} from '../../reducers';
import {selectAuthToken} from '../../selectors/auth.selectors';
import {AlertService} from './alert-service.service';
import {DataCachingService} from './data-caching.service';
import {WindowRef} from './window-ref.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements OnDestroy {

  token: InterfaceToken | null;
  token$: Observable<InterfaceToken>;
  baseUrl = '';
  private stop$: Subject<boolean> = new Subject();

  constructor(
    private dataCachingService: DataCachingService,
    private http: HttpClient,
    private store: Store<InterfaceStateApp>,
    private winRef: WindowRef,
    private alertService: AlertService,
  ) {
    if (ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname]) {
      this.baseUrl = ConstantAppConfig.apiBaseUrl[this.winRef.nativeWindow.location.hostname];
    } else {
      this.baseUrl = ``;
    }
    this.baseUrl += ConstantAppConfig.apiBasePath;
    this.token$ = this.store
      .pipe(select(selectAuthToken))
      .pipe(takeUntil(this.stop$));

    this.token$
      .subscribe((token: InterfaceToken) => {
        this.token = token;
      });
  }

  getHTTPHeaders(acceptMimeType = 'application/json', contentType = 'application/json'): HttpHeaders {

    const headers = {
      Accept: acceptMimeType,
      Authorization: '',
    };

    if (contentType !== null && contentType !== '') {
      headers['Content-Type'] = contentType;
    }

    if (
      this.token !== null &&
      !isEmpty(this.token.access_token) &&
      this.token.access_token !== ''
    ) {
      headers.Authorization = `Bearer ${this.token.access_token}`;
    }

    return new HttpHeaders(headers);
  }

  getRequest(url: string, cacheTimeSeconds = 0, revalidate = false) {

    const fetchUrl = this.baseUrl + url;
    const cacheKey = `request: ${fetchUrl}`;

    if (revalidate) {
      this.dataCachingService.removeSavedItem(cacheKey);
    }

    return new Observable(observer => {
      const requestOptions = {
        headers: this.getHTTPHeaders(),
      };

      let result;

      if (cacheTimeSeconds > 0) {
        result = this.dataCachingService.getSavedItem(cacheKey);
      } else {
        result = of(null);
      }

      result
        .subscribe((dataResult: any) => {
          if (dataResult !== null) {
            observer.next(dataResult);
            observer.complete();
          } else {
            return this.http
              .get(fetchUrl, requestOptions)
              .pipe(
                catchError(this.handleError.bind(this)),
                takeUntil(this.stop$),
              )
              .subscribe((httpResult) => {
                if (cacheTimeSeconds > 0) {
                  this.dataCachingService.save(cacheKey, httpResult, cacheTimeSeconds);
                }
                observer.next(httpResult);
                observer.complete();
              });
          }
        });
    });
  }

  getDownload(url: string, acceptMimeType = 'application/json') {
    return new Observable(observer => {
      const fetchUrl = this.baseUrl + url;

      return this.http
        .get(fetchUrl, {
          headers: this.getHTTPHeaders(acceptMimeType),
          observe: 'response',
          responseType: 'blob',
        })
        .pipe(
          catchError(this.handleError.bind(this)),
          takeUntil(this.stop$),
        )
        .subscribe((httpResult: HttpResponse<Blob>) => {
          this.saveFile(httpResult, 'download');
          observer.complete();
        });
    });
  }

  postRequest(url: string, body: any, cacheTimeSeconds = 0) {

    return new Observable(observer => {

      const fetchUrl = this.baseUrl + url;
      const cacheKey = ` request: ${fetchUrl} - ${JSON.stringify(body)}`;
      let result;

      const requestOptions = {
        headers: this.getHTTPHeaders(),
      };

      if (cacheTimeSeconds > 0) {
        result = this.dataCachingService.getSavedItem(cacheKey);
      } else {
        result = of(null);
      }

      result
        .subscribe((dataResult: any) => {
          if (dataResult !== null) {
            observer.next(dataResult);
            observer.complete();
          } else {
            return this.http
              .post(this.baseUrl + url, body, requestOptions)
              .pipe(
                catchError(this.handleError.bind(this)),
                takeUntil(this.stop$),
              )
              .subscribe((httpResult) => {
                if (cacheTimeSeconds > 0) {
                  this.dataCachingService.save(cacheKey, httpResult, cacheTimeSeconds);
                }
                observer.next(httpResult);
                observer.complete();
              }, (error: any) => {
                observer.complete();
              });
          }
        });
    });
  }

  postDownload(url: string, body: any, acceptMimeType = 'application/json') {
    return new Observable(observer => {
      const fullUrl = this.baseUrl + url;

      return this.http
        .post(fullUrl, body, {
          headers: this.getHTTPHeaders(acceptMimeType),
          observe: 'response',
          responseType: 'blob',
        })
        .pipe(
          catchError(this.handleError.bind(this)),
          takeUntil(this.stop$),
        )
        .subscribe((httpResult) => {
          this.saveFile(httpResult, 'download');
          observer.complete();
        });
    });
  }

  postUpload(url: string, body: FormData, acceptMimeType = 'application/json') {

    return new Observable(observer => {
      const fullUrl = this.baseUrl + url;
      return this.http
        .post(fullUrl, body, {
          headers: this.getHTTPHeaders(acceptMimeType, ''),
          params: new HttpParams(),
          reportProgress: true,
        })
        .pipe(
          catchError(this.handleError.bind(this)),
        )
        .subscribe((httpResult) => {
          observer.next(httpResult);
          observer.complete();
        });

    });
  }

  public postUploadFiles(
    files: Set<File>,
    url,
    postVariables: object = null,
    acceptMimeType = 'application/json',
  ): { [key: string]: { progress: Observable<number> } } {
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      Object.keys(postVariables)
        .forEach(key => {
          formData.append(key, postVariables[key]);
        });

      const fullUrl = this.baseUrl + url;

      const req = new HttpRequest(
        'POST',
        fullUrl,
        formData,
        {
          headers: this.getHTTPHeaders(acceptMimeType, ''),
          params: new HttpParams(),
          reportProgress: true,
        });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req)
        .pipe(
          catchError(this.handleError.bind(this)),
        )
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {

            // calculate the progress percentage
            const percentDone = Math.round(100 * event.loaded / event.total);

            // pass the percentage into the progress-stream
            progress.next(percentDone);
          } else if (event instanceof HttpResponse) {

            // Close the progress-stream if we get an answer form the API
            // The upload is complete
            progress.complete();
          }
        }, (error: any) => {
          console.log(error);
          progress.error(error);
        });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
      };
    });

    // return the map of progress.observables
    return status;
  }

  deleteRequest(url: string, body?: any) {
    return new Observable(observer => {
      const requestOptions = {
        headers: this.getHTTPHeaders(),
        body: body ? body : null,
      };

      const fetchUrl = this.baseUrl + url;

      return this.http
        .delete(fetchUrl, requestOptions)
        .pipe(
          catchError(this.handleError.bind(this)),
          takeUntil(this.stop$),
        )
        .subscribe((httpResult) => {
          observer.next(httpResult);
          observer.complete();
        }, (error: any) => {
          observer.complete();
        });
    });
  }

  putRequest(url: string, body: any) {
    return new Observable(observer => {
      const requestOptions = {
        headers: this.getHTTPHeaders(),
      };

      const fetchUrl = this.baseUrl + url;

      return this.http
        .put(fetchUrl, body, requestOptions)
        .pipe(
          catchError(this.handleError.bind(this)),
          takeUntil(this.stop$),
        )
        .subscribe((httpResult) => {
          observer.next(httpResult);
          observer.complete();
        });
    });
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }

  private parseContentDisposition(httpHeaders: HttpHeaders, alternativeName = '') {
    const contentDisposition = httpHeaders.get('content-disposition');
    if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return alternativeName;
  }

  private saveFile(httpResult: HttpResponse<Blob>, alternativeName: string = 'downloadFile') {

    const blobContent: Blob = httpResult.body;
    const downloadFileName = this.parseContentDisposition(httpResult.headers, alternativeName);
    const blob = new Blob([blobContent], {type: 'application/octet-stream'});
    saveAs(blob, downloadFileName);
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong';
    if (error &&
      error.status &&
      (
        error.status === 401
      )
    ) {
      if (error.error && error.error.message) {
        message = error.error.message;
      } else {
        message = 'Not authorised';
      }
      this.store.dispatch(
        AuthLogout(),
      );
    } else {
      if (error.error && error.error.message) {
        if (error.error.errors && error.error.errors.description) {
          message = error.error.errors.description;
        } else if (error.error.errors) {
          message = '';
          Object.keys(error.error.errors)
            .map((errorKey) => {
              error.error.errors[errorKey]
                .map((errorString) => {
                  message += errorString;
                });
            });
        } else {
          message = error.error.message;
        }
      }
    }
    this.alertService.addAlert(message, EnumAlertTypes.ALERT_TYPE_DANGER, 'Error:');
    return observableThrowError(error);
  }

}
