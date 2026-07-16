import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { loginPage, catalogPage } from '@ddd-store/web-shared';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoading()) return true;
  if (auth.user()) return true;
  return router.createUrlTree([loginPage.path]);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user()) return router.createUrlTree([catalogPage.path]);
  return true;
};
