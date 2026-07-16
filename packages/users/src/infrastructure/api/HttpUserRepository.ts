import { ApiClient } from '@ddd-store/shared/api';
import { UserRepository, SessionRepository } from '../../domain/repositories';
import { User } from '../../domain/entities/User';
import { mapUserDtoToEntity, UserDto } from '../mappers/userMapper';
import { mapSessionDtoToEntity, SessionDto } from '../mappers/sessionMapper';

export class HttpUserRepository implements UserRepository {
  constructor(private readonly client: ApiClient) {}

  async getById(id: string): Promise<User | null> {
    try {
      const dto = await this.client.get<UserDto>(`/users/${id}`);
      return mapUserDtoToEntity(dto);
    } catch {
      return null;
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const dto = await this.client.get<UserDto>(`/users/by-email/${encodeURIComponent(email)}`);
      return mapUserDtoToEntity(dto);
    } catch {
      return null;
    }
  }

  async updateProfile(id: string, data: { name?: string }): Promise<User> {
    const dto = await this.client.patch<UserDto>('/users/me', data);
    return mapUserDtoToEntity(dto);
  }

  async listAll(): Promise<User[]> {
    const dtos = await this.client.get<UserDto[]>('/admin/users');
    return dtos.map(mapUserDtoToEntity);
  }
}

export class HttpSessionRepository implements SessionRepository {
  constructor(private readonly client: ApiClient) {}

  async getActiveSessions(userId: string): Promise<import('@ddd-store/shared').Session[]> {
    const dtos = await this.client.get<SessionDto[]>('/users/me/sessions');
    return dtos.map(mapSessionDtoToEntity).filter((s) => s.userId === userId);
  }

  async terminate(sessionId: string): Promise<void> {
    await this.client.delete(`/sessions/${sessionId}`);
  }

  async listAll(): Promise<import('@ddd-store/shared').Session[]> {
    const dtos = await this.client.get<SessionDto[]>('/admin/sessions');
    return dtos.map(mapSessionDtoToEntity);
  }
}
