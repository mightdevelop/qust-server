import { IsString, Max, Min } from 'class-validator'
import { SendNotificationDto } from './send-notification.dto'

export class SendCreateChatNotificationDto extends SendNotificationDto {
    @IsString()
    @Min(4)
    @Max(25)
        requesterUsername: string
}