import { IsString, Length } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @Length(4, 30)
    name: string;
}