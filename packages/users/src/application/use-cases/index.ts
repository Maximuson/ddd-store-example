import { NotFoundError } from '@ddd-store/shared';
import { UserRepository, SessionRepository } from '../../domain/repositories';
import { User } from '../../domain/entities/User';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, data: { name?: string }): Promise<User> {
    return this.userRepository.updateProfile(userId, data);
  }
}

export class ListActiveSessionsUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(userId: string) {
    const sessions = await this.sessionRepository.getActiveSessions(userId);
    return sessions.filter((s) => s.isActive());
  }
}

export class TerminateSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionRepository.terminate(sessionId);
  }
}

export class ListAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.listAll();
  }
}

export class ListAllSessionsUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute() {
    return this.sessionRepository.listAll();
  }
}
