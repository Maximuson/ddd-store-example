import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  loginPage,
  catalogPage,
  productPage,
  profilePage,
  adminPage,
} from '@ddd-store/web-shared';
import { ContainerProvider } from '../di/ContainerContext';
import { AuthProvider } from './AuthContext';
import { Layout } from './Layout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { CatalogPage } from '../features/catalog/CatalogPage';
import { ProductPage } from '../features/catalog/ProductPage';
import { ProfilePage } from '../features/users/ProfilePage';
import { AdminPage } from '../features/admin/AdminPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <ContainerProvider>
        <AuthProvider>
          <Routes>
            <Route path={loginPage.path} element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route path={catalogPage.path} element={<CatalogPage />} />
                <Route path={productPage.path} element={<ProductPage />} />
                <Route path={profilePage.path} element={<ProfilePage />} />
                <Route element={<AdminRoute />}>
                  <Route path={adminPage.path} element={<AdminPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={catalogPage.path} replace />} />
          </Routes>
        </AuthProvider>
      </ContainerProvider>
    </BrowserRouter>
  );
}
