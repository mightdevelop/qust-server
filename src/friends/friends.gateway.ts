import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { SocketIoService } from 'src/socketio/socketio.service'
import { InternalFriendRequestsCudEvent } from './events/internal-friend-requests.CUD.event'
import { InternalFriendsCudEvent } from './events/internal-friends.CUD.event'


@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/friends' })
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketIoService: SocketIoService,
        private jwtService: JwtService,
    ) {}

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        await this.socketIoService.pushClient({ userId: id, socketId: socket.id })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.socketIoService.removeClient(socket.id)
    }

    @OnEvent('internal-friend-requests.created')
    @OnEvent('internal-friend-requests.deleted')
    async onFriendRequestsEvents(event: InternalFriendRequestsCudEvent): Promise<void> {
        this.server
            .to([ event.requestedUserId, event.respondingUserId ])
            .emit(`friendship-request-${event.action}d`, [ event.requestedUserId, event.respondingUserId ])
    }

    @OnEvent('internal-friends.created')
    @OnEvent('internal-friends.deleted')
    async onFriendsEvents(event: InternalFriendsCudEvent): Promise<void> {
        this.server
            .to(event.friendsIds)
            .emit(`friend-${event.action}d`, event.friendsIds)
    }

}