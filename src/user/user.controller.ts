import { Controller, Get, ParseIntPipe, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}


    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@Req() req: any){
        return  await  this.userService.getMyProfile(req.user.id);
    }

    @Get('admin-only')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async adminOnly (){
        return { message: 'Hello ADMIN'}
    }

}
