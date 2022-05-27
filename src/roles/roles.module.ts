import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { Role } from './models/roles.model'
import { RoleUser } from './models/role-user.model'
import { PermissionsModule } from 'src/permissions/permissions.module'

@Module({
    controllers: [ RolesController ],
    providers: [ RolesService ],
    imports: [
        SequelizeModule.forFeature([
            Role,
            RoleUser,
        ]),
        forwardRef(() => PermissionsModule),
    ],
    exports: [ RolesService ]
})
export class RolesModule {}
