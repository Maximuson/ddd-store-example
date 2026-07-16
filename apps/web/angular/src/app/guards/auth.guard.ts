import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { loginPage } from '@ddd-store/web-shared/auth/pages';
import { catalogPage } from '@ddd-store/web-shared/catalog/pages';
import { AuthService } from '../services/auth.service';
import { routePath } from '../route-path';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.whenReady;
  if (auth.user()) return true;
  return router.createUrlTree([routePath(loginPage.path)]);
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.whenReady;
  if (auth.user()) return router.createUrlTree([routePath(catalogPage.path)]);
  return true;
};
