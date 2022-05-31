import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GroupsModule } from 'src/groups/groups.module'
import { GroupAuditLogsController } from './group-audit-logs.controller'
import { GroupAuditLogsService } from './group-audit-logs.service'
import { LoggedAction } from './models/logged-action.model'
import { GroupAuditLog } from './models/group-audit-logs.model'
import { GroupAuditLogger } from './group-audit-logger.service'
import { ActionBodyGenerator } from './utils/action-body-generator'


@Module({
    controllers: [ GroupAuditLogsController ],
    providers: [
        GroupAuditLogsService,
        GroupAuditLogger,
        ActionBodyGenerator,
    ],
    imports: [
        SequelizeModule.forFeature([ GroupAuditLog, LoggedAction ]),
        GroupsModule,
    ],
    exports: [ GroupAuditLogsService ]
})

export class GroupAuditLogsModule {}