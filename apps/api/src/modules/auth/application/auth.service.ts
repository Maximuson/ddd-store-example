import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { LoginDto } from '../presentation/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const expiresAt =
      dto.deviceType === 'WEB' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        deviceType: dto.deviceType,
        userAgent: dto.userAgent,
        expiresAt,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role, sessionId: session.id };
    const accessToken = this.jwtService.sign(payload);

    let refreshToken: string | undefined;
    if (dto.deviceType === 'MOBILE') {
      refreshToken = randomBytes(32).toString('hex');
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          sessionId: session.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt?.toISOString() ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user.id,
      sessionId: session.id,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
      sessionId: stored.sessionId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: stored.user.id,
      sessionId: stored.sessionId,
    };
  }

  async logout(sessionId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { sessionId } });
    await this.prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
