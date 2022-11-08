import { IsUUID } from 'class-validator'

export class CategoryIdDto {

    @IsUUID()
        categoryId: string

}