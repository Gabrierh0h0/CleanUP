/**
 * CAPA DE DOMINIO — Modelo de Misión
 * Entidad de negocio que representa una tarea/misión del sistema EIAR.
 */
export class MisionModel {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  puntos: number;
  ubicacion?: string;
  completed?: boolean;

  constructor(partial: Partial<MisionModel>) {
    Object.assign(this, partial);
    this.puntos = partial.puntos ?? 0;
    this.url = partial.url ?? '';
    this.completed = partial.completed ?? false;
  }

  /** Regla de negocio: una misión sin puntos no puede recompensar */
  hasReward(): boolean {
    return this.puntos > 0;
  }
}
