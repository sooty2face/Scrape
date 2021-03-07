import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './domain/Auth/login';
import { AuthGuard } from './domain/Auth/_helpers';
import { FolderPage } from './folder/folder.page';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'login',
    loadChildren: () => import('./domain/Auth/login/login-routing.module').then((m) => m.LoginRoutingModule),
  },
  {
    path: 'Dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard/dashboard.-routing.module').then((m) => m.DashboardRoutingModule),
    canActivate: [AuthGuard],
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LoginComponent
];
