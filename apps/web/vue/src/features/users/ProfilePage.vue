<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { profilePage } from '@ddd-store/web-shared/users';
import { useAuth } from '../../app/useAuth';
import { useContainer } from '../../di/useContainer';
import ProfileCard from './components/ProfileCard.vue';
import SessionList from './components/SessionList.vue';
import { useProfile } from './composables/useProfile';

const { user } = useAuth();
const { getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase } =
  useContainer();
const { user: profileUser, sessions, loading, error, terminatingId, load, terminate } =
  useProfile(getUserProfileUseCase, listActiveSessionsUseCase, terminateSessionUseCase);

onMounted(() => {
  if (user.value) load(user.value.getId());
});

watch(user, (u) => {
  if (u) load(u.getId());
});
</script>

<template>
  <div v-if="loading()" class="text-center py-12 text-gray-500">Loading profile...</div>
  <div v-else-if="error()" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error() }}</div>
  <div v-else-if="profileUser()" class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">{{ profilePage.title }}</h1>
    <ProfileCard :user="profileUser()!" />
    <SessionList
      :sessions="sessions()"
      :current-user-agent="navigator.userAgent"
      :is-terminating="terminatingId"
      :on-terminate="(id: string) => terminate(id, profileUser()!.getId())"
    />
  </div>
</template>
