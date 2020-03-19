import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InterfaceUser} from '../../../interfaces/InterfaceUser';

@Component({
             selector: 'app-user-account',
             templateUrl: './user-account.component.html',
             styleUrls: ['./user-account.component.scss'],
           })
export class UserAccountComponent implements OnInit, OnDestroy {

  private stop$: Subject<boolean> = new Subject();

  private routeSub$: Subscription;

  @Input() user: InterfaceUser;
  activeTab = 0;

  constructor( private router: Router,
               private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub$ = this.activeRoute.queryParamMap
      .pipe(
        takeUntil(this.stop$),
      )
      .subscribe(
        (paramMap: ParamMap) => {
          this.activeTab = +paramMap.get('activeTab') || 0;
        });
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }

  setSelectedValue(index) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activeRoute,
        queryParams: {activeTab: index},
        queryParamsHandling: 'merge',
      });
  }

}
