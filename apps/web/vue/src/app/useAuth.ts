import { ref, computed, inject, type InjectionKey } from 'vue';
import type { User } from '@ddd-store/users';
import { container } from '../di/container';

const STORAGE_KEY = 'ddd-store-auth';

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isLoading: boolean;
}

export const authKey: InjectionKey<ReturnType<typeof createAuth>> = Symbol('auth');

export function createAuth() {
  const { loginUserUseCase, logoutSessionUseCase, getCurrentUserUseCase } = container;

  const state = ref<AuthState>({
    user: null,
    token: null,
    sessionId: null,
    isLoading: true,
  });
  const error = ref<string | null>(null);

  const user = computed(() => state.value.user);
  const isLoading = computed(() => state.value.isLoading);

  async function restoreSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      state.value = { ...state.value, isLoading: false };
      return;
    }

    try {
      const { token, sessionId } = JSON.parse(stored) as {
        token: string;
        sessionId: string;
      };
      const currentUser = await getCurrentUserUseCase.execute(token);
      state.value = { user: currentUser, token, sessionId, isLoading: false };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      state.value = { user: null, token: null, sessionId: null, isLoading: false };
    }
  }

  async function login(email: string, password: string) {
    error.value = null;
    try {
      const result = await loginUserUseCase.execute({
        email,
        password,
        deviceType: 'WEB',
        userAgent: navigator.userAgent,
      });
      const currentUser = await getCurrentUserUseCase.execute(result.token.accessToken);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: result.token.accessToken,
          sessionId: result.sessionId,
          userId: result.userId,
        }),
      );
      state.value = {
        user: currentUser,
        token: result.token.accessToken,
        sessionId: result.sessionId,
        isLoading: false,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    }
  }

  async function logout() {
    if (state.value.sessionId) {
      await logoutSessionUseCase.execute(state.value.sessionId);
    }
    localStorage.removeItem(STORAGE_KEY);
    state.value = { user: null, token: null, sessionId: null, isLoading: false };
  }

  void restoreSession();

  return { user, isLoading, error, login, logout };
}

export function useAuth() {
  const ctx = inject(authKey);
  if (!ctx) throw new Error('Auth not provided');
  return ctx;
}
