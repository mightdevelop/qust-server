import { IsString, Max, Min } from 'class-validator'
import { SendNotificationDto } from './send-notification.dto'

export class SendFriendshipRequestNotificationDto extends SendNotificationDto {
    @IsString()
    @Min(4)
    @Max(25)
        requesterUsername: string
}