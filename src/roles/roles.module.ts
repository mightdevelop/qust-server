import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { Role } from './models/roles.model'
import { RoleUser } from './models/role-user.model'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { GroupsModule } from 'src/groups/groups.module'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'

@Module({
    controllers: [ RolesController ],
    providers: [ RolesService ],
    imports: [
        SequelizeModule.forFeature([
            Role,
            RoleUser,
        ]),
        forwardRef(() => GroupsModule),
        forwardRef(() => PermissionsModule),
        forwardRef(() => TextChannelsModule)
    ],
    exports: [ RolesService ]
})
export class RolesModule {}
