/**
 * CAPA DE APLICACIÓN — UserProgressService
 * Casos de uso: completar misión, ver progreso, ranking.
 * Orquesta modelos de dominio y reglas de negocio (LogrosRules).
 */
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  IUserRepository,
  IMisionRepository,
  ILogroRepository,
  USER_REPOSITORY,
  MISION_REPOSITORY,
  LOGRO_REPOSITORY,
} from '../../usecases/output/repositories.output';
import { LogrosRules } from '../../entities/logros.rules';

@Injectable()
export class UserProgressService {
  constructor(
    @Inject(USER_REPOSITORY)   private readonly userRepo: IUserRepository,
    @Inject(MISION_REPOSITORY) private readonly misionRepo: IMisionRepository,
    @Inject(LOGRO_REPOSITORY)  private readonly logroRepo: ILogroRepository,
  ) {}

  /** Caso de uso: completar una misión */
  async completeMission(uid: string, missionId: string) {
    const user = await this.userRepo.findById(uid);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Regla de dominio: misión ya completada
    if (user.hasMission(missionId)) {
      return { message: 'Misión ya completada anteriormente', alreadyCompleted: true };
    }

    const mision = await this.misionRepo.findById(missionId);
    if (!mision) throw new NotFoundException('Misión no encontrada en el sistema');

    // Actualizar estado del usuario
    const newCompleted = [...user.completedMissions, missionId];
    user.addPoints(mision.puntos);

    // Regla de dominio: calcular nuevos logros desbloqueados
    const allLogros = await this.logroRepo.findAll();
    const newUnlocked = LogrosRules.calculateNewUnlocks(
      allLogros,
      newCompleted,
      user.unlockedLogros,
    );
    const logroPoints = LogrosRules.sumPoints(newUnlocked);
    user.addPoints(logroPoints);

    const updatedUnlocked = [...user.unlockedLogros, ...newUnlocked.map((l) => l.id)];

    await this.userRepo.update(uid, {
      completedMissions: newCompleted,
      totalPoints: user.totalPoints,
      unlockedLogros: updatedUnlocked,
    });

    return {
      success: true,
      pointsEarned: mision.puntos,
      newTotalPoints: user.totalPoints,
      newAchievements: newUnlocked.map((l) => l.id),
    };
  }

  /** Caso de uso: obtener progreso del usuario autenticado */
  async getUserProgress(uid: string) {
    const user = await this.userRepo.findById(uid);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const [misiones, logros] = await Promise.all([
      this.misionRepo.findAll(),
      this.logroRepo.findAll(),
    ]);

    const totalMissions = misiones.length;
    const totalLogros = logros.length;
    const completedMissionsCount = user.completedMissions.length;
    const unlockedLogrosCount = user.unlockedLogros.length;
    const completedItems = completedMissionsCount + unlockedLogrosCount;
    const totalItems = totalMissions + totalLogros;
    const progressPercentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      totalPoints: user.totalPoints,
      completedMissions: user.completedMissions,
      unlockedLogros: user.unlockedLogros,
      completedMissionsCount,
      unlockedLogrosCount,
      pendingMissionsCount: totalMissions - completedMissionsCount,
      totalMissions,
      totalLogros,
      completedItems,
      totalItems,
      progressPercentage,
    };
  }

  /** Caso de uso: obtener ranking global */
  async getRanking() {
    const users = await this.userRepo.getRanking(50);
    return users.map((u, i) => ({
      uid: u.uid,
      rank: i + 1,
      firstName: u.firstName,
      lastName: u.lastName,
      totalPoints: u.totalPoints,
    }));
  }

  /** Caso de uso: obtener posición propia en el ranking */
  async getMyRanking(uid: string) {
    const ranking = await this.getRanking();
    const myPos = ranking.findIndex((u) => u.uid === uid);
    return {
      position: myPos !== -1 ? myPos + 1 : '50+',
      ranking,
    };
  }
}
