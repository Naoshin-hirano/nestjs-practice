import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

// idはuuidが採番するので不要
// classValidatorによるデコレータでバリデーション→今回はmain.tsにてGlobalに適用
export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    name: string;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string
}