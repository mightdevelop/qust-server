import { IsUUID, IsString, MaxLength, MinLength } from 'class-validator'

export class SendChatMessageDto {

    @IsUUID()
        userId: string

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @IsUUID()
        chatId: string

    @IsString()
        text: string

}