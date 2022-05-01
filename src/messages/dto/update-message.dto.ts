import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { Message } from '../models/messages.model'

export class UpdateMessageDto {

    @Type(() => Message)
        message: Message

    @IsString()
        text: string

}