import { InjectionToken } from '@angular/core';
import type { container } from './container';

export type Container = typeof container;

export const CONTAINER = new InjectionToken<Container>('CONTAINER');
