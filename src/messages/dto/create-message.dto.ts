import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateMessageDto {

    @IsNumber()
        userId: number

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @IsString()
        text: string

}