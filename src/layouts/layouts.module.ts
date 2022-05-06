import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Category } from 'src/categories/models/categories.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { RolePermissions } from 'src/roles/models/role-permissions.model'
import { Role } from 'src/roles/models/roles.model'
import { TextChannelRolePermissions } from 'src/text-channels/models/text-channel-role-permissions.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { LayoutsService } from './layouts.service'


@Module({
    providers: [ LayoutsService ],
    imports: [
        SequelizeModule.forFeature([
            Category,
            CategoryRolePermissions,
            TextChannel,
            TextChannelRolePermissions,
            Role,
            RolePermissions
        ]),
    ],
    exports: [ LayoutsService ]
})
export class LayoutsModule {}
