import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator'
import { MessageLocation } from 'src/unread-marks/types/message-location'

export class CreateMessageDto {

    @IsUUID()
        userId: string

    @IsString()
        text: string

    location: MessageLocation

    @IsBoolean()
    @IsOptional()
        noMentions?: boolean

}