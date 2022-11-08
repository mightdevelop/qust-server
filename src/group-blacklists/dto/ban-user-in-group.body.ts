import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class BanUserInGroupBody {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        userId: string

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsOptional()
        banReason?: string

}