import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class SocketIoJwtAuthGuard extends AuthGuard('socket.io-jwt') {

    getRequest<T = any>(context: ExecutionContext): T {
        return context.switchToWs().getClient().handshake
    }

}