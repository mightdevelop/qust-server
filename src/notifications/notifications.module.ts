import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { Notification } from './models/notifications.model'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'


@Module({
    controllers: [ NotificationsController ],
    providers: [
        NotificationsService,
    ],
    imports: [
        SequelizeModule.forFeature([ Notification ]),
        forwardRef(() => UsersModule)
    ],
    exports: [
        NotificationsService,
    ]
})

export class NotificationsModule {}