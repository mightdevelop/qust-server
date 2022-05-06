import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { Role } from './models/roles.model'
import { RoleUser } from './models/role-user.model'
import { RolePermissions } from './models/role-permissions.model'

@Module({
    controllers: [ RolesController ],
    providers: [ RolesService ],
    imports: [
        SequelizeModule.forFeature([
            Role,
            RoleUser,
            RolePermissions,
        ]),
    ],
    exports: [ RolesService ]
})
export class RolesModule {}
