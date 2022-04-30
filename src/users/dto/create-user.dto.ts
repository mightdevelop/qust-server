import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class CreateUserDto {

    @IsEmail()
    @IsString()
        email: string

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @IsString()
    @MinLength(6)
    @MaxLength(25)
        password: string

    @IsString()
    @IsOptional()
        info?: string

}
