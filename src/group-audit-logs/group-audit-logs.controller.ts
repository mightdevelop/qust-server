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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GroupIdDto } from 'src/groups/dto/group-id.dto'


@ApiTags('group-audit-logs')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, GroupPermissionsGuard)
@Controller('/')
export class GroupAuditLogsController {

    constructor(
        private auditLogsService: GroupAuditLogsService,
        private groupsService: GroupsService,
    ) {}

    @Get('/groups/:groupId/audit-log')
    @RequiredGroupPermissions([ RolePermissionsEnum.readAuditLog ])
    async getGroupAuditLogByGroupId(
        @Param() { groupId }: GroupIdDto,
    ): Promise<GroupAuditLog> {
        const auditLog: GroupAuditLog =
            await this.auditLogsService.getGroupAuditLogByGroupId(groupId)
        if (!auditLog)
            throw new NotFoundException({ message: 'Audit log not found' })
        return auditLog
    }

    @Get('/groups/:groupId/audit-log/actions')
    @RequiredGroupPermissions([ RolePermissionsEnum.readAuditLog ])
    @UseInterceptors(LoggedActionModelInterceptor)
    async getGroupLoggedActionsByGroupId(
        @Param() { groupId }: GroupIdDto,
    ): Promise<LoggedAction[]> {
        const group: Group =
            await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        const actions: LoggedAction[] = await this.auditLogsService.getActionsByGroupId(groupId, User)
        return actions
    }

}