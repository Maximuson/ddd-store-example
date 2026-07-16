import { setup, assign, fromPromise } from 'xstate';
import {
  GetUserProfileUseCase,
  ListActiveSessionsUseCase,
  TerminateSessionUseCase,
} from '../../application/use-cases';
import { User } from '../../domain/entities/User';
import { Session } from '@ddd-store/shared';

export function createProfileMachine(
  getUserProfileUseCase: GetUserProfileUseCase,
  listSessionsUseCase: ListActiveSessionsUseCase,
  terminateSessionUseCase: TerminateSessionUseCase,
) {
  return setup({
    types: {
      context: {} as {
        user: User | null;
        sessions: Session[];
        error: string | null;
        terminatingId: string | null;
      },
      events: {} as
        | { type: 'LOAD'; userId: string }
        | { type: 'TERMINATE'; sessionId: string },
    },
    actors: {
      loadProfile: fromPromise(
        async ({ input }: { input: { userId: string } }) => {
          const [user, sessions] = await Promise.all([
            getUserProfileUseCase.execute(input.userId),
            listSessionsUseCase.execute(input.userId),
          ]);
          return { user, sessions };
        },
      ),
      terminateSession: fromPromise(async ({ input }: { input: string }) => {
        await terminateSessionUseCase.execute(input);
      }),
    },
  }).createMachine({
    id: 'profile',
    initial: 'idle',
    context: { user: null, sessions: [], error: null, terminatingId: null },
    states: {
      idle: {
        on: { LOAD: { target: 'loading' } },
      },
      loading: {
        invoke: {
          src: 'loadProfile',
          input: ({ event }) => ({ userId: (event as { type: 'LOAD'; userId: string }).userId }),
          onDone: {
            target: 'ready',
            actions: assign({
              user: ({ event }) => (event.output as { user: User }).user,
              sessions: ({ event }) => (event.output as { sessions: Session[] }).sessions,
              error: null,
            }),
          },
          onError: {
            target: 'error',
            actions: assign({
              error: ({ event }) =>
                event.error instanceof Error ? event.error.message : 'Failed to load profile',
            }),
          },
        },
      },
      ready: {
        on: {
          TERMINATE: { target: 'terminating', actions: assign({ terminatingId: ({ event }) => event.sessionId }) },
          LOAD: { target: 'loading' },
        },
      },
      terminating: {
        invoke: {
          src: 'terminateSession',
          input: ({ context }) => context.terminatingId ?? '',
          onDone: { target: 'loading' },
          onError: { target: 'ready', actions: assign({ terminatingId: null }) },
        },
      },
      error: {
        on: { LOAD: { target: 'loading' } },
      },
    },
  });
}
