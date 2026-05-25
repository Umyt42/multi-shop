import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/loginUserDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() data: CreateUserDto){
        return await this.authService.register(data)
    }

    @Post('login')
    async login(@Body() data: LoginUserDto){
        return await this.authService.singIn(data)
    }
}
