import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateShopDto{
    @ApiProperty({description: 'Dukanyn ady'})
    @IsNotEmpty({message: 'dukan ady bos bolmaly dal'})
    @IsString()
    name!: string;

    @ApiProperty({description: 'Dukan barada maglumat', required: false})
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({description: 'Dukanyn adresi'})
    @IsNotEmpty({message: 'adres bos bolmaly dal'})
    @IsString()
    address!: string;

    @ApiProperty({ description: 'Dukan bilen habarlasmak ucin tel nomer'})
    @IsNotEmpty({message: 'tel nomer bos bolmaly dal'})
    @IsString()
    phone!: string;
    
}