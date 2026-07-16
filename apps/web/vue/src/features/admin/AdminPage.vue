<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@ddd-store/users';
import type { Product, CreateProductData } from '@ddd-store/catalog';
import type { Session } from '@ddd-store/shared';
import {
  adminPage,
  ADMIN_TABS,
  emptyProductForm,
  type AdminTab,
} from '@ddd-store/web-shared/admin';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { useAuth } from '../../app/useAuth';
import { useContainer } from '../../di/useContainer';

const router = useRouter();
const { user } = useAuth();
const {
  listAllUsersUseCase,
  listAllSessionsUseCase,
  getProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} = useContainer();

const tab = ref<AdminTab>('users');
const users = ref<User[]>([]);
const sessions = ref<Session[]>([]);
const products = ref<Product[]>([]);
const showForm = ref(false);
const editingId = ref<string | null>(null);
const form = ref<CreateProductData>({ ...emptyProductForm });

onMounted(() => {
  if (!user.value?.isAdmin()) {
    router.push(catalogPage.path);
    return;
  }
  loadData();
});

async function loadData() {
  const [u, s, p] = await Promise.all([
    listAllUsersUseCase.execute(),
    listAllSessionsUseCase.execute(),
    getProductsUseCase.execute(),
  ]);
  users.value = u;
  sessions.value = s;
  products.value = p;
}

async function handleSaveProduct() {
  if (editingId.value) {
    await updateProductUseCase.execute(editingId.value, form.value);
  } else {
    await createProductUseCase.execute(form.value);
  }
  showForm.value = false;
  editingId.value = null;
  form.value = { ...emptyProductForm };
  await loadData();
}

function handleEdit(product: Product) {
  const json = product.toJSON();
  form.value = {
    title: json.title,
    description: json.description,
    price: json.price,
    image: json.image,
    category: json.category,
  };
  editingId.value = product.getId();
  showForm.value = true;
}

async function handleDelete(id: string) {
  if (confirm('Delete this product?')) {
    await deleteProductUseCase.execute(id);
    await loadData();
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ adminPage.title }}</h1>

    <div class="flex gap-4 mb-8 border-b border-gray-200">
      <button
        v-for="t in ADMIN_TABS"
        :key="t"
        :class="[
          'pb-3 px-1 text-sm font-medium capitalize border-b-2 -mb-px',
          tab === t
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700',
        ]"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div v-if="tab === 'users'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Email</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Role</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="u in users" :key="u.getId()">
            <td class="px-4 py-3">{{ u.getName() }}</td>
            <td class="px-4 py-3">{{ u.getEmail() }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  u.isAdmin() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ u.getRole().getValue() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="tab === 'sessions'" class="space-y-3">
      <div
        v-for="s in sessions"
        :key="s.id"
        class="bg-white rounded-lg border border-gray-200 p-4"
      >
        <div class="flex justify-between">
          <span class="font-medium">{{ s.getDeviceLabel() }} — {{ s.deviceType }}</span>
          <span
            :class="[
              'text-xs px-2 py-1 rounded-full',
              s.isActive() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500',
            ]"
          >
            {{ s.isActive() ? 'Active' : 'Expired' }}
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-1">User: {{ s.userId }}</p>
        <p class="text-sm text-gray-500">Last active: {{ s.lastActivityAt.toLocaleString() }}</p>
      </div>
    </div>

    <div v-else>
      <div class="flex justify-between mb-4">
        <h2 class="text-lg font-semibold">Products</h2>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          @click="showForm = true; editingId = null"
        >
          Add Product
        </button>
      </div>

      <div v-if="showForm" class="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <h3 class="font-semibold">{{ editingId ? 'Edit Product' : 'New Product' }}</h3>
        <input
          v-model="form.title"
          placeholder="Title"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          v-model="form.description"
          placeholder="Description"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          v-model="form.image"
          placeholder="Image"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          v-model="form.category"
          placeholder="Category"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          v-model.number="form.price"
          type="number"
          placeholder="Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <div class="flex gap-2">
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            @click="handleSaveProduct"
          >
            Save
          </button>
          <button class="text-gray-600 px-4 py-2 text-sm" @click="showForm = false">Cancel</button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3">Title</th>
              <th class="text-left px-4 py-3">Category</th>
              <th class="text-left px-4 py-3">Price</th>
              <th class="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="p in products" :key="p.getId()">
              <td class="px-4 py-3">{{ p.getTitle() }}</td>
              <td class="px-4 py-3">{{ p.getCategory() }}</td>
              <td class="px-4 py-3">{{ p.getPrice().format() }}</td>
              <td class="px-4 py-3 space-x-2">
                <button class="text-blue-600 text-sm" @click="handleEdit(p)">Edit</button>
                <button class="text-red-600 text-sm" @click="handleDelete(p.getId())">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
