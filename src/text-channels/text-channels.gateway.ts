import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection,
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
import { InternalTextChannelssMessageSentEvent } from 'src/messages/events/internal-text-channels.message-sent.event'
import { Message } from 'src/messages/models/messages.model'
import { TextChannelMessageService } from 'src/messages/text-channel-message.service'
import { SocketIoRequiredTextChannelPermissions } from 'src/permissions/decorators/socketio-required-text-channel-permissions.decorator'
import { SocketIoCategoryPermissionsGuard } from 'src/permissions/guards/socket.io-category-permissions.guard'
import { SocketIoTextChannelPermissionsGuard } from 'src/permissions/guards/socket.io-text-channel-permissions.guard'
import { RoleTextChannelPermissionsEnum } from 'src/permissions/types/permissions/role-text-channel-permissions.enum'
import { SocketIoService } from 'src/socketio/socketio.service'
import { User } from 'src/users/models/users.model'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { InternalTextChannelsCreatedEvent } from './events/internal-text-channels-created.event'
import { InternalTextChannelsDeletedEvent } from './events/internal-text-channels-deleted.event'
import { InternalTextChannelsUpdatedEvent } from './events/internal-text-channels-updated.event'
import { TextChannel } from './models/text-channels.model'
import { TextChannelsService } from './text-channels.service'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/text-channels' })
export class TextChannelsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private textChannelsService: TextChannelsService,
        private textChannelMessageService: TextChannelMessageService,
        private socketIoService: SocketIoService,
        private jwtService: JwtService,
    ) {}

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        await this.socketIoService.pushSocket({ userId: id, socket })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.socketIoService.popSocket(socket)
    }

    @SubscribeMessage('connect-to-text-channel-rooms')
    @UseGuards(SocketIoJwtAuthGuard)
    async connectToTextChannelRooms(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const channelsIds: string[] =
            await this.textChannelsService.getAllowedToViewTextChannelsIdsByUserId(user.id)
        socket.join(channelsIds.map(id => 'text-channel:' + id))
        socket.emit('200', channelsIds)
    }

    @SubscribeMessage('get-messages-from-text-channel')
    @UseGuards(SocketIoJwtAuthGuard)
    async getMessagesFromTextChannel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { channelId }: { channelId: string }
    ): Promise<void> {
        if (!socket.rooms.has('text-channel:' + channelId)) {
            socket.emit('400', 'You are not connected to text channel')
            return
        }
        const messages: Message[] = await this.textChannelsService.getMessagesFromTextChannel(channelId)
        socket.emit('200', messages)
    }

    @SubscribeMessage('send-message')
    @SocketIoRequiredTextChannelPermissions([ RoleTextChannelPermissionsEnum.deleteMessages ])
    @UseGuards(SocketIoJwtAuthGuard, SocketIoTextChannelPermissionsGuard)
    async sendMessageToTextChannel(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() data: { channelId: string, text: string }
    ): Promise<void> {
        if (!socket.rooms.has('text-channel:' + data.channelId)) {
            socket.emit('400', 'You are not connected to text channel')
            return
        }
        const message: Message = await this.textChannelMessageService.sendMessageToTextChannel({
            userId: user.id,
            username: user.username,
            ...data
        })
        socket.emit('200', message)
    }

    @SubscribeMessage('create-text-channel')
    @UseGuards(SocketIoJwtAuthGuard, SocketIoCategoryPermissionsGuard)
    async createTextChannel(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() dto: CreateTextChannelDto
    ): Promise<void> {
        const channel: TextChannel = await this.textChannelsService.createTextChannel(dto)
        const channelUsers: User[] =
            await this.textChannelsService.getUsersThatCanViewTextChannel(user.id)
        const socketsOfTextChannelUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => channelUsers.some(channelUser => channelUser.id === user.id))
            .map(user => user.socket)
        socketsOfTextChannelUsers.forEach(socket => socket.join('text-channel:' + channel.id))

        socket.emit('200', channel)
    }

    @SubscribeMessage('update-text-channel')
    @UseGuards(SocketIoJwtAuthGuard, SocketIoCategoryPermissionsGuard)
    async updateTextChannel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { name, channelId }: { name: string, channelId: string}
    ): Promise<void> {
        if (!socket.rooms.has('text-channel:' + channelId)) {
            socket.emit('400', 'You are not connected to text channel')
            return
        }
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(channelId)
        await this.textChannelsService.updateTextChannel({ name, channel })
        socket.emit('200', channel)
    }

    @SubscribeMessage('delete-text-channel')
    @UseGuards(SocketIoJwtAuthGuard, SocketIoCategoryPermissionsGuard)
    async deleteTextChannel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { name, channelId }: { name: string, channelId: string}
    ): Promise<void> {
        if (!socket.rooms.has('text-channel:' + channelId)) {
            socket.emit('400', 'You are not connected to text channel')
            return
        }
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(channelId)
        await this.textChannelsService.updateTextChannel({ name, channel })
        socket.emit('200', channel)
    }

    @OnEvent('internal-text-channels.message-sent')
    async sendMessageFromChatToSockets(event: InternalTextChannelssMessageSentEvent): Promise<void> {
        this.server
            .to('text-channel:' + event.channelId)
            .emit('text-channel-message', event.message)
    }

    @OnEvent('internal-text-channels.created')
    async connectSocketsToNewTextChannel(event: InternalTextChannelsCreatedEvent): Promise<void>  {
        const socketsOfChannelUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        socketsOfChannelUsers.forEach(socket => socket.join('text-channel:' + event.channel.id))
        this.server
            .to(socketsOfChannelUsers.map(socket => socket.id))
            .emit('text-channel-created', event.channel)
    }

    @OnEvent('internal-text-channels.updated')
    async showToSocketsUpdatedTextChannel(event: InternalTextChannelsUpdatedEvent): Promise<void>  {
        const socketsOfChannelUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        this.server
            .to(socketsOfChannelUsers.map(socket => socket.id))
            .emit('text-channel-updated', event.channel)
    }

    @OnEvent('internal-text-channels.deleted')
    async hideFromSocketsDeletedTextChannel(event: InternalTextChannelsDeletedEvent): Promise<void>  {
        const socketsOfChannelUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        socketsOfChannelUsers.forEach(socket => socket.leave('text-channel:' + event.channelId))
        this.server
            .to(socketsOfChannelUsers.map(socket => socket.id))
            .emit('text-channel-deleted', event.channelId)
    }

}