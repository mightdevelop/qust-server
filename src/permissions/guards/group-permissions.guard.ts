import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'src/auth/types/request-response'
import { GROUP_PERMISSIONS_KEY } from '../decorators/required-group-permissions.decorator'
import { PermissionsService } from '../permissions.service'
import { RolePermissionsEnum } from '../types/permissions/role-permissions.enum'


@Injectable()
export class GroupPermissionsGuard implements CanActivate {

    constructor(
        @Inject(Reflector) private reflector: Reflector,
        @Inject(PermissionsService) private permissionsService: PermissionsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<RolePermissionsEnum[]>(
            GROUP_PERMISSIONS_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        )
        const req: Request = context.switchToHttp().getRequest()
        let categoryId: string
        let groupId: string = req.body.groupId || req.params.groupId
        if (!groupId || groupId === '{groupId}') {
            groupId = undefined
            categoryId = req.params.categoryId
        }
        const bool = await this.permissionsService.doesUserHavePermissionsInGroup({
            userId: req.user.id,
            groupId,
            categoryId,
            requiredPermissions: requiredPermissions || []
        })
        return bool
    }
}
