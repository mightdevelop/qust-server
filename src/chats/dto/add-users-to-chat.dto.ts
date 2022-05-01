import { IsArray, IsNumber } from 'class-validator'

export class AddUsersToChatDto {

    @IsNumber()
        chatId: number

    @IsArray()
        chattersIds: number[]

}