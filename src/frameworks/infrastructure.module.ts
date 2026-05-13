/**
 * CAPA DE INFRAESTRUCTURA — InfrastructureModule
 * Registra Firebase, repositorios y guards como providers.
 * Exporta los tokens de repositorio para que la capa de aplicación
 * los inyecte sin importar detalles de Firebase (Principio D de SOLID).
 */
import { Module } from '@nestjs/common';
import { FirebaseService } from './database/firebase/firebase.service';
import { UserRepository } from './database/firebase/user.repository';
import { MisionRepository, LogroRepository } from './database/firebase/mision-logro.repository';
import { FirebaseAuthGuard } from './web/guards/firebase-auth.guard';
import {
  USER_REPOSITORY,
  MISION_REPOSITORY,
  LOGRO_REPOSITORY,
} from '../usecases/output/repositories.output';

@Module({
  providers: [
    FirebaseService,
    FirebaseAuthGuard,
    { provide: USER_REPOSITORY,   useClass: UserRepository },
    { provide: MISION_REPOSITORY, useClass: MisionRepository },
    { provide: LOGRO_REPOSITORY,  useClass: LogroRepository },
  ],
  exports: [
    FirebaseService,
    FirebaseAuthGuard,
    USER_REPOSITORY,
    MISION_REPOSITORY,
    LOGRO_REPOSITORY,
  ],
})
export class InfrastructureModule {}
