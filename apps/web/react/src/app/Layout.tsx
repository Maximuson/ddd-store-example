import { Link, Outlet, useNavigate } from 'react-router-dom';
import { catalogPage, profilePage, adminPage } from '@ddd-store/web-shared';
import { useAuth } from './AuthContext';
import { useContainer } from '../di/ContainerContext';

export function Layout() {
  const { user, logout } = useAuth();
  const { useMock } = useContainer();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link to={catalogPage.path} className="text-xl font-bold text-blue-600">
                DDD Store
              </Link>
              {user && (
                <>
                  <Link to={catalogPage.path} className="text-gray-600 hover:text-gray-900">
                    Catalog
                  </Link>
                  <Link to={profilePage.path} className="text-gray-600 hover:text-gray-900">
                    Profile
                  </Link>
                  {user.isAdmin() && (
                    <Link to={adminPage.path} className="text-gray-600 hover:text-gray-900">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              {useMock && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Mock Mode
                </span>
              )}
              {user && (
                <>
                  <span className="text-sm text-gray-600">{user.getName()}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
