import { UseGuards } from '@nestjs/common'
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
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { SocketIoService } from 'src/socketio/socketio.service'
import { InternalGroupsCudEvent } from './events/internal-groups-CUD.event'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/groups' })
export class GroupsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketIoService: SocketIoService,
        private groupsService: GroupsService,
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

    @SubscribeMessage('connect-to-group-rooms')
    @UseGuards(SocketIoJwtAuthGuard)
    async connectToGroupRooms(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const groupsIds: string[] =
            await this.groupsService.getGroupsIdsByUserId(user.id)
        socket.join(groupsIds.map(id => 'group:' + id))
        socket.emit('200', groupsIds)
    }

    @SubscribeMessage('delete-group')
    @UseGuards(SocketIoJwtAuthGuard)
    async deleteGroup(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { groupId }: { groupId: string}
    ): Promise<void> {
        const group: Group = await this.groupsService.getGroupById(groupId)
        if (!group) {
            socket.emit('404', 'Group not found')
            return
        }
        await this.groupsService.deleteGroup({ group })
        socket.emit('200', group)
    }

    @OnEvent('internal-groups.updated')
    async showToSocketsUpdatedGroup(event: InternalGroupsCudEvent): Promise<void> {
        this.server
            .to(event.group.id)
            .emit('group-deleted', event.group.id)
    }

    @OnEvent('internal-groups.deleted')
    async hideFromSocketsDeletedGroup(event: InternalGroupsCudEvent): Promise<void> {
        this.server
            .to(event.group.id)
            .emit('group-deleted', event.group.id)
    }

}