import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ProductCategory } from "../enums/product-category.enum";

export class CreateProductDto{
    @ApiProperty({ description: 'Harydyn adyny yazyn'})
        @IsNotEmpty({message: 'Harydyn ady bos bolmaly dal'})
        @IsString()
        name!: string;
    
        @ApiProperty({ description: 'Haryt barada maglumat girizmek ucin'})
        @IsOptional()
        @IsString()
        description?: string;
    
        @ApiProperty({ description: 'Harydyn bahasy girizmek ucin'})
        @IsNotEmpty({message: 'Harydyn bahasy girizin'})
        @IsNumber()
        @IsPositive({message: 'Harydyn bahasy polozitel san bolmalydyr'})
        price!: number;

        @ApiProperty()
        @IsNotEmpty()
        @IsEnum(ProductCategory, {message: 'Hasaba alynmadyk kategoriya sayladynyz'})
        category!: ProductCategory
    }