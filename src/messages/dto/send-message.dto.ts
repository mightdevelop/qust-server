import { Type } from 'class-transformer'
import { IsNumber, IsString, Max, Min } from 'class-validator'

export class SendMessageDto {

    @IsNumber()
        userId: number

    @IsString()
    @Min(4)
    @Max(25)
        username: string

    @IsNumber()
        chatId: number

    @Type(() => Content)
        content: {
            text: string
        }

}

class Content {
    text: string
}