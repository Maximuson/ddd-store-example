import { User } from '@ddd-store/users';
import { UserRepository, SessionRepository } from '@ddd-store/users';
import { Session } from '@ddd-store/shared';
import { getDatabase } from '../sqlite';

export class SqliteUserRepository implements UserRepository {
  async getById(id: string): Promise<User | null> {
    const db = getDatabase();
    const row = db.getFirstSync<{ id: string; email: string; name: string; role: string }>(
      'SELECT * FROM users WHERE id = ?',
      [id],
    );
    if (!row) return null;
    return User.create(row);
  }

  async getByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    const row = db.getFirstSync<{ id: string; email: string; name: string; role: string }>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()],
    );
    if (!row) return null;
    return User.create(row);
  }

  async updateProfile(id: string, data: { name?: string }): Promise<User> {
    const db = getDatabase();
    if (data.name) {
      db.runSync('UPDATE users SET name = ? WHERE id = ?', [data.name, id]);
    }
    const user = await this.getById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async listAll(): Promise<User[]> {
    const db = getDatabase();
    const rows = db.getAllSync<{ id: string; email: string; name: string; role: string }>(
      'SELECT * FROM users',
    );
    return rows.map((row) => User.create(row));
  }

  upsertUser(user: User): void {
    const db = getDatabase();
    const json = user.toJSON();
    db.runSync(
      'INSERT OR REPLACE INTO users (id, email, name, role) VALUES (?, ?, ?, ?)',
      [json.id, json.email, json.name, json.role],
    );
  }
}

export class SqliteSessionRepository implements SessionRepository {
  async getActiveSessions(userId: string): Promise<Session[]> {
    const db = getDatabase();
    const rows = db.getAllSync<{
      id: string;
      user_id: string;
      device_type: string;
      user_agent: string;
      created_at: string;
      last_activity_at: string;
      expires_at: string | null;
    }>('SELECT * FROM sessions WHERE user_id = ?', [userId]);

    return rows
      .map((row) =>
        Session.create({
          id: row.id,
          userId: row.user_id,
          deviceType: row.device_type as 'WEB' | 'MOBILE',
          userAgent: row.user_agent,
          createdAt: new Date(row.created_at),
          lastActivityAt: new Date(row.last_activity_at),
          expiresAt: row.expires_at ? new Date(row.expires_at) : null,
        }),
      )
      .filter((s) => s.isActive());
  }

  async terminate(sessionId: string): Promise<void> {
    const db = getDatabase();
    db.runSync('DELETE FROM sessions WHERE id = ?', [sessionId]);
  }

  async listAll(): Promise<Session[]> {
    const db = getDatabase();
    const rows = db.getAllSync<{
      id: string;
      user_id: string;
      device_type: string;
      user_agent: string;
      created_at: string;
      last_activity_at: string;
      expires_at: string | null;
    }>('SELECT * FROM sessions');

    return rows.map((row) =>
      Session.create({
        id: row.id,
        userId: row.user_id,
        deviceType: row.device_type as 'WEB' | 'MOBILE',
        userAgent: row.user_agent,
        createdAt: new Date(row.created_at),
        lastActivityAt: new Date(row.last_activity_at),
        expiresAt: row.expires_at ? new Date(row.expires_at) : null,
      }),
    );
  }

  upsertSession(session: Session, isCurrent = false): void {
    const db = getDatabase();
    db.runSync(
      `INSERT OR REPLACE INTO sessions (id, user_id, device_type, user_agent, created_at, last_activity_at, expires_at, is_current)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.userId,
        session.deviceType,
        session.userAgent,
        session.createdAt.toISOString(),
        session.lastActivityAt.toISOString(),
        session.expiresAt?.toISOString() ?? null,
        isCurrent ? 1 : 0,
      ],
    );
  }
}
