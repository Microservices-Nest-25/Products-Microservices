import { Type } from "class-transformer";
import { IsBoolean, IsEmpty, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    public price: number;

    @IsBoolean()
    public available: boolean = true;

}
