<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { catalogPage, profilePage, adminPage } from '@ddd-store/web-shared';
import { useAuth } from './useAuth';
import { useContainer } from '../di/useContainer';

const { user, logout } = useAuth();
const { useMock } = useContainer();
const router = useRouter();

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-6">
            <RouterLink :to="catalogPage.path" class="text-xl font-bold text-blue-600">
              DDD Store
            </RouterLink>
            <template v-if="user">
              <RouterLink :to="catalogPage.path" class="text-gray-600 hover:text-gray-900">
                Catalog
              </RouterLink>
              <RouterLink :to="profilePage.path" class="text-gray-600 hover:text-gray-900">
                Profile
              </RouterLink>
              <RouterLink
                v-if="user.isAdmin()"
                :to="adminPage.path"
                class="text-gray-600 hover:text-gray-900"
              >
                Admin
              </RouterLink>
            </template>
          </div>
          <div class="flex items-center gap-4">
            <span
              v-if="useMock"
              class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
            >
              Mock Mode
            </span>
            <template v-if="user">
              <span class="text-sm text-gray-600">{{ user.getName() }}</span>
              <button class="text-sm text-red-600 hover:text-red-800" @click="handleLogout">
                Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>
