import { Type } from 'class-transformer'
import { IsUUID, ValidateNested } from 'class-validator'
import { Role } from 'src/roles/models/roles.model'

export class PermissionsByRolesInCategoryDto {

    @ValidateNested({ each: true })
    @Type(() => Role)
        roles: Role[]

    @IsUUID()
        categoryId: string

}