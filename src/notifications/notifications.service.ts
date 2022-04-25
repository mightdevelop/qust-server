import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/users/users.service'
import { NotificationMailingDto } from './dto/notification-mailing.dto'
import { SendCreateChatNotificationDto } from './dto/send-create-chat-notif.dto'
import { SendFriendshipRequestNotificationDto } from './dto/send-friendship-request-notif.dto'
import { Notification } from './models/notifications.model'
import { friendshipRequestNotificationBody, createChatNotificationBody } from './types/notification-body'
import { NotificationType } from './types/notification-type'


@Injectable()
export class NotificationsService {

    constructor(
        private usersService: UsersService,
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
            case NotificationType.CREATE_CHAT:
                await this.sendCreateChatNotification(userId, dto)
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

    async sendCreateChatNotification(
        userId: number,
        { requesterUsername }: SendCreateChatNotificationDto
    ): Promise<Notification> {
        const notification: Notification = await this.notificationRepository.create({
            userId,
            body: createChatNotificationBody(requesterUsername),
            timestamp: Date.now()
        })
        return notification
    }

}