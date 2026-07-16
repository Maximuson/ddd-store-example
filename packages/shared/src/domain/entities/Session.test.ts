import { describe, it, expect } from 'vitest';
import { Money } from '../value-objects/Money';
import { Email } from '../value-objects/Email';
import { Role } from '../value-objects/Role';
import { Session } from './Session';

describe('Money', () => {
  it('cannot have negative price', () => {
    expect(() => Money.create(-10)).toThrow('Price cannot be negative');
  });

  it('formats currency correctly', () => {
    const money = Money.create(29.99);
    expect(money.getAmount()).toBe(29.99);
    expect(money.format()).toContain('29.99');
  });
});

describe('Email', () => {
  it('validates email format', () => {
    expect(() => Email.create('invalid')).toThrow('Invalid email');
    const email = Email.create('user@demo.com');
    expect(email.getValue()).toBe('user@demo.com');
  });
});

describe('Role', () => {
  it('identifies admin role', () => {
    expect(Role.ADMIN.isAdmin()).toBe(true);
    expect(Role.USER.isAdmin()).toBe(false);
  });
});

describe('Session', () => {
  it('web session expires when past expiresAt', () => {
    const session = Session.create({
      id: '1',
      userId: 'u1',
      deviceType: 'WEB',
      userAgent: 'Chrome',
      createdAt: new Date('2026-01-01'),
      lastActivityAt: new Date('2026-01-01'),
      expiresAt: new Date('2026-01-02'),
    });
    expect(session.isExpired()).toBe(true);
  });

  it('mobile session never auto-expires', () => {
    const session = Session.create({
      id: '2',
      userId: 'u1',
      deviceType: 'MOBILE',
      userAgent: 'Expo',
      createdAt: new Date('2026-01-01'),
      lastActivityAt: new Date('2026-01-01'),
      expiresAt: null,
    });
    expect(session.isExpired()).toBe(false);
  });
});
