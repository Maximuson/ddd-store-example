import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '@ddd-store/catalog';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { catalogStoreLogic } from '@ddd-store/web-shared/catalog';
import { CONTAINER } from '../../di/container.token';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ title }}</h1>
      @if (error()) {
        <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{{ error() }}</div>
      }
      @if (loading()) {
        <div class="text-center py-12 text-gray-500">Loading products...</div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products(); track product.getId()) {
            <a [routerLink]="['/product', product.getId()]"
              class="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md">
              <img [src]="product.getImage()" [alt]="product.getTitle()" class="w-full h-48 object-cover" />
              <div class="p-4">
                <span class="text-xs font-medium text-blue-600 uppercase">{{ product.getCategory() }}</span>
                <h3 class="text-lg font-semibold text-gray-900 mt-1">{{ product.getTitle() }}</h3>
                <p class="text-xl font-bold text-gray-900 mt-2">{{ product.getPrice().format() }}</p>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class CatalogPageComponent implements OnInit {
  private readonly container = inject(CONTAINER);
  private readonly store = catalogStoreLogic.createStore();
  readonly title = catalogPage.title;
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.store.subscribe(() => {
      const snap = this.store.get();
      this.products.set(snap.context.data ?? []);
      this.loading.set(snap.context.loading);
      this.error.set(snap.context.error);
    });
    void this.fetch();
  }

  private async fetch() {
    this.store.trigger.setLoading();
    try {
      const result = await this.container.getProductsUseCase.execute();
      this.store.trigger.setData({ data: result });
    } catch (e) {
      this.store.trigger.setError({
        error: e instanceof Error ? e.message : 'Failed to load products',
      });
    }
  }
}
