import { IsArray, IsUUID } from 'class-validator'

export class AddUsersToChatDto {

    @IsUUID()
        chatId: string

    @IsArray()
        chattersIds: string[]

}