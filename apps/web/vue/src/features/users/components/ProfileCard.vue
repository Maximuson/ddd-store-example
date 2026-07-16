<script setup lang="ts">
import type { User } from '@ddd-store/users';

defineProps<{
  user: User;
}>();
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Profile</h2>
    <dl class="space-y-3">
      <div>
        <dt class="text-sm text-gray-500">Name</dt>
        <dd class="text-gray-900 font-medium">{{ user.getName() }}</dd>
      </div>
      <div>
        <dt class="text-sm text-gray-500">Email</dt>
        <dd class="text-gray-900">{{ user.getEmail() }}</dd>
      </div>
      <div>
        <dt class="text-sm text-gray-500">Role</dt>
        <dd>
          <span
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              user.isAdmin() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800',
            ]"
          >
            {{ user.getRole().getValue() }}
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>
