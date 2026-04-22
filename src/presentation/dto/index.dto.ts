/**
 * CAPA DE PRESENTACIÓN — DTOs
 * Objetos de transferencia de datos que validan la entrada HTTP.
 * Son la "frontera" entre el mundo externo y la lógica interna.
 */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/* ─── Auth ─────────────────────────────────────────────────────── */

export class LoginDto {
  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsOptional() middleName?: string;
  @IsString() @IsNotEmpty() lastName: string;

  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsString() @MinLength(6, { message: 'Mínimo 6 caracteres' })
  password: string;

  @IsString() @IsOptional() confirmPassword?: string;
  @IsString() @IsNotEmpty() career: string;
}

/* ─── QR ────────────────────────────────────────────────────────── */

export class ValidateQrDto {
  @IsString() @IsNotEmpty() data: string;
}

/* ─── Progress ──────────────────────────────────────────────────── */

export class CompleteMissionDto {
  @IsString() @IsNotEmpty() missionId: string;
}
