import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Request } from 'src/auth/types/request-response'
import { PermissionsService } from '../permissions.service'

@Injectable()
export class CategoryPermissionsGuard implements CanActivate {

    constructor(
        @Inject(PermissionsService) private permissionsService: PermissionsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest()
        return await this.permissionsService.doesUserCanManageCategory({
            userId: req.user.id,
            categoryId:
                req.body.categoryId ||
                req.params.categoryId
        })
    }
}