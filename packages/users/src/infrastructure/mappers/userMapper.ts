import { User } from '../../domain/entities/User';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function mapUserDtoToEntity(dto: UserDto): User {
  return User.create({
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
  });
}

export function mapUserEntityToDto(user: User): UserDto {
  return user.toJSON();
}
