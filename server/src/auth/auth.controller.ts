import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import { AppConfig } from '../config/configuration';
import { AuthService } from './auth.service';
import { LoginDto, RegisterCustomerDto, RegisterSupplierDto } from './dto';
import { CurrentUser, AuthenticatedUser, JwtAuthGuard } from './guards';

const REFRESH_COOKIE_NAME = 'oeminventory_refresh_token';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register/customer')
  async registerCustomer(@Body() dto: RegisterCustomerDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.registerCustomer(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { success: true, data: { accessToken: tokens.accessToken } };
  }

  @Post('register/supplier')
  async registerSupplier(@Body() dto: RegisterSupplierDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.registerSupplier(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { success: true, data: { accessToken: tokens.accessToken } };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto, req.ip);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { success: true, data: { accessToken: tokens.accessToken } };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!raw) {
      throw new UnauthorizedException('No refresh token cookie present');
    }
    const tokens = await this.authService.refresh(raw);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { success: true, data: { accessToken: tokens.accessToken } };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME];
    if (raw) {
      await this.authService.logout(raw);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions());
    return { success: true, data: null };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, data: await this.authService.me(user.userId) };
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, this.cookieOptions());
  }

  private cookieOptions(): CookieOptions {
    const { nodeEnv } = this.config.getOrThrow<AppConfig>('app');
    return {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      path: '/api/auth',
    };
  }
}
