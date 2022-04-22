import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_ADMIN_KEY } from 'src/auth/decorators/isAdmin.decorator'


@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const isAdmin: boolean = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (!isAdmin)
            return true
        const { user } = context.switchToHttp().getRequest()
        return user.isAdmin
    }

}