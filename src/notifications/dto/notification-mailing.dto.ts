import { NotificationType } from '../types/notification-type'
import { SendFriendshipRequestNotificationDto } from './send-friendship-request-notif.dto'

export interface NotificationMailingDto {
    notificationType: NotificationType
    resipientsIds: number[]
    dto?:
        SendFriendshipRequestNotificationDto
}