import { Component, inject, OnInit, signal } from '@angular/core';
import type { Session } from '@ddd-store/shared';
import type { User } from '@ddd-store/users';
import { profilePage } from '@ddd-store/web-shared/users';
import { profileStoreLogic } from '@ddd-store/web-shared/users';
import { AuthService } from '../../services/auth.service';
import { CONTAINER } from '../../di/container.token';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  template: `
    @if (loading()) {
      <div class="text-center py-12 text-gray-500">Loading profile...</div>
    } @else if (error()) {
      <div class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{{ error() }}</div>
    } @else if (user(); as u) {
      <div class="space-y-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Profile</h2>
          <p class="font-medium">{{ u.getName() }}</p>
          <p class="text-gray-600">{{ u.getEmail() }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Active Sessions</h2>
          @for (session of sessions(); track session.id) {
            <div class="p-4 border border-gray-200 rounded-lg mb-2">
              <span class="font-medium">{{ session.getDeviceLabel() }}</span>
              @if (session.userAgent !== userAgent) {
                <button class="text-red-600 text-sm ml-4" (click)="terminate(session.id)">Terminate</button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly container = inject(CONTAINER);
  private readonly store = profileStoreLogic.createStore();
  readonly title = profilePage.title;
  readonly userAgent = navigator.userAgent;
  readonly user = signal<User | null>(null);
  readonly sessions = signal<Session[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.store.subscribe(() => {
      const snap = this.store.get();
      this.user.set(snap.context.data?.user ?? null);
      this.sessions.set(snap.context.data?.sessions ?? []);
      this.loading.set(snap.context.loading);
      this.error.set(snap.context.error);
    });
    const current = this.auth.user();
    if (current) void this.load(current.getId());
  }

  private async load(userId: string) {
    this.store.trigger.setLoading();
    try {
      const [user, sessions] = await Promise.all([
        this.container.getUserProfileUseCase.execute(userId),
        this.container.listActiveSessionsUseCase.execute(userId),
      ]);
      this.store.trigger.setData({ data: { user, sessions } });
    } catch (e) {
      this.store.trigger.setError({
        error: e instanceof Error ? e.message : 'Failed to load profile',
      });
    }
  }

  async terminate(sessionId: string) {
    const u = this.user();
    if (!u) return;
    await this.container.terminateSessionUseCase.execute(sessionId);
    await this.load(u.getId());
  }
}
