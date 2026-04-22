/**
 * CAPA DE DOMINIO — Modelo de Usuario
 * Representa la entidad central del negocio.
 * No depende de ninguna capa externa.
 */
export class UserModel {
  uid: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  career: string;
  role: 'student' | 'teacher' | 'admin';
  totalPoints: number;
  completedMissions: string[];
  unlockedLogros: string[];
  createdAt: Date;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
    this.totalPoints = partial.totalPoints ?? 0;
    this.completedMissions = partial.completedMissions ?? [];
    this.unlockedLogros = partial.unlockedLogros ?? [];
    this.role = partial.role ?? 'student';
  }

  /** Regla de negocio: ¿ya completó esta misión? */
  hasMission(missionId: string): boolean {
    return this.completedMissions.includes(missionId);
  }

  /** Regla de negocio: ¿ya desbloqueó este logro? */
  hasLogro(logroId: string): boolean {
    return this.unlockedLogros.includes(logroId);
  }

  /** Regla de negocio: agrega puntos al usuario */
  addPoints(points: number): void {
    this.totalPoints += points;
  }
}
