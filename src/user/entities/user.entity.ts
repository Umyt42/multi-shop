import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole{
    USER = 'user',
    SHOP = 'shop',
    ADMIN = 'admin'
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({unique: true})
    email!: string;

    @Column({nullable: true})
    name?: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;
}
