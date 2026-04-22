/**
 * CAPA DE APLICACIÓN — MisionesService
 * Caso de uso: obtener listado de misiones con estado de completado por usuario.
 */
import { Injectable, Inject } from '@nestjs/common';
import {
  IMisionRepository,
  IUserRepository,
  MISION_REPOSITORY,
  USER_REPOSITORY,
} from '../../domain/interfaces/repositories.interface';

@Injectable()
export class MisionesService {
  constructor(
    @Inject(MISION_REPOSITORY)
    private readonly misionRepo: IMisionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async getMisiones(uid?: string) {
    const misiones = await this.misionRepo.findAll();

    if (!uid) return misiones;

    const user = await this.userRepo.findById(uid);
    const completed = user?.completedMissions ?? [];

    return misiones.map((m) => ({
      ...m,
      completed: completed.includes(m.id),
    }));
  }
}
