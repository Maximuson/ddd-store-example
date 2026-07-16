import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(['WEB', 'MOBILE'])
  deviceType!: 'WEB' | 'MOBILE';

  @IsString()
  @IsNotEmpty()
  userAgent!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  @IsOptional()
  sessionId?: string;
}
