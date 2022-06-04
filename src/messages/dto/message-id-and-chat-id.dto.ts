import { IsUUID } from 'class-validator'

export class MessageIdAndChatIdDto {

    @IsUUID()
        messageId: string

    @IsUUID()
        chatId: string

}