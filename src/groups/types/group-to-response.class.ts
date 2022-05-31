import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Category } from 'src/categories/models/categories.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { Role } from 'src/roles/models/roles.model'
import { UserToResponse } from 'src/users/types/user-to-response.class'

export class GroupToResponse {

    @IsUUID()
        id: string

    @IsUUID()
        ownerId: string

    @IsString()
        name: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserToResponse)
    @IsOptional()
        users?: UserToResponse[]

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Role)
    @IsOptional()
        roles?: Role[]

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Category)
    @IsOptional()
        categories?: Category[]

    @Type(() => GroupBlacklist)
    @IsOptional()
        blacklist?: GroupBlacklist

}