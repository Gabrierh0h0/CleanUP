/**
 * CAPA DE APLICACIÓN — LogrosService
 * Caso de uso: obtener logros con estado de desbloqueado por usuario.
 */
import { Injectable, Inject } from '@nestjs/common';
import {
  ILogroRepository,
  IUserRepository,
  LOGRO_REPOSITORY,
  USER_REPOSITORY,
} from '../../domain/interfaces/repositories.interface';

@Injectable()
export class LogrosService {
  constructor(
    @Inject(LOGRO_REPOSITORY)
    private readonly logroRepo: ILogroRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async getLogros(uid?: string) {
    const logros = await this.logroRepo.findAll();

    if (!uid) return logros;

    const user = await this.userRepo.findById(uid);
    const unlocked = user?.unlockedLogros ?? [];

    return logros.map((l) => ({
      ...l,
      unlocked: unlocked.includes(l.id),
    }));
  }
}
