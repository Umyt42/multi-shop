import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/loginUserDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async register(data: CreateUserDto){
        const chekcUser = await this.userService.findByEmail(data.email)
        if (chekcUser){
            throw new ConflictException('Bu email eyyam hasaba alynan')
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
       
        const newUser = await this.userService.create({
             ...data,
            password: hashedPassword
         })
        
         const {password: _, ... cleanUser } = newUser;
            return this.generateToken(cleanUser);
       
        }

        async singIn(data: LoginUserDto){
            const chekcUser = await this.userService.findByEmail(data.email);
            if (!chekcUser){
                throw new UnauthorizedException('email yada password yalnys')
            }

            const isMatch = await bcrypt.compare(data.password, chekcUser.password);
            if (!isMatch){
                throw new UnauthorizedException('email yada password yalnys')
            }
            const {password: _, ... cleanUser } = chekcUser;
            return this.generateToken(cleanUser);
        }

        async generateToken(user: any){
            const payload = { sub: user.id, email: user.email, role: user.role }

            return {
                user,
                access_token: this.jwtService.sign(payload)
            }
        }
    }
