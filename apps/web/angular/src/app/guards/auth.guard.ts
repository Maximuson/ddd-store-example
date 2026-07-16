import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { loginPage } from '@ddd-store/web-shared/auth/pages';
import { catalogPage } from '@ddd-store/web-shared/catalog/pages';
import { AuthService } from '../services/auth.service';

async function waitForAuthReady(auth: AuthService, maxMs = 10_000) {
  const deadline = Date.now() + maxMs;
  while (auth.isLoading() && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await waitForAuthReady(auth);
  if (auth.user()) return true;
  return router.createUrlTree([loginPage.path]);
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await waitForAuthReady(auth);
  if (auth.user()) return router.createUrlTree([catalogPage.path]);
  return true;
};
