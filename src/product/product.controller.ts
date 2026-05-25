import { Controller, Post, UseGuards, Body, Param, ParseIntPipe, Req, Get, Patch, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiBearerAuth()
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Post(':shopId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop')
    async create(
        @Body() data: CreateProductDto,
        @Param('shopId', ParseIntPipe) shopId: number,
        @Req() req: any
    ){
       return await this.productService.create(data, shopId, req.user.id)
    }

    @Get()
    async findAll(
        @Query('page', new ParseIntPipe({optional: true})) page: number = 1,
        @Query('limit', new ParseIntPipe({optional: true})) limit: number = 10,
    ) {
        return await this.productService.findAll(page, limit);
    }

    @Get('shop/:shopId')
    async findByShop(@Param('shopId', ParseIntPipe) shopId: number){
        return await this.productService.findByShop(shopId)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.productService.findOne(id)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop')
    async update(
        @Body() data: Partial<CreateProductDto>,
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any
    ){
        return await this.productService.update(data, id, req.user.id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('shop')
    async delete(
        @Param('id', ParseIntPipe)id: number,
        @Req() req: any
    ){
        return await this.productService.delete(id, req.user.id)
    }

    
}


