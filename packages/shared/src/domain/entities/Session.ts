import { DeviceType } from '../value-objects/DeviceType';

export interface SessionProps {
  id: string;
  userId: string;
  deviceType: DeviceType;
  userAgent: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date | null;
}

export class Session {
  private constructor(private readonly props: SessionProps) {}

  static create(props: SessionProps): Session {
    return new Session(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get deviceType(): DeviceType {
    return this.props.deviceType;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get expiresAt(): Date | null {
    return this.props.expiresAt;
  }

  isExpired(): boolean {
    if (this.props.expiresAt === null) return false;
    return new Date() > this.props.expiresAt;
  }

  isActive(): boolean {
    return !this.isExpired();
  }

  getDeviceLabel(): string {
    if (this.props.deviceType === 'MOBILE') {
      return 'Expo Mobile';
    }
    const ua = this.props.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    return 'Browser';
  }

  toJSON(): SessionProps {
    return { ...this.props };
  }
}
