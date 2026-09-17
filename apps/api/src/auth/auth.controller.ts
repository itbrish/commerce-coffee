import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin/User Login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register / Add new admin or staff member' })
  async register(@Body() registerDto: RegisterDto & { role?: string }) {
    return this.authService.register(registerDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'List all admin & team staff accounts' })
  async getUsers() {
    return this.authService.getAllUsers();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Remove admin / staff account' })
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}