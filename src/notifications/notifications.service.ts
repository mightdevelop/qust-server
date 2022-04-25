import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { NotificationMailingDto } from './dto/notification-mailing.dto'
import { SendFriendshipRequestNotificationDto } from './dto/send-friendship-request-notif.dto'
import { Notification } from './models/notifications.model'
import { friendshipNotificationBody } from './notification-bodies/notification-body'
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
        for (const resipientId of resipientsIds) {
            switch (notificationType) {
            case NotificationType.FRIENDSHIP_REQUEST:
                await this.sendFriendshipRequestNotification(resipientId, dto)
                return
            case NotificationType.CREATE_CHAT:
                await this.sendCreateChatNotification(resipientId)
                return
            }
        }
        return
    }

    async sendFriendshipRequestNotification(
        resipientId: number,
        { requesterId }: SendFriendshipRequestNotificationDto
    ): Promise<Notification> {
        const requester: User = await this.usersService.getUserById(requesterId)
        const notification: Notification = await this.notificationRepository.create({
            resipientId,
            body: friendshipNotificationBody(requester.username),
            timestamp: Date.now()
        })
        return notification
    }

    async sendCreateChatNotification(
        resipientId: number
    ): Promise<Notification> {
        const notification: Notification = await this.notificationRepository.create({
            resipientId,
            body: friendshipNotificationBody('requester.username'),
            timestamp: Date.now()
        })
        return notification
    }

}