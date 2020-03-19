import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminUsersComponent} from '../components/admin/admin-users/admin-users.component';
import {AuthGuard} from '../guards/auth.guard';


const routes: Routes = [
  {
    path: 'admin/users',
    redirectTo: 'admin/users/',
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/users/:userUuid',
    component: AdminUsersComponent,
    data: {title: 'Admin Manage Users'},
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    AuthGuard,
  ],
})
export class AdminRoutingModule {
}
