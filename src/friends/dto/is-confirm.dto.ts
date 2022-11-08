import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class IsConfirmDto {

    @ApiPropertyOptional({ type: Boolean })
    @IsBoolean()
    @IsOptional()
        isConfirm?: boolean

}