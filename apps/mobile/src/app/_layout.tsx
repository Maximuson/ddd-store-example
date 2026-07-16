import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../features/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'Sign In' }} />
        <Stack.Screen name="catalog" options={{ title: 'Catalog' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack>
    </AuthProvider>
  );
}
