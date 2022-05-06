import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MessagesModule } from 'src/messages/messages.module'
import { TextChannelsController } from './text-channels.controller'
import { TextChannelsService } from './text-channels.service'
import { TextChannelRolePermissions } from './models/text-channel-role-permissions.model'
import { TextChannel } from './models/text-channels.model'

@Module({
    controllers: [ TextChannelsController ],
    providers: [ TextChannelsService ],
    imports: [
        SequelizeModule.forFeature([ TextChannel, TextChannelRolePermissions ]),
        MessagesModule,
    ],
    exports: [ TextChannelsService ]
})
export class TextChannelsModule {}
