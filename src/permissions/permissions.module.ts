import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolePermissions } from './models/role-permissions.model'
import { PermissionsService } from './permissions.service'
import { GroupsModule } from 'src/groups/groups.module'
import { RolesModule } from 'src/roles/roles.module'

@Module({
    providers: [ PermissionsService ],
    imports: [
        SequelizeModule.forFeature([ RolePermissions ]),
        forwardRef(() => GroupsModule),
        forwardRef(() => RolesModule),
    ],
    exports: [ PermissionsService ]
})
export class PermissionsModule {}
