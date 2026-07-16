import { createApiClient } from '@ddd-store/shared/api';
import {
  LoginUserUseCase,
  LogoutSessionUseCase,
  MockAuthRepository,
  HttpAuthRepository,
} from '@ddd-store/auth';
import {
  GetUserProfileUseCase,
  ListActiveSessionsUseCase,
  TerminateSessionUseCase,
  MockUserRepository,
  MockSessionRepository,
} from '@ddd-store/users';
import { GetProductsUseCase, GetProductByIdUseCase, MockProductRepository } from '@ddd-store/catalog';
import { SqliteProductRepository } from '../db/repositories/SqliteProductRepository';
import { SqliteUserRepository, SqliteSessionRepository } from '../db/repositories/SqliteUserRepository';
import { SyncService } from '../db/sync/SyncService';

const useMock = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const sqliteProductRepo = new SqliteProductRepository();
const sqliteUserRepo = new SqliteUserRepository();
const sqliteSessionRepo = new SqliteSessionRepository();

const syncService = new SyncService(apiUrl, sqliteProductRepo, sqliteUserRepo, sqliteSessionRepo);

const productRepository = useMock ? new MockProductRepository() : sqliteProductRepo;
const userRepository = useMock ? new MockUserRepository() : sqliteUserRepo;
const sessionRepository = useMock ? new MockSessionRepository() : sqliteSessionRepo;

const apiClient = createApiClient(apiUrl);
const authRepository = useMock ? new MockAuthRepository() : new HttpAuthRepository(apiClient);

export const container = {
  loginUserUseCase: new LoginUserUseCase(authRepository),
  logoutSessionUseCase: new LogoutSessionUseCase(authRepository),
  getUserProfileUseCase: new GetUserProfileUseCase(userRepository),
  listActiveSessionsUseCase: new ListActiveSessionsUseCase(sessionRepository),
  terminateSessionUseCase: new TerminateSessionUseCase(sessionRepository),
  getProductsUseCase: new GetProductsUseCase(productRepository),
  getProductByIdUseCase: new GetProductByIdUseCase(productRepository),
  syncService,
  apiClient,
  useMock,
};
