import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from '@ddd-store/users';
import { container } from '../di/container';
import { getDatabase } from '../db/sqlite';

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    sessionId: null,
    isLoading: false,
  });

  useEffect(() => {
    getDatabase();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await container.loginUserUseCase.execute({
      email,
      password,
      deviceType: 'MOBILE',
      userAgent: 'Expo/51.0',
    });

    const user = await container.getUserProfileUseCase.execute(result.userId);

    const db = getDatabase();
    db.runSync('DELETE FROM auth_tokens');
    db.runSync(
      'INSERT INTO auth_tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)',
      [result.token.accessToken, result.token.refreshToken ?? null, result.token.expiresAt.toISOString()],
    );

    await container.syncService.sync(result.token.accessToken);

    setState({
      user,
      token: result.token.accessToken,
      sessionId: result.sessionId,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    if (state.sessionId) {
      await container.logoutSessionUseCase.execute(state.sessionId);
    }
    const db = getDatabase();
    db.runSync('DELETE FROM auth_tokens');
    setState({ user: null, token: null, sessionId: null, isLoading: false });
  }, [state.sessionId]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
