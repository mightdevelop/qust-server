import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Notification } from './models/notifications.model'
import { NotificationsService } from './notifications.service'


@Module({
    providers: [
        NotificationsService,
    ],
    imports: [
        SequelizeModule.forFeature([ Notification ]),
    ],
    exports: [
        NotificationsService,
    ]
})

export class NotificationsModule {}