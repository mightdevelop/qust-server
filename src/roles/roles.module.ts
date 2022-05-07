import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { Role } from './models/roles.model'
import { RoleUser } from './models/role-user.model'
import { RolePermissions } from './models/role-permissions.model'
import { PermissionsService } from './permissions.service'
import { GroupsModule } from 'src/groups/groups.module'

@Module({
    controllers: [ RolesController ],
    providers: [ RolesService, PermissionsService ],
    imports: [
        SequelizeModule.forFeature([
            Role,
            RoleUser,
            RolePermissions,
        ]),
        forwardRef(() => GroupsModule)
    ],
    exports: [ RolesService, PermissionsService ]
})
export class RolesModule {}
