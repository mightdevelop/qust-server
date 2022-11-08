import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUIDOrBlankParameter } from 'src/utils/IsUUIDOrBlankParameter'

export class PartialUserIdDto {

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUIDOrBlankParameter()
        userId: string

}