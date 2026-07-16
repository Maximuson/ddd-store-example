import { useCallback, useState } from 'react';
import { useSelector, useStore } from '@xstate/store-react';
import {
  GetUserProfileUseCase,
  ListActiveSessionsUseCase,
  TerminateSessionUseCase,
} from '@ddd-store/users';
import { profileStoreLogic } from '@ddd-store/web-shared/users';

export function useProfile(
  getUserProfileUseCase: GetUserProfileUseCase,
  listActiveSessionsUseCase: ListActiveSessionsUseCase,
  terminateSessionUseCase: TerminateSessionUseCase,
) {
  const store = useStore(profileStoreLogic);
  const data = useSelector(store, (s) => s.context.data);
  const loading = useSelector(store, (s) => s.context.loading);
  const error = useSelector(store, (s) => s.context.error);
  const [terminatingId, setTerminatingId] = useState<string | null>(null);

  const load = useCallback(
    async (userId: string) => {
      store.trigger.setLoading();
      try {
        const [user, sessions] = await Promise.all([
          getUserProfileUseCase.execute(userId),
          listActiveSessionsUseCase.execute(userId),
        ]);
        store.trigger.setData({ data: { user, sessions } });
      } catch (e) {
        store.trigger.setError({
          error: e instanceof Error ? e.message : 'Failed to load profile',
        });
      }
    },
    [store, getUserProfileUseCase, listActiveSessionsUseCase],
  );

  const terminate = useCallback(
    async (sessionId: string, userId: string) => {
      setTerminatingId(sessionId);
      try {
        await terminateSessionUseCase.execute(sessionId);
        await load(userId);
      } catch {
        // keep current data on terminate failure
      } finally {
        setTerminatingId(null);
      }
    },
    [terminateSessionUseCase, load],
  );

  return {
    user: data?.user ?? null,
    sessions: data?.sessions ?? [],
    loading,
    error,
    terminatingId,
    load,
    terminate,
  };
}
