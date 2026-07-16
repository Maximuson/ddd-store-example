import { User } from '../entities/User';
import { Session } from '@ddd-store/shared';

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  updateProfile(id: string, data: { name?: string }): Promise<User>;
  listAll(): Promise<User[]>;
}

export interface SessionRepository {
  getActiveSessions(userId: string): Promise<Session[]>;
  terminate(sessionId: string): Promise<void>;
  listAll(): Promise<Session[]>;
}
