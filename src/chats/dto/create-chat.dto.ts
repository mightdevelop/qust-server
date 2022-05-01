import { IsArray, IsString } from 'class-validator'

export class CreateChatDto {

    @IsString()
        name: string

    @IsArray()
        chattersIds: number[]

}