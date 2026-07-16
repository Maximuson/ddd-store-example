import { Session } from '@ddd-store/shared';

export interface SessionDto {
  id: string;
  userId: string;
  deviceType: string;
  userAgent: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string | null;
}

export function mapSessionDtoToEntity(dto: SessionDto): Session {
  return Session.create({
    id: dto.id,
    userId: dto.userId,
    deviceType: dto.deviceType as 'WEB' | 'MOBILE',
    userAgent: dto.userAgent,
    createdAt: new Date(dto.createdAt),
    lastActivityAt: new Date(dto.lastActivityAt),
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
  });
}
