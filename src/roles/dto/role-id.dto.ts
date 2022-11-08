import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class RoleIdDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        roleId: string

}