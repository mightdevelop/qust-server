import { Type } from 'class-transformer'
import { IsArray, IsString } from 'class-validator'

export class CreateChatDto {

    @IsString()
        name: string

    @IsArray()
    @Type(() => Number)
        chattersIds: number[]

}