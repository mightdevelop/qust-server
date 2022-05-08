import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'src/auth/types/request-response'
import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator'
import { PermissionsService } from '../permissions.service'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'

@Injectable()
export class TextChannelPermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private permissionsService: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<RolePermissionsEnum[]>(
            PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        if (!requiredPermissions) return true
        const req: Request = context.switchToHttp().getRequest()
        return await this.permissionsService.doesUserHavePermissionsInTextChannel({
            userId: `${req.user.id}`,
            channelId: req.params.id,
            permissions: requiredPermissions
        })
    }
}