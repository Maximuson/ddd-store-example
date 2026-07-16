import type { Session } from '@ddd-store/shared';
import type { User } from '@ddd-store/users';

export interface ProfileCardProps {
  readonly user: User;
}

export interface SessionListProps {
  readonly sessions: Session[];
  readonly currentUserAgent: string;
  readonly onTerminate: (sessionId: string) => void;
  readonly isTerminating?: string | null;
}
