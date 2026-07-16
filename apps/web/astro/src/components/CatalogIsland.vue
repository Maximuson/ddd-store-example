<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { catalogPage } from '@ddd-store/web-shared/catalog/pages';
import { GetProductsUseCase, MockProductRepository, type Product } from '@ddd-store/catalog';

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const useCase = new GetProductsUseCase(new MockProductRepository());
  try {
    products.value = await useCase.execute();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <p class="text-sm text-yellow-800 bg-yellow-100 inline-block px-2 py-1 rounded-full mb-4">
      Astro island — mock catalog via {{ catalogPage.id }} slice
    </p>
    <div v-if="loading" class="text-center py-12 text-gray-500">Loading products...</div>
    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <a
        v-for="product in products"
        :key="product.getId()"
        :href="`/product/${product.getId()}`"
        class="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md"
      >
        <img :src="product.getImage()" :alt="product.getTitle()" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ product.getTitle() }}</h3>
          <p class="text-xl font-bold text-gray-900 mt-2">{{ product.getPrice().format() }}</p>
        </div>
      </a>
    </div>
  </div>
</template>
