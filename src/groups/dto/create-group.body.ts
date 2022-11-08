import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { GroupLayoutName } from 'src/groups/types/group-layout-names.enum'

export class CreateGroupBody {

    @ApiProperty({ type: String })
    @IsString()
        name: string

    @ApiPropertyOptional({ enum: GroupLayoutName })
    @IsOptional()
        layout?: GroupLayoutName

}