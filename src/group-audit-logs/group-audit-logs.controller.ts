import { Controller, Get, NotFoundException, Param, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { GroupAuditLogsService } from './group-audit-logs.service'
import { GroupAuditLog } from './models/group-audit-logs.model'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { LoggedAction } from './models/logged-action.model'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/models/groups.model'
import { User } from 'src/users/models/users.model'
import { LoggedActionModelInterceptor } from './interceptors/logged-actions-model.interceptor'


@Controller('/')
export class GroupAuditLogsController {

    constructor(
        private auditLogsService: GroupAuditLogsService,
        private groupsService: GroupsService,
    ) {}

    @Get('/groups/:groupId/audit-log')
    @RequiredGroupPermissions([ RolePermissionsEnum.readAuditLog ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getGroupAuditLogByGroupId(
        @Param('groupId') groupId: string,
    ): Promise<GroupAuditLog> {
        const auditLog: GroupAuditLog =
            await this.auditLogsService.getGroupAuditLogByGroupId(groupId)
        if (!auditLog)
            throw new NotFoundException({ message: 'Audit log not found' })
        return auditLog
    }

    @Get('/groups/:groupId/audit-log/actions')
    @RequiredGroupPermissions([ RolePermissionsEnum.readAuditLog ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    @UseInterceptors(LoggedActionModelInterceptor)
    async getGroupLoggedActionsByGroupId(
        @Param('groupId') groupId: string,
    ): Promise<LoggedAction[]> {
        const group: Group =
            await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        const actions: LoggedAction[] = await this.auditLogsService.getActionsByGroupId(groupId, User)
        return actions
    }

}