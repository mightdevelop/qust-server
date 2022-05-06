import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
import { GroupLayout } from '../../layouts/types/group-layout.class'

export class CreateCategoriesAndRolesByLayoutsDto {

    @IsNumber()
        groupId: number

    @Type(() => GroupLayout)
        groupLayout: GroupLayout

}