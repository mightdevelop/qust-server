import { IsNumber, IsString } from 'class-validator'

export class UpdateChatDto {

    @IsNumber()
        chatId: number

    @IsString()
        name: string

}