import { createApiClient } from '@ddd-store/shared/api';
import {
  LoginUserUseCase,
  LogoutSessionUseCase,
  GetCurrentUserUseCase,
  MockAuthRepository,
  HttpAuthRepository,
} from '@ddd-store/auth';
import {
  GetUserProfileUseCase,
  ListActiveSessionsUseCase,
  TerminateSessionUseCase,
  ListAllUsersUseCase,
  ListAllSessionsUseCase,
  MockUserRepository,
  MockSessionRepository,
  HttpUserRepository,
  HttpSessionRepository,
} from '@ddd-store/users';
import {
  GetProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  MockProductRepository,
  HttpProductRepository,
} from '@ddd-store/catalog';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiClient = createApiClient(apiUrl);

const authRepository = useMock
  ? new MockAuthRepository()
  : new HttpAuthRepository(apiClient);

const userRepository = useMock
  ? new MockUserRepository()
  : new HttpUserRepository(apiClient);

const sessionRepository = useMock
  ? new MockSessionRepository()
  : new HttpSessionRepository(apiClient);

const productRepository = useMock
  ? new MockProductRepository()
  : new HttpProductRepository(apiClient);

export const container = {
  loginUserUseCase: new LoginUserUseCase(authRepository),
  logoutSessionUseCase: new LogoutSessionUseCase(authRepository),
  getCurrentUserUseCase: new GetCurrentUserUseCase(authRepository),
  getUserProfileUseCase: new GetUserProfileUseCase(userRepository),
  listActiveSessionsUseCase: new ListActiveSessionsUseCase(sessionRepository),
  terminateSessionUseCase: new TerminateSessionUseCase(sessionRepository),
  listAllUsersUseCase: new ListAllUsersUseCase(userRepository),
  listAllSessionsUseCase: new ListAllSessionsUseCase(sessionRepository),
  getProductsUseCase: new GetProductsUseCase(productRepository),
  getProductByIdUseCase: new GetProductByIdUseCase(productRepository),
  createProductUseCase: new CreateProductUseCase(productRepository),
  updateProductUseCase: new UpdateProductUseCase(productRepository),
  deleteProductUseCase: new DeleteProductUseCase(productRepository),
  apiClient,
  useMock,
};

export type Container = typeof container;
