import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from '@ddd-store/users';
import { useContainer } from '../di/ContainerContext';

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string, sessionId: string) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'ddd-store-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    loginUserUseCase,
    logoutSessionUseCase,
    getCurrentUserUseCase,
  } = useContainer();

  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    sessionId: null,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { token, sessionId, userId } = JSON.parse(stored) as {
        token: string;
        sessionId: string;
        userId: string;
      };
      getCurrentUserUseCase
        .execute(token)
        .then((user) => {
          setState({ user, token, sessionId, isLoading: false });
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setState({ user: null, token: null, sessionId: null, isLoading: false });
        });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [getCurrentUserUseCase]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const result = await loginUserUseCase.execute({
          email,
          password,
          deviceType: 'WEB',
          userAgent: navigator.userAgent,
        });
        const user = await getCurrentUserUseCase.execute(result.token.accessToken);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: result.token.accessToken,
            sessionId: result.sessionId,
            userId: result.userId,
          }),
        );
        setState({
          user,
          token: result.token.accessToken,
          sessionId: result.sessionId,
          isLoading: false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        throw err;
      }
    },
    [loginUserUseCase, getCurrentUserUseCase],
  );

  const logout = useCallback(async () => {
    if (state.sessionId) {
      await logoutSessionUseCase.execute(state.sessionId);
    }
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, token: null, sessionId: null, isLoading: false });
  }, [logoutSessionUseCase, state.sessionId]);

  const setUser = useCallback((user: User, token: string, sessionId: string) => {
    setState({ user, token, sessionId, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
