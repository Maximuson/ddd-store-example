import { inject, type InjectionKey } from 'vue';
import { container, type Container } from './container';

export const containerKey: InjectionKey<Container> = Symbol('container');

export function provideContainer() {
  return { [containerKey as symbol]: container };
}

export function useContainer(): Container {
  const ctx = inject(containerKey);
  if (!ctx) throw new Error('Container not provided');
  return ctx;
}
