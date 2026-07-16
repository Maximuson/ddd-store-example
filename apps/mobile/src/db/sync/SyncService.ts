import { createApiClient } from '@ddd-store/shared/api';
import { HttpProductRepository } from '@ddd-store/catalog';
import { HttpUserRepository, HttpSessionRepository } from '@ddd-store/users';
import { mapSessionDtoToEntity, SessionDto } from '@ddd-store/users';
import { mapUserDtoToEntity, UserDto } from '@ddd-store/users';
import { SqliteProductRepository } from '../repositories/SqliteProductRepository';
import { SqliteUserRepository, SqliteSessionRepository } from '../repositories/SqliteUserRepository';
import { setSyncMetadata } from '../sqlite';
import * as Network from 'expo-network';

export class SyncService {
  constructor(
    private readonly apiUrl: string,
    private readonly sqliteProducts: SqliteProductRepository,
    private readonly sqliteUsers: SqliteUserRepository,
    private readonly sqliteSessions: SqliteSessionRepository,
  ) {}

  async isOnline(): Promise<boolean> {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected === true && state.isInternetReachable === true;
  }

  async sync(accessToken?: string): Promise<boolean> {
    const online = await this.isOnline();
    if (!online) return false;

    const client = createApiClient(this.apiUrl);
    if (accessToken) client.setAuthToken(accessToken);

    const httpProducts = new HttpProductRepository(client);
    const httpUsers = new HttpUserRepository(client);
    const httpSessions = new HttpSessionRepository(client);

    try {
      const products = await httpProducts.getProducts();
      this.sqliteProducts.upsertProducts(products);

      if (accessToken) {
        const userDto = await client.get<UserDto>('/auth/me');
        this.sqliteUsers.upsertUser(mapUserDtoToEntity(userDto));

        const sessionDtos = await client.get<SessionDto[]>('/users/me/sessions');
        sessionDtos.forEach((dto) => {
          this.sqliteSessions.upsertSession(mapSessionDtoToEntity(dto));
        });
      }

      setSyncMetadata('lastSyncedAt', new Date().toISOString());
      return true;
    } catch {
      return false;
    }
  }
}
