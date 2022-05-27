import { forwardRef, Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolePermissions } from './models/role-permissions.model'
import { PermissionsService } from './permissions.service'
import { GroupsModule } from 'src/groups/groups.module'
import { RolesModule } from 'src/roles/roles.module'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'
import { CategoriesModule } from 'src/categories/categories.module'

@Global()
@Module({
    providers: [
        PermissionsService,
    ],
    imports: [
        SequelizeModule.forFeature([ RolePermissions ]),
        forwardRef(() => GroupsModule),
        forwardRef(() => RolesModule),
        forwardRef(() => TextChannelsModule),
        forwardRef(() => CategoriesModule),
    ],
    exports: [ PermissionsService ]
})
export class PermissionsModule {}
