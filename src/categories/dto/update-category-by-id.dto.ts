import { IsString, IsUUID } from 'class-validator'

export class UpdateCategoryByIdDto {

    @IsString()
        name: string

    @IsUUID()
        categoryId: string

}