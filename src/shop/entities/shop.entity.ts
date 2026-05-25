import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { ShopStatus } from "../enums/shop-status.enum";

@Entity()
export class Shop{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true})
    description?: string;

    @Column()
    address!: string;

    @Column()
    phone!: string;

    @Column({
        type: 'enum',
        enum: ShopStatus,
        default: ShopStatus.PENDING
    })
    status!: ShopStatus;

    @ManyToOne(()=> User, { eager: true})
    owner!: User;
    
}