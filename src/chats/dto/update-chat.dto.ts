import { IsUUID, IsString } from 'class-validator'

export class UpdateChatDto {

    @IsUUID()
        chatId: string

    @IsString()
        name: string

}