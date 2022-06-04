import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { InternalGroupsCudEvent } from './events/internal-groups.CUD.event'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/groups' })
export class GroupsGateway {

    constructor(
        private groupsService: GroupsService,
    ) {}

    @WebSocketServer()
        server: Server

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

    @SubscribeMessage('update-group')
    @UseGuards(SocketIoJwtAuthGuard)
    async updateGroup(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: { groupId: string, name: string }
    ): Promise<void> {
        const group: Group = await this.groupsService.getGroupById(dto.groupId)
        if (!group) {
            socket.emit('404', 'Group not found')
            return
        }
        await this.groupsService.updateGroup({ group, name: dto.name })
        socket.emit('200', group)
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
    @OnEvent('internal-groups.deleted')
    async onGroupCudEvents(event: InternalGroupsCudEvent): Promise<void> {
        this.server
            .to('group:' + event.group.id)
            .emit(`group-${event.action}d`, event.group)
    }

}