import { IsEmail, IsString, Max, Min } from 'class-validator'

export class ValidateUserDto {

    @IsEmail()
    @IsString()
        email: string

    @IsString()
    @Min(6)
    @Max(25)
        password: string

}
