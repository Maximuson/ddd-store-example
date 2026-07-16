import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContainerProvider } from '../di/ContainerContext';
import { AuthProvider } from './AuthContext';
import { Layout } from './Layout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminPage } from '../pages/AdminPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <ContainerProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/catalog" replace />} />
          </Routes>
        </AuthProvider>
      </ContainerProvider>
    </BrowserRouter>
  );
}
