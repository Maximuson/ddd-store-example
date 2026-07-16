<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Product } from '@ddd-store/catalog';

defineProps<{
  product: Product;
  href: string;
}>();
</script>

<template>
  <RouterLink
    :to="href"
    class="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
  >
    <img :src="product.getImage()" :alt="product.getTitle()" class="w-full h-48 object-cover" />
    <div class="p-4">
      <span class="text-xs font-medium text-blue-600 uppercase">{{ product.getCategory() }}</span>
      <h3 class="text-lg font-semibold text-gray-900 mt-1">{{ product.getTitle() }}</h3>
      <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ product.getDescription() }}</p>
      <p class="text-xl font-bold text-gray-900 mt-2">{{ product.getPrice().format() }}</p>
    </div>
  </RouterLink>
</template>
