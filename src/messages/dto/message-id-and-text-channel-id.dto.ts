import { IsUUID } from 'class-validator'

export class MessageIdAndTextChannelIdDto {

    @IsUUID()
        messageId: string

    @IsUUID()
        textChannelId: string

}