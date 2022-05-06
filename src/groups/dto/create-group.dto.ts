import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GroupLayoutName } from 'src/groups/types/group-layout-names.enum'

export class CreateGroupDto {

    @IsString()
        name: string

    @IsNumber()
        ownerId: number

    @IsOptional()
        layout?: GroupLayoutName

}