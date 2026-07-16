import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { User } from '@ddd-store/users';
import type { Product, CreateProductData } from '@ddd-store/catalog';
import type { Session } from '@ddd-store/shared';
import {
  adminPage,
  ADMIN_TABS,
  emptyProductForm,
  type AdminTab,
} from '@ddd-store/web-shared/admin';
import { CONTAINER } from '../../di/container.token';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ title }}</h1>
      <div class="flex gap-4 mb-8 border-b border-gray-200">
        @for (t of tabs; track t) {
          <button (click)="tab.set(t)" [class]="tabClass(t)">{{ t }}</button>
        }
      </div>
      @if (tab() === 'users') {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <tbody>
              @for (u of users(); track u.getId()) {
                <tr class="border-t border-gray-200">
                  <td class="px-4 py-3">{{ u.getName() }}</td>
                  <td class="px-4 py-3">{{ u.getEmail() }}</td>
                  <td class="px-4 py-3">{{ u.getRole().getValue() }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      @if (tab() === 'sessions') {
        @for (s of sessions(); track s.id) {
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-2">
            {{ s.getDeviceLabel() }} — {{ s.deviceType }}
          </div>
        }
      }
      @if (tab() === 'products') {
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <tbody>
              @for (p of products(); track p.getId()) {
                <tr class="border-t border-gray-200">
                  <td class="px-4 py-3">{{ p.getTitle() }}</td>
                  <td class="px-4 py-3">{{ p.getPrice().format() }}</td>
                  <td class="px-4 py-3">
                    <button class="text-red-600 text-sm" (click)="deleteProduct(p.getId())">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminPageComponent implements OnInit {
  private readonly container = inject(CONTAINER);
  readonly title = adminPage.title;
  readonly tabs = ADMIN_TABS;
  readonly tab = signal<AdminTab>('users');
  readonly users = signal<User[]>([]);
  readonly sessions = signal<Session[]>([]);
  readonly products = signal<Product[]>([]);
  readonly form = signal<CreateProductData>({ ...emptyProductForm });

  ngOnInit() {
    void this.loadData();
  }

  tabClass(t: AdminTab) {
    return this.tab() === t
      ? 'pb-3 px-1 text-sm font-medium capitalize border-b-2 border-blue-600 text-blue-600 -mb-px'
      : 'pb-3 px-1 text-sm font-medium capitalize border-b-2 border-transparent text-gray-500 -mb-px';
  }

  async loadData() {
    const [u, s, p] = await Promise.all([
      this.container.listAllUsersUseCase.execute(),
      this.container.listAllSessionsUseCase.execute(),
      this.container.getProductsUseCase.execute(),
    ]);
    this.users.set(u);
    this.sessions.set(s);
    this.products.set(p);
  }

  async deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    await this.container.deleteProductUseCase.execute(id);
    await this.loadData();
  }
}
