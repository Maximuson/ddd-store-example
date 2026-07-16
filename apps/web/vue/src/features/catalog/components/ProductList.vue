<script setup lang="ts">
import type { Product } from '@ddd-store/catalog';
import ProductCard from './ProductCard.vue';

defineProps<{
  products: Product[];
  isLoading?: boolean;
  getProductHref: (id: string) => string;
}>();
</script>

<template>
  <div v-if="isLoading" class="text-center py-12 text-gray-500">Loading products...</div>
  <div v-else-if="products.length === 0" class="text-center py-12 text-gray-500">
    No products found.
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.getId()"
      :product="product"
      :href="getProductHref(product.getId())"
    />
  </div>
</template>
