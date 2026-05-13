/**
 * CAPA DE DOMINIO — Interfaces de Repositorio
 * Define contratos que la capa de infraestructura debe implementar.
 * El dominio no sabe nada de Firebase; solo conoce estos contratos.
 */
import { UserModel } from '../../entities/user.model';
import { MisionModel } from '../../entities/mision.model';
import { LogroModel } from '../../entities/logro.model';

export interface IUserRepository {
  findById(uid: string): Promise<UserModel | null>;
  save(user: UserModel): Promise<void>;
  update(uid: string, data: Partial<UserModel>): Promise<void>;
  getRanking(limit?: number): Promise<UserModel[]>;
}

export interface IMisionRepository {
  findAll(): Promise<MisionModel[]>;
  findById(id: string): Promise<MisionModel | null>;
}

export interface ILogroRepository {
  findAll(): Promise<LogroModel[]>;
  findById(id: string): Promise<LogroModel | null>;
}

/** Tokens de inyección de dependencias (Principio D de SOLID) */
export const USER_REPOSITORY  = 'USER_REPOSITORY';
export const MISION_REPOSITORY = 'MISION_REPOSITORY';
export const LOGRO_REPOSITORY  = 'LOGRO_REPOSITORY';
