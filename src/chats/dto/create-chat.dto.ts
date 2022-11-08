import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateChatDto {

    @ApiProperty({ type: String })
    @IsString()
        name: string

    @ApiProperty({ type: [ String ] })
    @IsUUID(4, { each: true })
        chattersIds: string[]

}