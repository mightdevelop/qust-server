import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MessagesModule } from 'src/messages/messages.module'
import { TextChannelsController } from './text-channels.controller'
import { TextChannelsService } from './text-channels.service'
import { TextChannelRolePermissions } from './models/text-channel-role-permissions.model'
import { TextChannel } from './models/text-channels.model'
import { CategoriesModule } from 'src/categories/categories.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { GroupsModule } from 'src/groups/groups.module'

@Module({
    controllers: [ TextChannelsController ],
    providers: [ TextChannelsService ],
    imports: [
        SequelizeModule.forFeature([ TextChannel, TextChannelRolePermissions ]),
        MessagesModule,
        CategoriesModule,
        PermissionsModule,
        forwardRef(() => GroupsModule)
    ],
    exports: [ TextChannelsService ]
})
export class TextChannelsModule {}
