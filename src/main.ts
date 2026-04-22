/**
 * main.ts — Punto de entrada único del Monolito EIAR
 * Un solo proceso, un solo artefacto de despliegue.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS habilitado para que Expo Go pueda consumir la API
  app.enableCors({ origin: '*' });

  // Pipe global de validación
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 EIAR Monolito corriendo en: http://localhost:${port}`);
  console.log(`📐 Arquitectura: Monolítica en Capas`);
  console.log(`   Presentación  → src/presentation/`);
  console.log(`   Aplicación    → src/application/`);
  console.log(`   Dominio       → src/domain/`);
  console.log(`   Infraestructura → src/infrastructure/\n`);
}

bootstrap();
