import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'src/auth/types/request-response'
import { GroupsService } from 'src/groups/groups.service'
import { SOCKETIO_GROUP_PERMISSIONS_KEY } from '../decorators/socketio-required-group-permissions.decorator'
import { PermissionsService } from '../permissions.service'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

@Injectable()
export class SocketIoGroupPermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        @Inject(forwardRef(() => GroupsService)) private groupsService: GroupsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<RolePermissionsEnum[]>(
            SOCKETIO_GROUP_PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        const req: Request = context.switchToWs().getClient().handshake
        if (!requiredPermissions)
            return await this.groupsService.isUserGroupParticipant(
                req.user.id, req.body.groupId || req.params.groupId
            )
        const bool = await this.permissionsService.doesUserHavePermissionsInGroup({
            userId: req.user.id,
            groupId: req.body.groupId || req.params.groupId,
            requiredPermissions
        })
        return bool
    }
}