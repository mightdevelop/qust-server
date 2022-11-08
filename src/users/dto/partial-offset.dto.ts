import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional } from 'class-validator'

export class PartialOffsetDto {

    @ApiPropertyOptional({ type: String })
    @IsNumberString()
    @IsOptional()
        offset?: string

}
