import { IsUUID, IsOptional, IsString } from 'class-validator'
import { GroupLayoutName } from 'src/groups/types/group-layout-names.enum'

export class CreateGroupDto {

    @IsString()
        name: string

    @IsUUID()
        ownerId: string

    @IsOptional()
        layout?: GroupLayoutName

}