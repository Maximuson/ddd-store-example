import { ValidationError } from '../errors';

export type RoleType = 'USER' | 'ADMIN';

export class Role {
  private constructor(private readonly value: RoleType) {}

  static USER = new Role('USER');
  static ADMIN = new Role('ADMIN');

  static fromString(value: string): Role {
    if (value === 'USER') return Role.USER;
    if (value === 'ADMIN') return Role.ADMIN;
    throw new ValidationError(`Invalid role: ${value}`);
  }

  getValue(): RoleType {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === 'ADMIN';
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }
}
