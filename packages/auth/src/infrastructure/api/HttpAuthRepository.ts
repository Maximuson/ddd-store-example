import { ApiClient } from '@ddd-store/shared/api';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { Credentials, AuthResult } from '../../domain/entities/AuthToken';
import { User } from '@ddd-store/users';
import { mapUserDtoToEntity, UserDto } from '@ddd-store/users/infrastructure/mappers/userMapper';

interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  userId: string;
  sessionId: string;
}

export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly client: ApiClient) {}

  async login(credentials: Credentials): Promise<AuthResult> {
    const response = await this.client.post<LoginResponseDto>('/auth/login', credentials);
    this.client.setAuthToken(response.accessToken);
    return {
      token: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: new Date(response.expiresAt),
      },
      userId: response.userId,
      sessionId: response.sessionId,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.client.post('/auth/logout', { sessionId });
    this.client.setAuthToken(null);
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const response = await this.client.post<LoginResponseDto>('/auth/refresh', { refreshToken });
    this.client.setAuthToken(response.accessToken);
    return {
      token: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: new Date(response.expiresAt),
      },
      userId: response.userId,
      sessionId: response.sessionId,
    };
  }

  async getCurrentUser(accessToken: string): Promise<User | null> {
    this.client.setAuthToken(accessToken);
    try {
      const dto = await this.client.get<UserDto>('/auth/me');
      return mapUserDtoToEntity(dto);
    } catch {
      return null;
    }
  }
}
