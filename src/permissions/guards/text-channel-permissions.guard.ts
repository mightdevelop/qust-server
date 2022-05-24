import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'src/auth/types/request-response'
import { GroupsService } from 'src/groups/groups.service'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { TEXTCHANNEL_PERMISSIONS_KEY } from '../decorators/required-text-channel-permissions.decorator'
import { PermissionsService } from '../permissions.service'
import { RoleTextChannelPermissionsEnum } from '../types/permissions/role-text-channel-permissions.enum'

@Injectable()
export class TextChannelPermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        @Inject(forwardRef(() => GroupsService)) private groupsService: GroupsService,
        @Inject(forwardRef(() => TextChannelsService)) private textChannelsService: TextChannelsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<RoleTextChannelPermissionsEnum[]>(
            TEXTCHANNEL_PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        const req: Request = context.switchToHttp().getRequest()
        if (!requiredPermissions)
            return await this.groupsService.isUserGroupParticipant(
                req.user.id, await this.textChannelsService.getGroupIdByTextChannelId(req.params.channelId)
            )
        return await this.permissionsService.doesUserHavePermissionsInTextChannel({
            userId: req.user.id,
            channelId: req.params.channelId,
            requiredPermissions
        })
    }
}