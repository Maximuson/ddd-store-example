import { UnauthorizedError } from '@ddd-store/shared';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { Credentials, AuthResult } from '../../domain/entities/AuthToken';

export class LoginUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: Credentials): Promise<AuthResult> {
    if (!credentials.email || !credentials.password) {
      throw new UnauthorizedError('Email and password are required');
    }
    return this.authRepository.login(credentials);
  }
}

export class LogoutSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.authRepository.logout(sessionId);
  }
}

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    return this.authRepository.refreshToken(refreshToken);
  }
}

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(accessToken: string) {
    const user = await this.authRepository.getCurrentUser(accessToken);
    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }
    return user;
  }
}
