import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { Category } from '../models/categories.model'

export class UpdateCategoryDto {

    @IsString()
        name: string

    @Type(() => Category)
        category: Category

}