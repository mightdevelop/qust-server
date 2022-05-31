import { IsUUID, IsString } from 'class-validator'

export class SendChatMessageDto {

    @IsUUID()
        userId: string

    @IsUUID()
        chatId: string

    @IsString()
        text: string

}