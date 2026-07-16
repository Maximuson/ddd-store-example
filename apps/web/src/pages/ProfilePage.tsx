import { useEffect } from 'react';
import { ProfileCard, SessionList, useProfile } from '@ddd-store/users';
import { useContainer } from '../di/ContainerContext';
import { useAuth } from '../app/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  const { getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase } =
    useContainer();

  const { user: profileUser, sessions, loading, error, terminatingId, load, terminate } =
    useProfile(getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase);

  useEffect(() => {
    if (user) load(user.getId());
  }, [user, load]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>
    );
  }

  if (!profileUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <ProfileCard user={profileUser} />
      <SessionList
        sessions={sessions}
        currentUserAgent={navigator.userAgent}
        onTerminate={(sessionId) => terminate(sessionId, profileUser.getId())}
        isTerminating={terminatingId}
      />
    </div>
  );
}
