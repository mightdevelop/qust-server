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

    @IsString()
        text: string

}