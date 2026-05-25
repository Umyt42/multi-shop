import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ShopService } from 'src/shop/shop.service';
import { ShopStatus } from 'src/shop/enums/shop-status.enum';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly shopService: ShopService
    ){}

    async create(data: CreateProductDto, shopId: number, userId: number): Promise<Product>{
        const shop = await this.shopService.findOne(shopId)
        
        if(shop.owner.id !== userId){
            throw new ForbiddenException('Bu dukan size degisli dal')
        }
        if (shop.status !== ShopStatus.APPROVED){
            throw new ForbiddenException('Bu dukan hazir tassyklanmadyk')
        }
        const product = this.productRepository.create({ ...data, shop})
        return await this.productRepository.save(product);   
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{data: Product[], page:number, total: number, totalPages: number}> {
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page-1) * limit,
            take: limit
        });
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    async findByShop(shopId: number): Promise<Product[]>{
        return await this.productRepository.find({ where: {shop: {id: shopId}}})
    }

    async findOne(productId: number): Promise<Product>{
        const product = await this.productRepository.findOne({where: { id: productId }, relations:['shop']})
        if (!product){
            throw new NotFoundException('Gozlenyan haryt tapylmady')
        }
        return product;
    }

    async update(data: Partial<CreateProductDto>, productId: number, userId: number): Promise<Product>{
        const product = await this.productRepository.findOne({where:{id: productId}, relations: ['shop', 'shop.owner']})
        if (!product){
            throw new NotFoundException('Gozlenyan haryt tapylmady')
        }
        if (product.shop.owner.id !== userId){
            throw new ForbiddenException('Bu haryt size degisli dal')
        }
        Object.assign(product, data);
        return await this.productRepository.save(product);
    }

    async delete(productId: number,  userId: number): Promise<{message: string}>{
        const product = await this.productRepository.findOne({where: {id: productId}, relations:['shop', 'shop.owner']})
        if (!product){
            throw new NotFoundException('Gozlenyan haryt tapylmady')
        }
        if (product.shop.owner.id !== userId){
            throw new ForbiddenException('Bu haryt size degisli dal')
        }
        await this.productRepository.delete(product.id);
        return { message: 'Haryt delete edildi'}
    }
}
