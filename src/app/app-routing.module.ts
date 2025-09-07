import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/authGuard';
import { AdminGuard } from '../services/adminGuard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'admin.home',
    loadChildren: () =>
      import('./pages/admin.home/admin.home.module').then(
        (m) => m.AdminHomePageModule
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'activate-account/:token',
    loadChildren: () =>
      import('./pages/activate-account/activate-account.module').then(
        (m) => m.ActivateAccountPageModule
      ),
  },
  {
    path: 'reset-password/:token',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
