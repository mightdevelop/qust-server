import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SOCKETIO_TEXTCHANNEL_PERMISSIONS_KEY } from '../decorators/socketio-required-text-channel-permissions.decorator'
import { PermissionsService } from '../permissions.service'
import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

@Injectable()
export class SocketIoTextChannelPermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<RoleTextChannelPermissionsEnum[]>(
            SOCKETIO_TEXTCHANNEL_PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        if (!requiredPermissions) return true
        return await this.permissionsService.doesUserHavePermissionsInTextChannel({
            userId: context.switchToWs().getClient().handshake.user.id,
            channelId: context.switchToWs().getData().channelId,
            requiredPermissions
        })
    }
}