import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "../enums/product-category.enum";
import { Shop } from "src/shop/entities/shop.entity";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({nullable: true})
    description?: string;

    @Column('decimal', { precision: 10, scale: 2})
    price!: number;

    @Column({
        type: 'enum',
        enum: ProductCategory,
    })
    category!: ProductCategory;

    @ManyToOne(()=> Shop, {eager: true})
    shop!: Shop;
}