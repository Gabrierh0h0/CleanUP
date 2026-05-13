/**
 * CAPA DE APLICACIÓN — UiConfigService
 * Caso de uso: retornar configuración de menú según el rol del usuario.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UiConfigService {
  getMenu(user: { role?: string }) {
    const tabs = [
      { key: 'Home',     label: 'Inicio',   icon: 'home-outline',        visible: true },
      { key: 'ScanQR',   label: 'QR',       icon: 'qr-code-outline',     visible: true },
      { key: 'Mision',   label: 'Misiones', icon: 'map-outline',         visible: true },
      { key: 'Logros',   label: 'Logros',   icon: 'trophy-outline',      visible: true },
      { key: 'Ranking',  label: 'Ranking',  icon: 'bar-chart-outline',   visible: true },
      { key: 'Progreso', label: 'Progreso', icon: 'stats-chart-outline', visible: true },
      { key: 'Mapa',     label: 'Mapa',     icon: 'map',                 visible: true },
    ];
    return { role: user?.role ?? 'student', tabs };
  }
}
