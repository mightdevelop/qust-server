import { Controller, Get, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { Notification } from './models/notifications.model'
import { NotificationsService } from './notifications.service'



@Controller('/notifications')
export class NotificationsController {

    constructor(
        private notificationsService: NotificationsService,
        @InjectModel(Notification) private notificationRepository: typeof Notification
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getMyNotifications(
        @CurrentUser() user: UserFromRequest
    ): Promise<Notification[]> {
        const notifications: Notification[] = await this.notificationRepository.findAll({
            where: { userId: user.id }
        })
        return notifications
    }

}