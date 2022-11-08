import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator'

export class CreateInviteDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        groupId: string

    @ApiPropertyOptional({ type: Number })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
        remainingUsages?: number

    @ApiPropertyOptional({ type: Number })
    @IsNumber()
    @IsOptional()
    @Min(300000)     // 5 mins
    @Max(5097600000) // 2 months
        ttl?: number

}