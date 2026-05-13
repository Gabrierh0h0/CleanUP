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
import { InfrastructureModule } from './frameworks/infrastructure.module';

// ── Capa de Aplicación (servicios / casos de uso) ────────────────
import { AuthService }         from './usecases/interactor/auth.service';
import { MisionesService }     from './usecases/interactor/misiones.service';
import { LogrosService }       from './usecases/interactor/logros.service';
import { UserProgressService } from './usecases/interactor/user-progress.service';
import { QrService }           from './usecases/interactor/qr.service';
import { UiConfigService }     from './usecases/interactor/ui-config.service';

// ── Capa de Presentación (controllers) ──────────────────────────
import { AuthController, MisionesController, LogrosController }
  from './adapters/controllers/auth-misiones-logros.controller';
import { UserProgressController, QrController, UiConfigController }
  from './adapters/controllers/progress-qr-ui.controller';

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
