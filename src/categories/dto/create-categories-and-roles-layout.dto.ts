import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { GroupLayout } from '../../layouts/types/group-layout.class'

export class CreateCategoriesAndRolesByLayoutsDto {

    @IsUUID()
        groupId: string

    @Type(() => GroupLayout)
        groupLayout: GroupLayout

}