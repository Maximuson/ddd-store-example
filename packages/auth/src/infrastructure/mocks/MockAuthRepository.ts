import { UnauthorizedError } from '@ddd-store/shared';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { Credentials, AuthResult } from '../../domain/entities/AuthToken';
import { User } from '@ddd-store/users';
import {
  findMockUserByEmail,
  validateMockPassword,
  addMockSession,
  getMockSessionsStore,
  mockUsers,
} from '@ddd-store/users/infrastructure/mocks/mockData';
import { Session } from '@ddd-store/shared';

let currentSessionId: string | null = null;
let currentToken: string | null = null;

export class MockAuthRepository implements AuthRepository {
  async login(credentials: Credentials): Promise<AuthResult> {
    const user = findMockUserByEmail(credentials.email);
    if (!user || !validateMockPassword(credentials.password)) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const sessionId = `mock-session-${Date.now()}`;
    const expiresAt =
      credentials.deviceType === 'WEB'
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null;

    const session = Session.create({
      id: sessionId,
      userId: user.getId(),
      deviceType: credentials.deviceType,
      userAgent: credentials.userAgent,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt,
    });
    addMockSession(session);

    const accessToken = `mock-token-${user.getId()}-${Date.now()}`;
    currentSessionId = sessionId;
    currentToken = accessToken;

    return {
      token: {
        accessToken,
        refreshToken: credentials.deviceType === 'MOBILE' ? `mock-refresh-${sessionId}` : undefined,
        expiresAt: expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      userId: user.getId(),
      sessionId,
    };
  }

  async logout(sessionId: string): Promise<void> {
    const sessions = getMockSessionsStore();
    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index >= 0) sessions.splice(index, 1);
    if (currentSessionId === sessionId) {
      currentSessionId = null;
      currentToken = null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const sessionId = refreshToken.replace('mock-refresh-', '');
    const session = getMockSessionsStore().find((s) => s.id === sessionId);
    if (!session) throw new UnauthorizedError('Invalid refresh token');

    const accessToken = `mock-token-${session.userId}-${Date.now()}`;
    currentToken = accessToken;
    currentSessionId = sessionId;

    return {
      token: { accessToken, refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      userId: session.userId,
      sessionId,
    };
  }

  async getCurrentUser(accessToken: string): Promise<User | null> {
    if (!accessToken.startsWith('mock-token-')) return null;
    const userId = accessToken.split('-')[2];
    return mockUsers.find((u) => u.getId() === userId) ?? null;
  }
}

export { getMockSessionsStore as getMockSessions };
