import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UnreadMarksService } from './unread-marks.service'
import { UnreadMarksController } from './unread-marks.controller'
import { UnreadMark } from './models/read-marks.model'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'
import { MessagesModule } from 'src/messages/messages.module'
import { UnreadMarksCreator } from './unread-marks.creator'

@Module({
    controllers: [ UnreadMarksController ],
    providers: [
        UnreadMarksService,
        UnreadMarksCreator,
    ],
    imports: [
        SequelizeModule.forFeature([ UnreadMark ]),
        SocketIoModule,
        TextChannelsModule,
        MessagesModule,
    ],
    exports: [
        UnreadMarksService,
    ]
})

export class UnreadMarksModule {}