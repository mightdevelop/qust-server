import { UseGuards } from '@nestjs/common'
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
import { Message } from 'src/messages/models/messages.model'
import { TextChannelMessageService } from 'src/messages/text-channel-message.service'
import { SocketIoRequiredTextChannelPermissions } from 'src/permissions/decorators/socketio-required-text-channel-permissions.decorator'
import { SocketIoTextChannelPermissionsGuard } from 'src/permissions/guards/socket.io-text-channel-permissions.guard'
import { RoleTextChannelPermissionsEnum } from 'src/permissions/types/permissions/role-text-channel-permissions.enum'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { TextChannel } from './models/text-channels.model'
import { TextChannelsService } from './text-channels.service'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/text-channels' })
export class TextChannelsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private usersService: UsersService,
        private textChannelsService: TextChannelsService,
        private textChannelMessageService: TextChannelMessageService,
        private jwtService: JwtService,
    ) {}

    private users: { id: string, socket: Socket }[] = []

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        this.users.push({ id, socket })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.users.filter(user => user.socket.id !== socket.id)
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
    @SocketIoRequiredTextChannelPermissions([ RoleTextChannelPermissionsEnum.writeMessages ])
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
        this.server.to('text-channel:' + data.channelId).emit('text-channel-message', {
            username: user.username,
            text: data.text
        })
        socket.emit('200', 'message sent:', message)
    }

    @SubscribeMessage('create-text-channel')
    @UseGuards(SocketIoJwtAuthGuard)
    async createTextChannel(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() dto: CreateTextChannelDto
    ): Promise<void> {
        const channel: TextChannel = await this.textChannelsService.createTextChannel(dto)
        const channelUsers: User[] =
            await this.textChannelsService.getUsersThatCanViewTextChannel(user.id)
            // проверить работает ли функция
        console.log(channelUsers)
        const socketsOfTextChannelUsers = this.users
            .filter(user => channelUsers.some(chatter => chatter.id === user.id))
            .map(user => user.socket)
        socketsOfTextChannelUsers.forEach(socket => socket.join('text-channel:' + channel.id))

        socket.emit('200', 'chat created:' + channel)
        this.server.to(socketsOfTextChannelUsers.map(socket => socket.id)).emit('chat-created:' + channel)
    }

    @SubscribeMessage('update-text-channel')
    @UseGuards(SocketIoJwtAuthGuard)
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
        socket.emit('200', 'chat updated:' + channel)
    }

}