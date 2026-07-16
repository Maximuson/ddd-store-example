import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Product } from '@ddd-store/catalog';
import { catalogPage } from '@ddd-store/web-shared/catalog';
import { productStoreLogic } from '@ddd-store/web-shared/catalog';
import { CONTAINER } from '../../di/container.token';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="text-center py-12 text-gray-500">Loading product...</div>
    } @else if (error()) {
      <a [routerLink]="catalogPath" class="text-blue-600 hover:underline mb-4 inline-block">← Back to catalog</a>
      <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error() }}</div>
    } @else if (product(); as p) {
      <a [routerLink]="catalogPath" class="text-blue-600 hover:underline mb-6 inline-block">← Back to catalog</a>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <img [src]="p.getImage()" [alt]="p.getTitle()" class="w-full h-80 object-cover" />
        <div class="p-8">
          <span class="text-sm font-medium text-blue-600 uppercase">{{ p.getCategory() }}</span>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ p.getTitle() }}</h1>
          <p class="text-3xl font-bold text-gray-900 mt-4">{{ p.getPrice().format() }}</p>
          <p class="text-gray-600 mt-6 leading-relaxed">{{ p.getDescription() }}</p>
        </div>
      </div>
    }
  `,
})
export class ProductPageComponent implements OnInit {
  private readonly container = inject(CONTAINER);
  private readonly route = inject(ActivatedRoute);
  private readonly store = productStoreLogic.createStore();
  readonly catalogPath = catalogPage.path;
  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.store.subscribe(() => {
      const snap = this.store.get();
      this.product.set(snap.context.data);
      this.loading.set(snap.context.loading);
      this.error.set(snap.context.error);
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) void this.fetch(id);
  }

  private async fetch(id: string) {
    this.store.trigger.setLoading();
    try {
      const result = await this.container.getProductByIdUseCase.execute(id);
      this.store.trigger.setData({ data: result });
    } catch (e) {
      this.store.trigger.setError({
        error: e instanceof Error ? e.message : 'Product not found',
      });
    }
  }
}
