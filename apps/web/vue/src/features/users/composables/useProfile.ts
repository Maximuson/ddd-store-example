import { onScopeDispose, ref } from 'vue';
import { profileStoreLogic } from '@ddd-store/web-shared/users';
import type {
  GetUserProfileUseCase,
  ListActiveSessionsUseCase,
  TerminateSessionUseCase,
} from '@ddd-store/users';

const store = profileStoreLogic.createStore();

export function useProfile(
  getUserProfileUseCase: GetUserProfileUseCase,
  listActiveSessionsUseCase: ListActiveSessionsUseCase,
  terminateSessionUseCase: TerminateSessionUseCase,
) {
  const snapshot = ref(store.get());
  const terminatingId = ref<string | null>(null);
  const sub = store.subscribe(() => {
    snapshot.value = store.get();
  });
  onScopeDispose(() => sub.unsubscribe());

  async function load(userId: string) {
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
  }

  async function terminate(sessionId: string, userId: string) {
    terminatingId.value = sessionId;
    try {
      await terminateSessionUseCase.execute(sessionId);
      await load(userId);
    } finally {
      terminatingId.value = null;
    }
  }

  return {
    user: () => snapshot.value.context.data?.user ?? null,
    sessions: () => snapshot.value.context.data?.sessions ?? [],
    loading: () => snapshot.value.context.loading,
    error: () => snapshot.value.context.error,
    terminatingId,
    load,
    terminate,
  };
}
