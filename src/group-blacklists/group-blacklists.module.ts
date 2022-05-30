import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GroupsModule } from 'src/groups/groups.module'
import { GroupBlacklistsController } from './group-blacklists.controller'
import { GroupBlacklistsService } from './group-blacklists.service'
import { BannedUser } from './models/banned-users.model'
import { GroupBlacklist } from './models/group-blacklists.model'


@Module({
    controllers: [ GroupBlacklistsController ],
    providers: [
        GroupBlacklistsService,
    ],
    imports: [
        SequelizeModule.forFeature([ GroupBlacklist, BannedUser ]),
        GroupsModule,
    ],
    exports: [ GroupBlacklistsService ]
})

export class GroupBlacklistsModule {}