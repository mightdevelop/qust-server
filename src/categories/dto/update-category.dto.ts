import { IsUUID, IsString } from 'class-validator'

export class UpdateCategoryDto {

    @IsString()
        name: string

    @IsUUID()
        categoryId: string

}