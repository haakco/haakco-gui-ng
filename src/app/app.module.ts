import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons/faEnvelope';
import {faFilter} from '@fortawesome/free-solid-svg-icons/faFilter';
import {faGripVertical} from '@fortawesome/free-solid-svg-icons/faGripVertical';
import {faHome} from '@fortawesome/free-solid-svg-icons/faHome';
import {faKey} from '@fortawesome/free-solid-svg-icons/faKey';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {faSignature} from '@fortawesome/free-solid-svg-icons/faSignature';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {faTachometerAlt} from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import {faTh} from '@fortawesome/free-solid-svg-icons/faTh';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import {faUndo} from '@fortawesome/free-solid-svg-icons/faUndo';
import {faUpload} from '@fortawesome/free-solid-svg-icons/faUpload';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons/faUserCircle';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {faUsersCog} from '@fortawesome/free-solid-svg-icons/faUsersCog';
import {faUserTag} from '@fortawesome/free-solid-svg-icons/faUserTag';
import {EffectsModule} from '@ngrx/effects';
import {RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StorageModule} from '@ngx-pwa/local-storage';
import {Angulartics2Module} from 'angulartics2';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {MomentModule} from 'ngx-moment';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgPipesModule} from 'ngx-pipes';
import {ToastrModule} from 'ngx-toastr';
import {environment} from '../environments/environment';
import {AngularMaterialModule} from './angular-material.module';
import {AppComponent} from './app.component';
import {AdminUsersListComponent} from './components/admin/admin-users-list/admin-users-list.component';
import {AdminUsersComponent} from './components/admin/admin-users/admin-users.component';
import {BaseBlankComponent} from './components/base/base-blank/base-blank.component';
import {BaseBodyComponent} from './components/base/base-body/base-body.component';
import {BaseFooterComponent} from './components/base/base-footer/base-footer.component';
import {BaseHeadComponent} from './components/base/base-head/base-head.component';
import {TermsOfServiceComponent} from './components/base/terms-of-service/terms-of-service.component';
import {FileUploadDialogComponent} from './components/helper/file-upload/file-upload-dialog/file-upload-dialog.component';
import {FileUploadComponent} from './components/helper/file-upload/file-upload.component';
import {LoginForgotPasswordComponent} from './components/login/login-forgot-password/login-forgot-password.component';
import {LoginResetPasswordComponent} from './components/login/login-reset-password/login-reset-password.component';
import {LoginSignInComponent} from './components/login/login-sign-in/login-sign-in.component';
import {LoginSignUpComponent} from './components/login/login-sign-up/login-sign-up.component';
import {UserAccountInfoComponent} from './components/user/user-account-info/user-account-info.component';
import {UserAccountRightsComponent} from './components/user/user-account-rights/user-account-rights.component';
import {UserAccountSettingsComponent} from './components/user/user-account-settings/user-account-settings.component';
import {UserAccountComponent} from './components/user/user-account/user-account.component';
import {UserChangePasswordComponent} from './components/user/user-change-password/user-change-password.component';
import {UserMeWrapperComponent} from './components/user/user-me-wrapper/user-me-wrapper.component';
import {UserRolesComponent} from './components/user/user-roles/user-roles.component';
import {AlertEffects} from './effects/alert.effects';
import {AuthEffects} from './effects/auth.effects';
import {RouteEffects} from './effects/route.effects';
import {UserEffects} from './effects/user.effects';

import {metaReducers, reducers} from './reducers';

import {AppRoutingModule} from './routes/app-routing.module';
import {CheckForUpdateService} from './services/ServiceWorkerServices/check-for-update.service';
import {LogUpdateService} from './services/ServiceWorkerServices/log-update.service';

@NgModule({
            declarations: [
              AppComponent,
              BaseBlankComponent,
              BaseBodyComponent,
              BaseHeadComponent,
              FileUploadDialogComponent,
              LoginForgotPasswordComponent,
              LoginSignInComponent,
              LoginSignUpComponent,
              TermsOfServiceComponent,
              BaseFooterComponent,
              LoginResetPasswordComponent,
              UserAccountComponent,
              UserAccountRightsComponent,
              UserAccountInfoComponent,
              UserAccountSettingsComponent,
              AdminUsersComponent,
              UserMeWrapperComponent,
              AdminUsersListComponent,
              FileUploadComponent,
              UserChangePasswordComponent,
              UserRolesComponent,
            ],
            imports: [
              Angulartics2Module.forRoot(),
              AngularMaterialModule,
              AppRoutingModule,
              BrowserAnimationsModule,
              BrowserModule.withServerTransition({appId: 'serverApp'}),
              DragDropModule,
              EffectsModule.forRoot(
                [
                  AlertEffects,
                  AuthEffects,
                  RouteEffects,
                  UserEffects,
                ]),
              FontAwesomeModule,
              FormsModule,
              FlexLayoutModule,
              HttpClientModule,
              HammerModule,
              LoggerModule.forRoot({
                                     level: (environment.production ? NgxLoggerLevel.ERROR : NgxLoggerLevel.DEBUG),
                                     // serverLoggingUrl: '/api/logs',
                                     serverLogLevel: NgxLoggerLevel.OFF,
                                     disableConsoleLogging: environment.production,
                                     enableSourceMaps: !environment.production,
                                   }),
              MomentModule.forRoot(),
              NgPipesModule,
              NgxPermissionsModule.forRoot(),
              RouterModule,
              ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
              StorageModule.forRoot({
                                      IDBNoWrap: true,
                                    }),
              StoreModule.forRoot(
                reducers,
                {
                  metaReducers,
                  runtimeChecks: {
                    strictStateImmutability: true,
                    strictActionImmutability: true,
                    strictStateSerializability: true,
                    strictActionSerializability: true,
                  },
                },
              ),
              StoreDevtoolsModule.instrument({
                                               maxAge: 25, // Retains last 25 states
                                               logOnly: environment.production, // Restrict extension to log-only mode
                                             }),
              StoreRouterConnectingModule.forRoot({
                                                    routerState: RouterState.Minimal,
                                                  }),
              StorageModule.forRoot({IDBNoWrap: true}),
              ToastrModule.forRoot(),
            ],
            providers: [
              CheckForUpdateService,
              LogUpdateService,
            ],
            bootstrap: [AppComponent],
            schemas: [NO_ERRORS_SCHEMA],
          })
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faAngleLeft,
      faBars,
      faEdit,
      faEnvelope,
      faFilter,
      faGripVertical,
      faHome,
      faKey,
      faLock,
      faSave,
      faSignature,
      faSignInAlt,
      faSignOutAlt,
      faTachometerAlt,
      faTimesCircle,
      faTh,
      faUpload,
      faUndo,
      faUser,
      faUserCircle,
      faUserPlus,
      faUsers,
      faUsersCog,
      faUserTag,
    );
  }
}
