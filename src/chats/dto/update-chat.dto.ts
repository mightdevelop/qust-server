import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { Chat } from '../models/chats.model'

export class UpdateChatDto {

    @Type(() => Chat)
        chat: Chat

    @IsString()
        name: string

}