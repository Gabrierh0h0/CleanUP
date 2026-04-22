/**
 * CAPA DE APLICACIÓN — AuthService
 * Orquesta los casos de uso de autenticación:
 * login, registro y consulta del perfil propio.
 */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { IUserRepository, USER_REPOSITORY } from '../../domain/interfaces/repositories.interface';
import { UserModel } from '../../domain/models/user.model';

interface FirebaseSignInResponse {
  idToken: string;
  localId: string;
  email: string;
  expiresIn: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  career: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /** Caso de uso: obtener perfil propio */
  async me(uid: string) {
    const user = await this.userRepository.findById(uid);
    return user ?? { uid, role: 'student' };
  }

  /** Caso de uso: iniciar sesión */
  async login(dto: LoginDto) {
    const apiKey = this.configService.get<string>('FIREBASE_WEB_API_KEY');
    if (!apiKey) throw new BadRequestException('Configuración de Firebase incompleta');

    try {
      const response = await axios.post<FirebaseSignInResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        { email: dto.email, password: dto.password, returnSecureToken: true },
      );
      const { idToken, localId, email, expiresIn } = response.data;
      return {
        token: idToken,
        user: { uid: localId, email },
        expiresIn: Number(expiresIn),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const code = error.response.data?.error?.message;
        if (code === 'INVALID_LOGIN_CREDENTIALS')
          throw new UnauthorizedException('Credenciales inválidas');
      }
      throw new UnauthorizedException('Error al iniciar sesión');
    }
  }

  /** Caso de uso: registrar nuevo usuario */
  async register(dto: RegisterDto) {
    if (dto.confirmPassword && dto.confirmPassword !== dto.password)
      throw new BadRequestException('Las contraseñas no coinciden');

    try {
      const record = await this.firebaseService.auth.createUser({
        email: dto.email,
        password: dto.password,
      });

      const newUser = new UserModel({
        uid: record.uid,
        firstName: dto.firstName,
        middleName: dto.middleName ?? '',
        lastName: dto.lastName,
        email: dto.email,
        career: dto.career,
        role: 'student',
        totalPoints: 0,
        completedMissions: [],
        unlockedLogros: [],
        createdAt: new Date(),
      });

      await this.userRepository.save(newUser);
    } catch (e: any) {
      const code = e?.code ?? '';
      if (code === 'auth/email-already-exists')
        throw new BadRequestException('Ese correo ya está registrado');
      if (code === 'auth/invalid-password')
        throw new BadRequestException('Contraseña inválida (mínimo 6 caracteres)');
      if (code === 'auth/invalid-email')
        throw new BadRequestException('Correo inválido');
      throw new BadRequestException('No se pudo crear el usuario');
    }

    return this.login({ email: dto.email, password: dto.password });
  }
}
