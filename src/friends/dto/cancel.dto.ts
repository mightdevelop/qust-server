import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class CancelDto {

    @ApiPropertyOptional({ type: Boolean })
    @IsBoolean()
    @IsOptional()
        cancel?: boolean

}