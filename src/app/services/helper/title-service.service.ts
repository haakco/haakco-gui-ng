import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ConstantAppConfig} from '../../constants/ConstantAppConfig';

@Injectable({
  providedIn: 'root',
})
export class TitleServiceService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
  }

  setTitle() {
    this
      .router
      .events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      )
      .subscribe((event) => {
        const pageTile = `${ConstantAppConfig.appName}: ${event.title}`;
        this.titleService.setTitle(pageTile);
      });
  }
}
