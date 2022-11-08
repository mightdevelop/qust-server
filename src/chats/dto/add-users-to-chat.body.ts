import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class AddUsersToChatBody {

    @ApiProperty({ type: [ String ] })
    @IsUUID(4, { each: true })
        chattersIds: string[]

}