import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class CreateUserDto {

    @ApiProperty({ type: String, format: 'email' })
    @IsEmail()
    @IsString()
        email: string

    @ApiProperty({ type: String })
    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @ApiProperty({ type: String, format: 'password' })
    @IsString()
    @MinLength(6)
    @MaxLength(25)
        password: string

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsOptional()
        info?: string

}
