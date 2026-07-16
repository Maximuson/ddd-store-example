import { Routes } from '@angular/router';
import { loginPage } from '@ddd-store/web-shared/auth/pages';
import { catalogPage, productPage } from '@ddd-store/web-shared/catalog/pages';
import { profilePage } from '@ddd-store/web-shared/users/pages';
import { adminPage } from '@ddd-store/web-shared/admin/pages';
import { authGuard, guestGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { routePath } from './route-path';

const catalogRoute = routePath(catalogPage.path);
const loginRoute = routePath(loginPage.path);

export const routes: Routes = [
  {
    path: loginRoute,
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-layout.component').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: catalogRoute,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then((m) => m.CatalogPageComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./features/catalog/product-page.component').then((m) => m.ProductPageComponent),
      },
      {
        path: routePath(profilePage.path),
        loadComponent: () =>
          import('./features/users/profile-page.component').then((m) => m.ProfilePageComponent),
      },
      {
        path: routePath(adminPage.path),
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-page.component').then((m) => m.AdminPageComponent),
      },
      { path: '', redirectTo: catalogRoute, pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: loginRoute },
];
