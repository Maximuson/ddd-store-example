<script setup lang="ts">
import type { Session } from '@ddd-store/shared';

const props = defineProps<{
  sessions: Session[];
  currentUserAgent: string;
  onTerminate: (sessionId: string) => void;
  isTerminating?: string | null;
}>();

function isCurrent(userAgent: string) {
  return userAgent === props.currentUserAgent;
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Active Sessions</h2>
    <div class="space-y-4">
      <div
        v-for="session in sessions"
        :key="session.id"
        :class="[
          'flex items-center justify-between p-4 rounded-lg border',
          isCurrent(session.userAgent) ? 'border-blue-300 bg-blue-50' : 'border-gray-200',
        ]"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900">
              {{ session.getDeviceLabel() }}
              {{ session.deviceType === 'WEB' ? '— Web' : '— Mobile' }}
            </span>
            <span
              v-if="isCurrent(session.userAgent)"
              class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full"
            >
              Current device
            </span>
            <span
              v-if="session.isActive()"
              class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
            >
              Active
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Created: {{ session.createdAt.toLocaleString() }}</p>
          <p class="text-sm text-gray-500">Last active: {{ session.lastActivityAt.toLocaleString() }}</p>
        </div>
        <button
          v-if="!isCurrent(session.userAgent)"
          class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          :disabled="isTerminating === session.id"
          @click="onTerminate(session.id)"
        >
          {{ isTerminating === session.id ? 'Terminating...' : 'Terminate' }}
        </button>
      </div>
    </div>
  </div>
</template>
