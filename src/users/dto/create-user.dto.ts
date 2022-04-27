import { IsEmail, IsString, Min } from 'class-validator'
import { Max } from 'sequelize-typescript'

export class CreateUserDto {

    @IsEmail()
    @IsString()
        email: string

    @IsString()
    @Min(4)
    @Max(25)
        username: string

    @IsString()
    @Min(6)
    @Max(25)
        password: string

    @IsString()
        info?: string

}
