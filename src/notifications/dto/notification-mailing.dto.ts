import { NotificationType } from '../types/notification-type'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator'
import { SendFriendshipRequestNotificationDto } from './send-friendship-request-notif.dto'

export class NotificationMailingDto {

    @IsEnum(() => NotificationType)
        notificationType: NotificationType

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    @IsNumber()
        resipientsIds: number[]

    // @Type(() => SendFriendshipRequestNotificationDto)
    dto?: SendFriendshipRequestNotificationDto

}