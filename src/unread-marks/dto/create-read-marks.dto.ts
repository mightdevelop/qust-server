import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { MessageLocation } from '../types/message-location'

export class CreateUnreadMarksDto {

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

    @IsUUID()
        messageId: string

    @Type(() => MessageLocation)
        messageLocation: MessageLocation

}