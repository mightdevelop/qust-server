import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username?: string

    @IsString()
    @IsOptional()
        info?: string
}
