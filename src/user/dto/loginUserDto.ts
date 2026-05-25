import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto{
    @ApiProperty({ description: 'registrasiya bolan email adresinizi yazyn'})
    @IsEmail()
    @IsNotEmpty({message: 'email bos bolmaly dal'})
    email!: string;

    @ApiProperty({ description: 'Gizlin parolynyzy yazyn'})
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 0,
        minUppercase: 0,
    })
    @IsNotEmpty({message: 'password girizin'})
    password!: string
}