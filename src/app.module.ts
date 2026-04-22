/**
 * AppModule — Módulo Raíz del Monolito EIAR
 *
 * Arquitectura en Capas:
 * ┌──────────────────────────────────────┐
 * │  PRESENTACIÓN  (controllers / dto)   │
 * ├──────────────────────────────────────┤
 * │  APLICACIÓN    (services)            │
 * ├──────────────────────────────────────┤
 * │  DOMINIO       (models / rules)      │
 * ├──────────────────────────────────────┤
 * │  INFRAESTRUCTURA (firebase / guards) │
 * └──────────────────────────────────────┘
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// ── Infraestructura ──────────────────────────────────────────────
import { InfrastructureModule } from './infrastructure/infrastructure.module';

// ── Capa de Aplicación (servicios / casos de uso) ────────────────
import { AuthService }         from './application/services/auth.service';
import { MisionesService }     from './application/services/misiones.service';
import { LogrosService }       from './application/services/logros.service';
import { UserProgressService } from './application/services/user-progress.service';
import { QrService }           from './application/services/qr.service';
import { UiConfigService }     from './application/services/ui-config.service';

// ── Capa de Presentación (controllers) ──────────────────────────
import { AuthController, MisionesController, LogrosController }
  from './presentation/controllers/auth-misiones-logros.controller';
import { UserProgressController, QrController, UiConfigController }
  from './presentation/controllers/progress-qr-ui.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfrastructureModule,
  ],
  controllers: [
    // Presentación
    AuthController,
    MisionesController,
    LogrosController,
    UserProgressController,
    QrController,
    UiConfigController,
  ],
  providers: [
    // Aplicación
    AuthService,
    MisionesService,
    LogrosService,
    UserProgressService,
    QrService,
    UiConfigService,
  ],
})
export class AppModule {}
