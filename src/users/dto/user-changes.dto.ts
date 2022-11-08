import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { UserStatus } from '../types/user-status.enum'

export class UserChangesDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        userId: string

    @ApiPropertyOptional({ type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
        username?: string

    @ApiPropertyOptional({ enum: enumToArrayOfIndexes(UserStatus) })
    @IsNumber()
    @IsOptional()
        status?: UserStatus

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsOptional()
        info?: string

}
