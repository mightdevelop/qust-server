import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common'
import { Request } from 'src/auth/types/request-response'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { PermissionsService } from '../permissions.service'

@Injectable()
export class SocketIoCategoryPermissionsGuard implements CanActivate {

    constructor(
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        @Inject(forwardRef(() => TextChannelsService)) private textChannelsService: TextChannelsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToWs().getClient().handshake
        return await this.permissionsService.doesUserCanManageCategory({
            userId: req.user.id,
            categoryId:
                req.body.categoryId ||
                (await this.textChannelsService.getTextChannelById(req.body.channelId)).categoryId
        })
    }
}