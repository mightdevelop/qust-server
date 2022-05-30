import { InvitesController } from './invites.controller'
import { InvitesService } from './invites.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Invite } from './models/invites.model'
import { GroupsModule } from 'src/groups/groups.module'
import { Module } from '@nestjs/common'
import { GroupBlacklistsModule } from 'src/group-blacklists/group-blacklists.module'


@Module({
    controllers: [ InvitesController ],
    providers: [ InvitesService ],
    imports: [
        SequelizeModule.forFeature([ Invite ]),
        GroupsModule,
        GroupBlacklistsModule,
    ],
    exports: [ InvitesService ]
})
export class InvitesModule {

    constructor(
        private invitesService: InvitesService
    ) {}

    async onModuleInit(): Promise<void> {
        // setInterval(async () => await this.invitesService.deleteExpiredInvites(), 3600)
    }

}
