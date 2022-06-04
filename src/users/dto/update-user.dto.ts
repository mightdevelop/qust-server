import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { UserStatus } from '../types/user-status.enum'

export class UpdateUserDto {

    @IsUUID()
        userId: string

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username?: string

    @IsString()
        status?: UserStatus

    @IsString()
    @IsOptional()
        info?: string

}
