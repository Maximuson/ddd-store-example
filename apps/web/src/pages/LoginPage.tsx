import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LoginForm } from '@ddd-store/auth';
import { useAuth } from '../app/AuthContext';

export function LoginPage() {
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/catalog" replace />;
  }

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/catalog');
    } catch {
      // error handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
