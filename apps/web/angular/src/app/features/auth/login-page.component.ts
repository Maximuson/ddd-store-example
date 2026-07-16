import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loginPage, catalogPage } from '@ddd-store/web-shared';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <form class="space-y-4" (ngSubmit)="submit()">
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
          @if (auth.error()) {
            <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{{ auth.error() }}</div>
          }
          <input [(ngModel)]="email" name="email" type="email" placeholder="user@demo.com" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <input [(ngModel)]="password" name="password" type="password" placeholder="password123" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <button type="submit" [disabled]="loading()"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly title = loginPage.title;
  email = '';
  password = '';
  readonly loading = signal(false);

  async submit() {
    this.loading.set(true);
    try {
      await this.auth.login(this.email, this.password);
      await this.router.navigateByUrl(catalogPage.path);
    } catch {
      // error on auth service
    } finally {
      this.loading.set(false);
    }
  }
}
