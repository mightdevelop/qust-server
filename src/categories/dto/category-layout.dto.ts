import { IsArray, IsNumber } from 'class-validator'
import { CategoryLayout } from '../types/category-layout.class'

export class CreateCategoriesByLayoutDto {

    @IsNumber()
        groupId: number

    @IsArray()
        categoryLayouts: CategoryLayout[]

}