import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Category } from 'src/categories/models/categories.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { GroupAuditLog } from 'src/group-audit-logs/models/group-audit-logs.model'
import { LoggedAction } from 'src/group-audit-logs/models/logged-action.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
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
            RolePermissions,
            GroupBlacklist,
            GroupAuditLog,
            LoggedAction,
        ]),
    ],
    exports: [ LayoutsService ]
})
export class LayoutsModule {}
