import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catalogPage } from '@ddd-store/web-shared/catalog/pages';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();
  if (user?.isAdmin()) return true;
  return router.createUrlTree([catalogPage.path]);
};
