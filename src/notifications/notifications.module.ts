import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { Notification } from './models/notifications.model'
import { NotificationsService } from './notifications.service'


@Module({
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