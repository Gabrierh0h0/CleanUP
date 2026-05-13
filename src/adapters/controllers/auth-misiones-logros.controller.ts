/**
 * CAPA DE PRESENTACIÓN — Controllers: Auth, Misiones, Logros
 * Reciben peticiones HTTP y delegan a la capa de aplicación.
 * No contienen lógica de negocio.
 */
import {
  Controller, Post, Get, Body, Req,
  UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthService }    from '../../usecases/interactor/auth.service';
import { MisionesService } from '../../usecases/interactor/misiones.service';
import { LogrosService }   from '../../usecases/interactor/logros.service';
import { FirebaseAuthGuard } from '../../frameworks/web/guards/firebase-auth.guard';
import { LoginDto, RegisterDto } from './dto/index.dto';

/* ─── Auth ─────────────────────────────────────────────────────── */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  me(@Req() req: any) {
    return this.authService.me(req.user.uid);
  }
}

/* ─── Misiones ──────────────────────────────────────────────────── */

@Controller('misiones')
export class MisionesController {
  constructor(private readonly misionesService: MisionesService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  getMisiones(@Req() req: any) {
    return this.misionesService.getMisiones(req.user.uid);
  }
}

/* ─── Logros ────────────────────────────────────────────────────── */

@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  getLogros(@Req() req: any) {
    return this.logrosService.getLogros(req.user.uid);
  }
}
