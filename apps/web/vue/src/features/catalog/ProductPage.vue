<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { useContainer } from '../../di/useContainer';
import { useProduct } from './composables/useProduct';

const route = useRoute();
const { getProductByIdUseCase } = useContainer();
const { product, loading, error, fetch } = useProduct(getProductByIdUseCase);

onMounted(() => {
  const id = route.params.id as string;
  if (id) fetch(id);
});

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') fetch(id);
  },
);
</script>

<template>
  <div v-if="loading()" class="text-center py-12 text-gray-500">Loading product...</div>
  <div v-else-if="error()">
    <RouterLink :to="catalogPage.path" class="text-blue-600 hover:underline mb-4 inline-block">
      ← Back to catalog
    </RouterLink>
    <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error() }}</div>
  </div>
  <div v-else-if="product()">
    <RouterLink :to="catalogPage.path" class="text-blue-600 hover:underline mb-6 inline-block">
      ← Back to catalog
    </RouterLink>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
      <img
        :src="product()!.getImage()"
        :alt="product()!.getTitle()"
        class="w-full h-80 object-cover"
      />
      <div class="p-8">
        <span class="text-sm font-medium text-blue-600 uppercase">{{ product()!.getCategory() }}</span>
        <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ product()!.getTitle() }}</h1>
        <p class="text-3xl font-bold text-gray-900 mt-4">{{ product()!.getPrice().format() }}</p>
        <p class="text-gray-600 mt-6 leading-relaxed">{{ product()!.getDescription() }}</p>
        <p class="text-sm text-gray-400 mt-4">
          Added {{ product()!.getCreatedAt().toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>
