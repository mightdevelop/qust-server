import { NotificationType } from '../types/notification-type'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SendFriendshipRequestNotificationDto } from './send-friendship-request-notif.dto'

export class NotificationMailingDto {

    @IsEnum(() => NotificationType)
        notificationType: NotificationType

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    @Type(() => Number)
        resipientsIds: number[]

    // @Type(() => SendFriendshipRequestNotificationDto)
    dto?: SendFriendshipRequestNotificationDto

}