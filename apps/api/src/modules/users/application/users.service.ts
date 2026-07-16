import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async updateMe(userId: string, data: { name?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async getSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActivityAt: 'desc' },
    });
    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      deviceType: s.deviceType,
      userAgent: s.userAgent,
      createdAt: s.createdAt.toISOString(),
      lastActivityAt: s.lastActivityAt.toISOString(),
      expiresAt: s.expiresAt?.toISOString() ?? null,
    }));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async listAll() {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role }));
  }
}
