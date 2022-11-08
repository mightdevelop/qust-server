import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { SocketIoService } from 'src/socketio/socketio.service'
import { UserSettingsService } from 'src/users-settings/users-settings.service'
import { UsersService } from 'src/users/users.service'
import { InternalUsersCudEvent } from './events/internal-users.CUD.event'
import { UserStatus } from './types/user-status.enum'


@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/text-channels' })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketIoService: SocketIoService,
        private usersService: UsersService,
        private userSettingsService: UserSettingsService,
        private jwtService: JwtService,
    ) {}

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        await this.socketIoService.pushClient({ userId: id, socketId: socket.id })
        const { isInvis } = await this.userSettingsService.getUserSettingsByUserId(id)
        if (!isInvis)
            await this.usersService.updateUser({ userId: id, status: UserStatus.ONLINE })
        socket.emit('200', socket.id)
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        const userId: string = (await this.socketIoService.removeClient(socket.id)).userId
        await this.usersService.updateUser({ userId, status: UserStatus.OFFLINE })
    }

    @SubscribeMessage('sub-to-users-changes')
    async subToUsersChanges(
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() { usersIds }: { usersIds: string[] }
    ): Promise<void> {
        const [ socket ] = await this.socketIoService.getSocketsByUsersIds(
            await this.server.fetchSockets(), [ user.id ]
        )
        socket.join(usersIds.map(userId => 'user:' + userId))
    }

    @OnEvent('internal-users.created')
    @OnEvent('internal-users.updated')
    @OnEvent('internal-users.deleted')
    async onUsersCudEvents(event: InternalUsersCudEvent): Promise<void> {
        this.server
            .to('user:' + event.user.id)
            .emit(`user-${event.action}d`, event.user)
    }

}