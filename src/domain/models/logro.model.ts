/**
 * CAPA DE DOMINIO — Modelo de Logro
 * Entidad que representa un achievement desbloqueado al completar misiones.
 */
export class LogroModel {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  puntos: number;
  requiredMissions: string[];
  unlocked?: boolean;

  constructor(partial: Partial<LogroModel>) {
    Object.assign(this, partial);
    this.puntos = partial.puntos ?? 0;
    this.url = partial.url ?? '';
    this.requiredMissions = partial.requiredMissions ?? [];
    this.unlocked = partial.unlocked ?? false;
  }

  /**
   * Regla de negocio: determina si este logro debe desbloquearse
   * dado el conjunto de misiones completadas por el usuario.
   */
  shouldUnlock(completedMissions: string[]): boolean {
    if (this.requiredMissions.length === 0) return false;
    return this.requiredMissions.every((m) => completedMissions.includes(m));
  }
}
