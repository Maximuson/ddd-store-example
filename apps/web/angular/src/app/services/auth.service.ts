import { Injectable, inject, signal } from '@angular/core';
import type { User } from '@ddd-store/users';
import { CONTAINER } from '../di/container.token';

const STORAGE_KEY = 'ddd-store-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly container = inject(CONTAINER);

  readonly user = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly sessionId = signal<string | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    void this.restoreSession();
  }

  private async restoreSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      this.isLoading.set(false);
      return;
    }
    try {
      const { token, sessionId } = JSON.parse(stored) as { token: string; sessionId: string };
      const currentUser = await Promise.race([
        this.container.getCurrentUserUseCase.execute(token),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Session restore timed out')), 8_000),
        ),
      ]);
      this.user.set(currentUser);
      this.token.set(token);
      this.sessionId.set(sessionId);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string) {
    this.error.set(null);
    const result = await this.container.loginUserUseCase.execute({
      email,
      password,
      deviceType: 'WEB',
      userAgent: navigator.userAgent,
    });
    const currentUser = await this.container.getCurrentUserUseCase.execute(result.token.accessToken);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: result.token.accessToken,
        sessionId: result.sessionId,
        userId: result.userId,
      }),
    );
    this.user.set(currentUser);
    this.token.set(result.token.accessToken);
    this.sessionId.set(result.sessionId);
  }

  async logout() {
    const sid = this.sessionId();
    if (sid) await this.container.logoutSessionUseCase.execute(sid);
    localStorage.removeItem(STORAGE_KEY);
    this.user.set(null);
    this.token.set(null);
    this.sessionId.set(null);
  }
}
