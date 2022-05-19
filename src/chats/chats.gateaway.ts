import { ForbiddenException, UseGuards } from '@nestjs/common'
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
import { RequestResponseUser } from 'src/auth/types/request-response'
import { ChatMessageService } from 'src/messages/chat-message.service'
import { Message } from 'src/messages/models/messages.model'
import { User } from 'src/users/models/users.model'
import { ChatsService } from './chats.service'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private chatsService: ChatsService,
        private chatMessageService: ChatMessageService
    ) {}

    users: User[] = []

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        this.server.emit('user-connected', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.server.emit('user-disconnected', socket.id)
    }

    @SubscribeMessage('message')
    @UseGuards(SocketIoJwtAuthGuard)
    async sendMessageToChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: RequestResponseUser,
        @MessageBody() data: { chatId: string, text: string }
    ): Promise<void> {
        if (!socket.rooms.has(data.chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const message: Message = await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            username: user.username,
            ...data
        })
        this.server.emit('message', user.username + ': ' + message.content.text)
    }

    @SubscribeMessage('connect-to-chat-rooms')
    @UseGuards(SocketIoJwtAuthGuard)
    async connectToChatRooms(
        @SocketIoCurrentUser() user: RequestResponseUser,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const chatsIds: string[] = await this.chatsService.getChatsIdsByUserId(user.id)
        socket.join(chatsIds)
    }

}

// PostgreSQL adapter https://socket.io/docs/v4/postgres-adapter/

// { "chatId": "402b052c-4550-40c1-9f81-43b93686346f", "text": "text" }