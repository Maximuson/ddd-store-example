import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../features/AuthContext';
import { container } from '../di/container';
import { Session } from '@ddd-store/shared';
import { OfflineBanner } from '../features/OfflineBanner';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const online = await container.syncService.isOnline();
    setIsOnline(online);
    const items = await container.listActiveSessionsUseCase.execute(user.getId());
    setSessions(items);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleTerminate = async (sessionId: string) => {
    if (!isOnline) return;
    setTerminating(sessionId);
    try {
      await container.terminateSessionUseCase.execute(sessionId);
      await loadProfile();
    } finally {
      setTerminating(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Not logged in</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text className="text-blue-600 mt-2">Go to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <OfflineBanner isOnline={isOnline} />

      <View className="bg-white m-4 rounded-xl p-6 border border-gray-200">
        <Text className="text-xl font-bold text-gray-900 mb-4">Profile</Text>
        <Text className="text-sm text-gray-500">Name</Text>
        <Text className="text-gray-900 font-medium mb-3">{user.getName()}</Text>
        <Text className="text-sm text-gray-500">Email</Text>
        <Text className="text-gray-900 mb-3">{user.getEmail()}</Text>
        <Text className="text-sm text-gray-500">Role</Text>
        <Text className="text-gray-900">{user.getRole().getValue()}</Text>
      </View>

      <View className="mx-4 mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Active Sessions</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          sessions.map((session) => {
            const isCurrent = session.userAgent === 'Expo/51.0';
            return (
              <View
                key={session.id}
                className={`bg-white rounded-lg p-4 mb-3 border ${
                  isCurrent ? 'border-blue-300' : 'border-gray-200'
                }`}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {session.getDeviceLabel()} — {session.deviceType}
                    </Text>
                    {isCurrent && (
                      <Text className="text-xs text-blue-600 mt-1">Current device</Text>
                    )}
                    <Text className="text-sm text-gray-500 mt-1">
                      Last active: {session.lastActivityAt.toLocaleString()}
                    </Text>
                  </View>
                  {!isCurrent && isOnline && (
                    <TouchableOpacity
                      onPress={() => handleTerminate(session.id)}
                      disabled={terminating === session.id}
                    >
                      <Text className="text-red-600 text-sm">
                        {terminating === session.id ? '...' : 'Terminate'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      <TouchableOpacity onPress={handleLogout} className="mx-4 mb-8 bg-red-50 rounded-lg py-3 items-center">
        <Text className="text-red-600 font-semibold">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
