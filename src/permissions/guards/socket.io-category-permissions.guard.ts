import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Request } from 'src/auth/types/request-response'
import { PermissionsService } from '../permissions.service'

@Injectable()
export class SocketIoCategoryPermissionsGuard implements CanActivate {

    constructor(
        @Inject(PermissionsService) private permissionsService: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToWs().getClient().handshake
        return await this.permissionsService.doesUserCanManageCategory({
            userId: req.user.id,
            categoryId: context.switchToWs().getData().categoryId
        })
    }
}