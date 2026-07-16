import { createAsyncStoreLogic } from '@ddd-store/shared';
import { Session } from '@ddd-store/shared';
import { User } from '../../domain/entities/User';

export interface ProfileData {
  user: User;
  sessions: Session[];
}

export const profileStoreLogic = createAsyncStoreLogic<ProfileData>();
