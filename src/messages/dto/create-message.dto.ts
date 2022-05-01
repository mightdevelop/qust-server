import { Type } from 'class-transformer'
import { IsNotEmptyObject, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateMessageDto {

    @IsNumber()
        userId: number

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @Type(() => Content)
    @IsNotEmptyObject()
        content: Content

}

class Content {
    text?: string
}