import { Type } from 'class-transformer'
import { Message } from '../models/messages.model'

export class DeleteMessageDto {

    @Type(() => Message)
        message: Message

}