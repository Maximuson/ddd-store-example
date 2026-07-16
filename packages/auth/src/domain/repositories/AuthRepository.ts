import { Credentials, AuthResult } from '../entities/AuthToken';
import { User } from '@ddd-store/users';

export interface AuthRepository {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(sessionId: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResult>;
  getCurrentUser(accessToken: string): Promise<User | null>;
}
