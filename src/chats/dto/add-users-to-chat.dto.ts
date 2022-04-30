import { Type } from 'class-transformer'
import { IsArray, IsNumber } from 'class-validator'

export class AddUsersToChatDto {

    @IsNumber()
        chatId: number

    @IsArray()
    @Type(() => Number)
        chattersIds: number[]

}