import { User } from '../../domain/entities/User';
import { Session } from '@ddd-store/shared';

export const mockUsers: User[] = [
  User.create({ id: 'u1', email: 'admin@demo.com', name: 'Admin User', role: 'ADMIN' }),
  User.create({ id: 'u2', email: 'user@demo.com', name: 'Regular User', role: 'USER' }),
  User.create({ id: 'u3', email: 'jane@demo.com', name: 'Jane Doe', role: 'USER' }),
];

export const mockSessions: Session[] = [
  Session.create({
    id: 's1',
    userId: 'u2',
    deviceType: 'WEB',
    userAgent: 'Mozilla/5.0 Chrome/120 MacOS',
    createdAt: new Date('2026-07-15T10:00:00'),
    lastActivityAt: new Date('2026-07-16T08:30:00'),
    expiresAt: new Date('2026-07-17T10:00:00'),
  }),
  Session.create({
    id: 's2',
    userId: 'u2',
    deviceType: 'MOBILE',
    userAgent: 'Expo/51.0',
    createdAt: new Date('2026-07-14T14:00:00'),
    lastActivityAt: new Date('2026-07-16T07:00:00'),
    expiresAt: null,
  }),
  Session.create({
    id: 's3',
    userId: 'u1',
    deviceType: 'WEB',
    userAgent: 'Mozilla/5.0 Chrome/120 Windows',
    createdAt: new Date('2026-07-16T09:00:00'),
    lastActivityAt: new Date('2026-07-16T09:30:00'),
    expiresAt: new Date('2026-07-17T09:00:00'),
  }),
  Session.create({
    id: 's4',
    userId: 'u3',
    deviceType: 'WEB',
    userAgent: 'Mozilla/5.0 Safari/17 MacOS',
    createdAt: new Date('2026-07-13T11:00:00'),
    lastActivityAt: new Date('2026-07-15T16:00:00'),
    expiresAt: new Date('2026-07-14T11:00:00'),
  }),
];

const sessionsStore = [...mockSessions];

export function getMockSessionsStore(): Session[] {
  return sessionsStore;
}

export function addMockSession(session: Session): void {
  sessionsStore.push(session);
}

const MOCK_PASSWORD = 'password123';

export function validateMockPassword(password: string): boolean {
  return password === MOCK_PASSWORD;
}

export function findMockUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.getEmail() === email.toLowerCase());
}
