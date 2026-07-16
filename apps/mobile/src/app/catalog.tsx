import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Product } from '@ddd-store/catalog';
import { container } from '../di/container';
import { OfflineBanner } from '../features/OfflineBanner';

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const online = await container.syncService.isOnline();
    setIsOnline(online);

    if (online && !container.useMock) {
      const db = await import('../db/sqlite');
      const tokenRow = db.getDatabase().getFirstSync<{ access_token: string }>(
        'SELECT access_token FROM auth_tokens LIMIT 1',
      );
      await container.syncService.sync(tokenRow?.access_token);
    }

    const items = await container.getProductsUseCase.execute();
    setProducts(items);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  return (
    <View className="flex-1 bg-gray-50">
      <OfflineBanner isOnline={isOnline} />

      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-lg font-bold text-gray-900">Products</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text className="text-blue-600">Profile</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.getId()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProducts} />}
        contentContainerClassName="px-4 pb-4"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.getId()}`)}
            className="bg-white rounded-xl mb-4 overflow-hidden border border-gray-200"
          >
            <Image source={{ uri: item.getImage() }} className="w-full h-40" />
            <View className="p-4">
              <Text className="text-xs text-blue-600 uppercase font-medium">{item.getCategory()}</Text>
              <Text className="text-lg font-semibold text-gray-900 mt-1">{item.getTitle()}</Text>
              <Text className="text-xl font-bold text-gray-900 mt-2">{item.getPrice().format()}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-500 py-12">No products. Go online to sync.</Text>
          ) : null
        }
      />
    </View>
  );
}
