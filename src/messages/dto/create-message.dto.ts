import { Type } from 'class-transformer'
import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator'
import { MessageLocation } from 'src/unread-marks/types/message-location'

export class CreateMessageDto {

    @IsUUID()
        userId: string

    @IsString()
        text: string

    @Type(() => MessageLocation)
        location: MessageLocation

    @IsBoolean()
    @IsOptional()
        noMentions?: boolean

}