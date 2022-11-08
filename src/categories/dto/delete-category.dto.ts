import { Type } from 'class-transformer'
import { Category } from '../models/categories.model'

export class DeleteCategoryDto {

    @Type(() => Category)
        category: Category

}