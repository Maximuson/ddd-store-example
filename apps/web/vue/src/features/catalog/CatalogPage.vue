<script setup lang="ts">
import { onMounted } from 'vue';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { useContainer } from '../../di/useContainer';
import ProductList from './components/ProductList.vue';
import { useCatalog } from './composables/useCatalog';

const { getProductsUseCase } = useContainer();
const { products, loading, error, fetch } = useCatalog(getProductsUseCase);

onMounted(() => {
  fetch();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ catalogPage.title }}</h1>
    <div v-if="error()" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{{ error() }}</div>
    <ProductList
      :products="products()"
      :is-loading="loading()"
      :get-product-href="(id: string) => `/product/${id}`"
    />
  </div>
</template>
