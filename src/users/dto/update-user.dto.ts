import { IsString, Max, Min } from 'class-validator'

export class UpdateUserDto {
    @IsString()
    @Min(4)
    @Max(25)
        username?: string

    @IsString()
        info?: string
}
