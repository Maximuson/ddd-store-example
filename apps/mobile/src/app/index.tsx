import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../features/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace('/catalog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 justify-center px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">DDD Store</Text>

      {error && (
        <View className="bg-red-50 rounded-lg p-3 mb-4">
          <Text className="text-red-700 text-sm">{error}</Text>
        </View>
      )}

      <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-6"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-600 rounded-lg py-3 items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      <Text className="text-sm text-gray-500 text-center mt-4">
        Demo: user@demo.com / password123
      </Text>
    </View>
  );
}
