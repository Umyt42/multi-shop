import { Body, Controller, Post, Req, UseGuards, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { CreateShopDto } from './dto/create-shop.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    async create(@Body() data: CreateShopDto, @Req() req: any) {
        return await this.shopService.create(data, req.user)
    }

    @Get()
    async findAll() {
        return await this.shopService.findAll();
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop', 'user')
    async findMyShop(@Req() req: any) {
        return await this.shopService.findMyShop(req.user.id)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.shopService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop')
    async update(@Body() data: Partial<CreateShopDto>,
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any
    ) {
        return await this.shopService.update(id, data, req.user.id)    
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop', 'admin')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req:any
        ){
            return await this.shopService.delete(id, req.user.id, req.user.role)
        }

    @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async approve(@Param('id', ParseIntPipe) id: number){
        return this.shopService.approve(id)
    }

    @Patch(':id/reject')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async reject(@Param('id', ParseIntPipe) id: number){
        return this.shopService.reject(id)
    }

}
