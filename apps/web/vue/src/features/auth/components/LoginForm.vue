<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}>();

const email = ref('');
const password = ref('');

function handleSubmit(e: Event) {
  e.preventDefault();
  props.onSubmit(email.value, password.value);
}
</script>

<template>
  <form class="space-y-4 max-w-md mx-auto" @submit="handleSubmit">
    <h2 class="text-2xl font-bold text-gray-900">Sign In</h2>
    <div v-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{{ error }}</div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="user@demo.com"
        required
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="password123"
        required
      />
    </div>
    <button
      type="submit"
      :disabled="isLoading"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {{ isLoading ? 'Signing in...' : 'Sign In' }}
    </button>
    <p class="text-sm text-gray-500 text-center">Demo: user@demo.com / password123</p>
  </form>
</template>
