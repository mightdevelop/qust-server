import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestResponseUser } from 'src/auth/types/request-response'

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): RequestResponseUser => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    }
)