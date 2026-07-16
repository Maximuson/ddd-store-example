<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginPage, catalogPage } from '@ddd-store/web-shared';
import { useAuth } from '../../app/useAuth';
import LoginForm from './components/LoginForm.vue';

const { login, error } = useAuth();
const router = useRouter();
const isLoading = ref(false);

async function handleSubmit(email: string, password: string) {
  isLoading.value = true;
  try {
    await login(email, password);
    router.push(catalogPage.path);
  } catch {
    // handled in auth
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
      <h1 class="sr-only">{{ loginPage.title }}</h1>
      <LoginForm :on-submit="handleSubmit" :is-loading="isLoading" :error="error" />
    </div>
  </div>
</template>
