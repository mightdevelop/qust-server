import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestResponseUser } from 'src/auth/types/request-response'

export const SocketIoCurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): RequestResponseUser => {
        const req = ctx.switchToWs().getClient().handshake
        return req.user
    }
)