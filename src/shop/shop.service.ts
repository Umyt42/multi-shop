import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { ShopStatus } from './enums/shop-status.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shop)
        private readonly shopRepository: Repository<Shop>,
        private readonly userServie: UserService
    ) { }

    async create(data: CreateShopDto, owner: User): Promise<Shop> {
        const shop = await this.shopRepository.create({ ...data, owner })
        return await this.shopRepository.save(shop)
    }

    async findAll(): Promise<Shop[]> {
        return await this.shopRepository.find();
    }

    async findOne(id: number): Promise<Shop> {
        const shop = await this.shopRepository.findOne({ where: { id }, relations: ['owner'] })
        if (!shop) {
            throw new NotFoundException('dukan tapylmady')
        }
        return shop;
    }

    async findMyShop(userId: number): Promise<Shop[]> {
        return await this.shopRepository.find({ where: { owner: { id: userId } } })
    }

    async update(id: number, data: Partial<CreateShopDto>, userId: number): Promise<Shop> {
        const shop = await this.shopRepository.findOne({ where: { id }, relations: ['owner'] })
        if (!shop) {
            throw new NotFoundException('Gozlenyan id-li dukan yok')
        }
        if (!shop.owner || shop.owner.id !== userId) {
            throw new ForbiddenException('Bu dukan size degisli dal')
        }

        Object.assign(shop, data);
        return await this.shopRepository.save(shop)  
    }

    async delete(id: number, userId: number, userRole: string): Promise<{ message: string }> {
        const shop = await this.shopRepository.findOne({ where: { id }, relations: ['owner'] })
        if (!shop) {
            throw new NotFoundException('Gozlenyan id-li dukan yok')
        }
        if (userRole === 'admin' || userId === shop.owner.id) {
            await this.shopRepository.remove(shop)
            return { message: 'Dukan delete edildi' }
        }
        throw new ForbiddenException('Bu dukany delete etmek ucin rugsadynyz yok')
    }

    async approve(id: number): Promise<Shop>{
        const shop = await this.shopRepository.findOne({where:{id}})
        if (!shop) {
            throw new NotFoundException('Gozlenyan id-li dukan yok')
        }
        shop.status = ShopStatus.APPROVED;

        if (shop.owner.role !== UserRole.SHOP){
            await this.userServie.updateRole(shop.owner.id, UserRole.SHOP)
        }
        return await this.shopRepository.save(shop);
    }
    async reject(id: number): Promise<Shop>{
        const shop = await this.shopRepository.findOne({where:{id}})
        if (!shop) {
            throw new NotFoundException('Gozlenyan id-li dukan yok')
        }
        shop.status = ShopStatus.REJECTED;
        return await this.shopRepository.save(shop);
    }

    
}