import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { UserStatus } from '../types/user-status.enum'

export class UserChangesBody {

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
