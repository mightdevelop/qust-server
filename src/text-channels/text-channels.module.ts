import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MessagesModule } from 'src/messages/messages.module'
import { TextChannelsController } from './text-channels.controller'
import { TextChannelsService } from './text-channels.service'
import { TextChannelRolePermissions } from './models/text-channel-role-permissions.model'
import { TextChannel } from './models/text-channels.model'
import { CategoriesModule } from 'src/categories/categories.module'
import { TextChannelsGateway } from './text-channels.gateway'
import { JwtModule } from '@nestjs/jwt'
import { SocketIoModule } from 'src/socketio/socketio.module'

@Module({
    controllers: [ TextChannelsController ],
    providers: [ TextChannelsService, TextChannelsGateway ],
    imports: [
        SequelizeModule.forFeature([ TextChannel, TextChannelRolePermissions ]),
        JwtModule.register({}),
        forwardRef(() => MessagesModule),
        CategoriesModule,
        SocketIoModule,
    ],
    exports: [ TextChannelsService ]
})
export class TextChannelsModule {}
