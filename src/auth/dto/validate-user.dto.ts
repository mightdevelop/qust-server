import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class ValidateUserDto {

    @ApiProperty({ type: String, format: 'email', example: 'user@example.com' })
    @IsEmail()
    @IsString()
        email: string

    @ApiProperty({ type: String, format: 'password' })
    @IsString()
    @MinLength(6)
    @MaxLength(25)
        password: string

}
