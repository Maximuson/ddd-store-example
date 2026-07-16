import { Email, Role } from '@ddd-store/shared';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class User {
  private constructor(
    private readonly id: string,
    private readonly email: Email,
    private readonly name: string,
    private readonly role: Role,
  ) {}

  static create(props: UserProps): User {
    return new User(
      props.id,
      Email.create(props.email),
      props.name,
      Role.fromString(props.role),
    );
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getName(): string {
    return this.name;
  }

  getRole(): Role {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  toJSON(): UserProps {
    return {
      id: this.id,
      email: this.email.getValue(),
      name: this.name,
      role: this.role.getValue(),
    };
  }
}
