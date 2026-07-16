import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { catalogPage, profilePage, adminPage } from '@ddd-store/web-shared';
import { AuthService } from '../services/auth.service';
import { CONTAINER } from '../di/container.token';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center gap-6">
              <a [routerLink]="catalogPath" class="text-xl font-bold text-blue-600">DDD Store</a>
              @if (auth.user(); as user) {
                <a [routerLink]="catalogPath" class="text-gray-600 hover:text-gray-900">Catalog</a>
                <a [routerLink]="profilePath" class="text-gray-600 hover:text-gray-900">Profile</a>
                @if (user.isAdmin()) {
                  <a [routerLink]="adminPath" class="text-gray-600 hover:text-gray-900">Admin</a>
                }
              }
            </div>
            <div class="flex items-center gap-4">
              @if (container.useMock) {
                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Mock Mode</span>
              }
              @if (auth.user(); as user) {
                <span class="text-sm text-gray-600">{{ user.getName() }}</span>
                <button class="text-sm text-red-600 hover:text-red-800" (click)="logout()">Logout</button>
              }
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppLayoutComponent {
  readonly auth = inject(AuthService);
  readonly container = inject(CONTAINER);
  private readonly router = inject(Router);

  readonly catalogPath = catalogPage.path;
  readonly profilePath = profilePage.path;
  readonly adminPath = adminPage.path;

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
