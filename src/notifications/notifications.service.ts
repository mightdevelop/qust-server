import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { Notification } from './models/notifications.model'
import { friendshipNotificationBody } from './types/notification-body'


@Injectable()
export class NotificationsService {

    constructor(
        private usersService: UsersService,
        @InjectModel(Notification) private notificationRepository: typeof Notification
    ) {}

    async sendFriendshipNotification(
        resipientId: number,
        requesterId: number
    ): Promise<Notification> {
        const requester: User = await this.usersService.getUserById(requesterId)
        const notification: Notification = await this.notificationRepository.create({
            userId: resipientId,
            body: friendshipNotificationBody(requester.username),
            timestamp: Date.now()
        })
        return notification
    }

}