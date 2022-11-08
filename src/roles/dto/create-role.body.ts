import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsUUID, IsString, IsOptional } from 'class-validator'

export class CreateRoleBody {

    @ApiProperty({ type: String })
    @IsString()
        name: string

    @ApiProperty({ type: String, format: 'hex' })
    @IsHexColor()
    @IsOptional()
        color?: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        groupId: string

}