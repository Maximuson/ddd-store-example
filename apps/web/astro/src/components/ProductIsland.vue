<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { catalogPage, productPage } from '@ddd-store/web-shared/catalog/pages';
import { GetProductByIdUseCase, MockProductRepository, type Product } from '@ddd-store/catalog';

const props = defineProps<{ id: string }>();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function load(id: string) {
  loading.value = true;
  error.value = null;
  product.value = null;

  const useCase = new GetProductByIdUseCase(new MockProductRepository());
  try {
    product.value = await useCase.execute(id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load';
  } finally {
    loading.value = false;
  }
}

onMounted(() => load(props.id));
watch(() => props.id, load);
</script>

<template>
  <div>
    <p class="text-sm text-yellow-800 bg-yellow-100 inline-block px-2 py-1 rounded-full mb-4">
      Astro island — mock product via {{ productPage.id }} slice
    </p>
    <div v-if="loading" class="text-center py-12 text-gray-500">Loading product...</div>
    <div v-else-if="error">
      <a :href="catalogPage.path" class="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to catalog
      </a>
      <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error }}</div>
    </div>
    <div v-else-if="product">
      <a :href="catalogPage.path" class="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to catalog
      </a>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <img :src="product.getImage()" :alt="product.getTitle()" class="w-full h-80 object-cover" />
        <div class="p-8">
          <span class="text-sm font-medium text-blue-600 uppercase">{{ product.getCategory() }}</span>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ product.getTitle() }}</h1>
          <p class="text-3xl font-bold text-gray-900 mt-4">{{ product.getPrice().format() }}</p>
          <p class="text-gray-600 mt-6 leading-relaxed">{{ product.getDescription() }}</p>
          <p class="text-sm text-gray-400 mt-4">
            Added {{ product.getCreatedAt().toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
