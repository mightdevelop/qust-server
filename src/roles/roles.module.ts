import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { Role } from './models/roles.model'
import { RoleUser } from './models/role-user.model'
import { JwtModule } from '@nestjs/jwt'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { RolesGateway } from './roles.gateway'

@Module({
    controllers: [ RolesController ],
    providers: [ RolesService, RolesGateway ],
    imports: [
        SequelizeModule.forFeature([
            Role,
            RoleUser,
        ]),
        JwtModule.register({}),
        SocketIoModule
    ],
    exports: [ RolesService ]
})
export class RolesModule {}
