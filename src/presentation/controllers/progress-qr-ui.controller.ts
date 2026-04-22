/**
 * CAPA DE PRESENTACIÓN — Controllers: Progress, QR, UiConfig
 */
import {
  Controller, Post, Get, Body, Req,
  UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { UserProgressService } from '../../application/services/user-progress.service';
import { QrService }           from '../../application/services/qr.service';
import { UiConfigService }     from '../../application/services/ui-config.service';
import { FirebaseAuthGuard }   from '../../infrastructure/guards/firebase-auth.guard';
import { CompleteMissionDto, ValidateQrDto } from '../dto/index.dto';

/* ─── Progress ──────────────────────────────────────────────────── */

@Controller('progress')
@UseGuards(FirebaseAuthGuard)
export class UserProgressController {
  constructor(private readonly progressService: UserProgressService) {}

  @Post('complete-mission')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  completeMission(@Req() req: any, @Body() dto: CompleteMissionDto) {
    return this.progressService.completeMission(req.user.uid, dto.missionId);
  }

  @Get('me')
  getMyProgress(@Req() req: any) {
    return this.progressService.getUserProgress(req.user.uid);
  }

  @Get('ranking')
  getRanking() {
    return this.progressService.getRanking();
  }

  @Get('my-ranking')
  getMyRanking(@Req() req: any) {
    return this.progressService.getMyRanking(req.user.uid);
  }
}

/* ─── QR ────────────────────────────────────────────────────────── */

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('validate')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  validateQr(@Body() dto: ValidateQrDto) {
    return this.qrService.validateQr(dto.data);
  }
}

/* ─── UI Config ─────────────────────────────────────────────────── */

@Controller('ui')
export class UiConfigController {
  constructor(private readonly uiConfigService: UiConfigService) {}

  @Get('menu')
  @UseGuards(FirebaseAuthGuard)
  getMenu(@Req() req: any) {
    return this.uiConfigService.getMenu(req.user);
  }
}
