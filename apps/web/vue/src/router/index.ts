import { createRouter, createWebHistory } from 'vue-router';
import { loginPage } from '@ddd-store/web-shared/auth/pages';
import { catalogPage, productPage } from '@ddd-store/web-shared/catalog/pages';
import { profilePage } from '@ddd-store/web-shared/users/pages';
import { adminPage } from '@ddd-store/web-shared/admin/pages';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: loginPage.path,
      name: loginPage.id,
      component: () => import('../features/auth/LoginPage.vue'),
      meta: { guard: loginPage.guard, title: loginPage.title },
    },
    {
      path: '/',
      component: () => import('../app/AppLayout.vue'),
      children: [
        {
          path: catalogPage.path,
          name: catalogPage.id,
          component: () => import('../features/catalog/CatalogPage.vue'),
          meta: { guard: catalogPage.guard, title: catalogPage.title },
        },
        {
          path: productPage.path,
          name: productPage.id,
          component: () => import('../features/catalog/ProductPage.vue'),
          meta: { guard: productPage.guard, title: productPage.title },
        },
        {
          path: profilePage.path,
          name: profilePage.id,
          component: () => import('../features/users/ProfilePage.vue'),
          meta: { guard: profilePage.guard, title: profilePage.title },
        },
        {
          path: adminPage.path,
          name: adminPage.id,
          component: () => import('../features/admin/AdminPage.vue'),
          meta: { guard: adminPage.guard, title: adminPage.title },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: catalogPage.path },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const guard = to.meta.guard as string | undefined;
  const stored = localStorage.getItem('ddd-store-auth');
  const isAuthenticated = !!stored;

  if (guard === 'public') {
    if (isAuthenticated && to.path === loginPage.path) {
      next(catalogPage.path);
    } else {
      next();
    }
    return;
  }

  if (!isAuthenticated) {
    next(loginPage.path);
    return;
  }

  if (guard === 'admin') {
    try {
      const parsed = JSON.parse(stored!) as { userId?: string };
      if (parsed.userId === 'u1') {
        next();
        return;
      }
      next(catalogPage.path);
    } catch {
      next(catalogPage.path);
    }
    return;
  }

  next();
});
