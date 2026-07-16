import { useEffect, useMemo } from 'react';
import { useActor } from '@xstate/react';
import { createProfileMachine, ProfileCard, SessionList } from '@ddd-store/users';
import { useContainer } from '../di/ContainerContext';
import { useAuth } from '../app/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  const { getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase } =
    useContainer();

  const machine = useMemo(
    () => createProfileMachine(getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase),
    [getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase],
  );
  const [state, send] = useActor(machine);

  useEffect(() => {
    if (user) send({ type: 'LOAD', userId: user.getId() });
  }, [user, send]);

  if (state.matches('loading') || state.matches('idle')) {
    return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
  }

  if (state.matches('error')) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{state.context.error}</div>
    );
  }

  const profileUser = state.context.user!;
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <ProfileCard user={profileUser} />
      <SessionList
        sessions={state.context.sessions}
        currentUserAgent={navigator.userAgent}
        onTerminate={(sessionId) => send({ type: 'TERMINATE', sessionId })}
        isTerminating={state.context.terminatingId}
      />
    </div>
  );
}
