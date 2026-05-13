/**
 * CAPA DE DOMINIO — Reglas de Negocio: Logros
 * Lógica pura sin dependencias externas. Fácilmente testeable.
 */
import { LogroModel } from './logro.model';

export class LogrosRules {
  /**
   * Determina qué logros nuevos se desbloquean al completar
   * una misión, dados los ya desbloqueados previamente.
   */
  static calculateNewUnlocks(
    allLogros: LogroModel[],
    completedMissions: string[],
    alreadyUnlocked: string[],
  ): LogroModel[] {
    return allLogros.filter((logro) => {
      if (alreadyUnlocked.includes(logro.id)) return false;
      return logro.shouldUnlock(completedMissions);
    });
  }

  /**
   * Calcula el total de puntos ganados por los nuevos logros desbloqueados.
   */
  static sumPoints(logros: LogroModel[]): number {
    return logros.reduce((acc, l) => acc + (l.puntos ?? 0), 0);
  }
}
