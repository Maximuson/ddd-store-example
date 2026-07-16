import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loginPage, catalogPage } from '@ddd-store/web-shared';
import { LoginForm } from './components/LoginForm';
import { useAuth } from '../../app/AuthContext';

export function LoginPage() {
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to={catalogPage.path} replace />;
  }

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(catalogPage.path);
    } catch {
      // error handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="sr-only">{loginPage.title}</h1>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
