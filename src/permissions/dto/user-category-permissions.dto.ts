import { IsUUID } from 'class-validator'

export class UserPermissionsInCategoryDto {

    @IsUUID()
        userId: string

    @IsUUID()
        categoryId: string

}