import { Injectable, CanActivate, ExecutionContext, forwardRef, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'src/auth/types/request-response'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { PermissionsService } from '../permissions.service'

@Injectable()
export class CategoryPermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        @Inject(forwardRef(() => TextChannelsService)) private textChannelsService: TextChannelsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest()
        return await this.permissionsService.doesUserCanManageCategory({
            userId: req.user.id,
            categoryId:
                req.body.categoryId ||
                req.params.categoryId ||
                (await this.textChannelsService.getTextChannelById(req.params.channelId)).categoryId
        })
    }
}