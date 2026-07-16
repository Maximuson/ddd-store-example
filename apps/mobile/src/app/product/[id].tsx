import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Product } from '@ddd-store/catalog';
import { container } from '../di/container';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    container.getProductByIdUseCase
      .execute(id)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-600">{error ?? 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <Image source={{ uri: product.getImage() }} className="w-full h-64" />
      <View className="p-6">
        <Text className="text-sm text-blue-600 uppercase font-medium">{product.getCategory()}</Text>
        <Text className="text-2xl font-bold text-gray-900 mt-2">{product.getTitle()}</Text>
        <Text className="text-2xl font-bold text-gray-900 mt-4">{product.getPrice().format()}</Text>
        <Text className="text-gray-600 mt-6 leading-6">{product.getDescription()}</Text>
      </View>
    </ScrollView>
  );
}
