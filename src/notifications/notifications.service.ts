import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { NotificationMailingDto } from './dto/notification-mailing.dto'
import { SendFriendshipRequestNotificationDto } from './dto/send-friendship-request-notif.dto'
import { Notification } from './models/notifications.model'
import { friendshipRequestNotificationBody } from './utils/notification-body'
import { NotificationType } from './types/notification-type'


@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel(Notification) private notificationRepository: typeof Notification
    ) {}

    async notificationMailing({
        notificationType, resipientsIds, dto
    }: NotificationMailingDto): Promise<string> {
        for (const userId of resipientsIds) {
            switch (notificationType) {
            case NotificationType.FRIENDSHIP_REQUEST:
                await this.sendFriendshipRequestNotification(userId, dto)
                return
            }
        }
        return
    }

    async sendFriendshipRequestNotification(
        userId: number,
        { requesterUsername }: SendFriendshipRequestNotificationDto
    ): Promise<Notification> {
        const notification: Notification = await this.notificationRepository.create({
            userId,
            body: friendshipRequestNotificationBody(requesterUsername),
            timestamp: Date.now()
        })
        return notification
    }

}