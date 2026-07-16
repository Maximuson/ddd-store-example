import { setup, assign, fromPromise } from 'xstate';
import { LoginUserUseCase, LogoutSessionUseCase } from '../../application/use-cases';
import { Credentials, AuthResult } from '../../domain/entities/AuthToken';
import { User } from '@ddd-store/users';

export interface AuthContext {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  error: string | null;
}

export type AuthEvent =
  | { type: 'LOGIN'; credentials: Credentials }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; user: User; token: string; sessionId: string };

export function createAuthMachine(
  loginUseCase: LoginUserUseCase,
  logoutUseCase: LogoutSessionUseCase,
) {
  return setup({
    types: {
      context: {} as AuthContext,
      events: {} as AuthEvent,
    },
    actors: {
      login: fromPromise(async ({ input }: { input: Credentials }) => {
        return loginUseCase.execute(input);
      }),
      logout: fromPromise(async ({ input }: { input: string }) => {
        await logoutUseCase.execute(input);
      }),
    },
  }).createMachine({
    id: 'auth',
    initial: 'idle',
    context: {
      user: null,
      token: null,
      sessionId: null,
      error: null,
    },
    states: {
      idle: {
        on: {
          LOGIN: { target: 'submitting' },
          SET_USER: {
            actions: assign({
              user: ({ event }) => event.user,
              token: ({ event }) => event.token,
              sessionId: ({ event }) => event.sessionId,
            }),
          },
        },
      },
      submitting: {
        invoke: {
          src: 'login',
          input: ({ event }) => (event as { type: 'LOGIN'; credentials: Credentials }).credentials,
          onDone: {
            target: 'authenticated',
            actions: assign({
              token: ({ event }) => (event.output as AuthResult).token.accessToken,
              sessionId: ({ event }) => (event.output as AuthResult).sessionId,
              error: null,
            }),
          },
          onError: {
            target: 'error',
            actions: assign({
              error: ({ event }) =>
                event.error instanceof Error ? event.error.message : 'Login failed',
            }),
          },
        },
      },
      authenticated: {
        on: {
          LOGOUT: { target: 'loggingOut' },
        },
      },
      loggingOut: {
        invoke: {
          src: 'logout',
          input: ({ context }) => context.sessionId ?? '',
          onDone: {
            target: 'idle',
            actions: assign({ user: null, token: null, sessionId: null, error: null }),
          },
          onError: {
            target: 'idle',
            actions: assign({ user: null, token: null, sessionId: null }),
          },
        },
      },
      error: {
        on: {
          LOGIN: { target: 'submitting', actions: assign({ error: null }) },
        },
      },
    },
  });
}
