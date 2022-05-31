import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { Category } from '../models/categories.model'

export class DeleteCategoryDto {

    @Type(() => Category)
        category: Category

    @IsUUID()
        userId: string

}