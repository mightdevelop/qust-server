import { UseGuards } from '@nestjs/common'
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
        socket.emit('user-connected', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        socket.emit('user-disconnected', socket.id)
    }

    @SubscribeMessage('send-message')
    @UseGuards(SocketIoJwtAuthGuard)
    async sendMessageToChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() data: { chatId: string, text: string }
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + data.chatId)) {
            socket.emit('error', 'You are not connected to chat')
            return
        }
        await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            username: user.username,
            ...data
        })
        this.server.to('chat:' + data.chatId).emit('chat-message', {
            username: user.username,
            text: data.text
        })
    }

    @SubscribeMessage('connect-to-chat-rooms')
    @UseGuards(SocketIoJwtAuthGuard)
    async connectToChatRooms(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const chatsIds: string[] = await this.chatsService.getChatsIdsByUserId(user.id)
        socket.join(chatsIds.map(id => 'chat:' + id))
    }

    @SubscribeMessage('get-messages-from-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async getMessagesFromChat(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { chatId }: { chatId: string }
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + chatId)) {
            socket.emit('error', 'You are not connected to chat')
            return
        }
        const messages: Message[] = await this.chatsService.getMessagesFromChat(chatId)
        socket.emit(JSON.stringify(messages))
    }

}