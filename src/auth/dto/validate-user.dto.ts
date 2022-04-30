import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class ValidateUserDto {

    @IsEmail()
    @IsString()
        email: string

    @IsString()
    @MinLength(6)
    @MaxLength(25)
        password: string

}
