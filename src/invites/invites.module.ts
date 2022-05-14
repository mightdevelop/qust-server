import { forwardRef, Module } from '@nestjs/common'
import { InvitesController } from './invites.controller'
import { InvitesService } from './invites.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Invite } from './models/invites.model'
import { GroupsModule } from 'src/groups/groups.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { UsersModule } from 'src/users/users.module'


@Module({
    controllers: [ InvitesController ],
    providers: [ InvitesService ],
    imports: [
        SequelizeModule.forFeature([ Invite ]),
        GroupsModule,
        UsersModule,
        forwardRef(() => PermissionsModule)
    ],
    exports: [ InvitesService ]
})
export class InvitesModule {

    constructor(
        private invitesService: InvitesService
    ) {}

    async onModuleInit(): Promise<void> {
        setInterval(async () => await this.invitesService.deleteExpiredInvites(), 1800)
    }

}
