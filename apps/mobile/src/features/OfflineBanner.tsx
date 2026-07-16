import { View, Text } from 'react-native';
import { getSyncMetadata } from '../src/db/sqlite';

interface OfflineBannerProps {
  isOnline: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null;

  const lastSyncedAt = getSyncMetadata('lastSyncedAt');
  const formatted = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString()
    : 'never';

  return (
    <View className="bg-amber-100 px-4 py-3 border-b border-amber-200">
      <Text className="text-amber-800 text-sm text-center">
        Offline mode — Showing cached data from: {formatted}
      </Text>
    </View>
  );
}
