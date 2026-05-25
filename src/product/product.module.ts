import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ShopModule } from 'src/shop/shop.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ShopService } from 'src/shop/shop.service';

@Module({
  imports: [
  TypeOrmModule.forFeature([Product]),
  ShopModule,
  AuthModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
