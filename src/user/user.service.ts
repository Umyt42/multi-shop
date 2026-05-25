import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './entities/user.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(data: CreateUserDto):Promise<User> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null>{
        return await this.userRepository.findOne({where: {email}})
    }

    async getMyProfile(id: number): Promise<Omit<User, 'password'>| null>{
        const user = await this.userRepository.findOne({where: {id}})
        if (!user) {return null}
        const {password: _, ... cleanUser} = user;
        return cleanUser;
    }

    async updateRole(id: number, role: UserRole): Promise<User>{
         const user = await this.userRepository.findOne({where: {id}})
        if (!user) {
            throw new NotFoundException('Ulanyjy tapylmady')
        }
        user.role = role;
        return await this.userRepository.save(user)
    }
   
}
