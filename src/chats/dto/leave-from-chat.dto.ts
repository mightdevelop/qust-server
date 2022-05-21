import { IsUUID } from 'class-validator'

export class LeaveFromChatDto {

    @IsUUID()
        chatId: string

    @IsUUID()
        userId: string

}