import { Type } from 'class-transformer'
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class SendChatMessageDto {

    @IsNumber()
        userId: number

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @IsNumber()
        chatId: number

    @Type(() => Content)
        content: Content

}

class Content {
    text: string
}