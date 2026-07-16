import { UserRepository, SessionRepository } from '../../domain/repositories';
import { User } from '../../domain/entities/User';
import { Session } from '@ddd-store/shared';
import { mockUsers, mockSessions, getMockSessionsStore } from './mockData';

export class MockUserRepository implements UserRepository {
  private users = [...mockUsers];

  async getById(id: string): Promise<User | null> {
    return this.users.find((u) => u.getId() === id) ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.getEmail() === email.toLowerCase()) ?? null;
  }

  async updateProfile(id: string, data: { name?: string }): Promise<User> {
    const index = this.users.findIndex((u) => u.getId() === id);
    if (index < 0) throw new Error('User not found');
    const current = this.users[index]!;
    const updated = User.create({
      id: current.getId(),
      email: current.getEmail(),
      name: data.name ?? current.getName(),
      role: current.getRole().getValue(),
    });
    this.users[index] = updated;
    return updated;
  }

  async listAll(): Promise<User[]> {
    return [...this.users];
  }
}

export class MockSessionRepository implements SessionRepository {
  async getActiveSessions(userId: string): Promise<Session[]> {
    return getMockSessionsStore().filter((s) => s.userId === userId && s.isActive());
  }

  async terminate(sessionId: string): Promise<void> {
    const sessions = getMockSessionsStore();
    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index >= 0) sessions.splice(index, 1);
  }

  async listAll(): Promise<Session[]> {
    return getMockSessionsStore();
  }
}
