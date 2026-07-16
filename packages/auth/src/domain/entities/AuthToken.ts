import { DeviceType } from '@ddd-store/shared';

export interface Credentials {
  email: string;
  password: string;
  deviceType: DeviceType;
  userAgent: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface AuthResult {
  token: AuthToken;
  userId: string;
  sessionId: string;
}
