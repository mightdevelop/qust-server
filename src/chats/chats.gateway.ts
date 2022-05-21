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
import { ChatMessageService } from 'src/messages/chat-message.service'
import { Message } from 'src/messages/models/messages.model'
import { generateAddUsersMessageContent } from 'src/messages/utils/messages-text-content'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import StandartBots from 'src/utils/standart-bots-const'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { Chat } from './models/chats.model'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private chatsService: ChatsService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private chatMessageService: ChatMessageService
    ) {}

    users: { id: string, socket: Socket }[] = []

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.headers.authorization.split(' ')[1]
        ) as TokenPayload
        this.users.push({ id, socket })
        socket.emit('user-connected', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.users.filter(user => user.socket.id !== socket.id)
        socket.emit('user-disconnected', socket.id)
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
        socket.emit('get-messages-from-chat', messages)
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

    @SubscribeMessage('create-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async createChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() dto: CreateChatDto
    ): Promise<void> {
        const chat: Chat = await this.chatsService.createChat({
            ...dto, chattersIds: [ ...dto.chattersIds, user.id ]
        })
        const chatters: User[] = await this.usersService.getChattersByChatId(chat.id)
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId: chat.id,
            text: generateAddUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        })
        this.users
            .filter(user => chatters.some(chatter => chatter.id === user.id))
            .forEach(user => user.socket.join('chat:' + chat.id))
        socket.emit('chat-created')
    }

    @SubscribeMessage('update-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async updateChat(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: UpdateChatDto
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + dto.chatId)) {
            socket.emit('error', 'You are not connected to chat')
            return
        }
        await this.chatsService.updateChat(dto)
        socket.emit('chat-updated')
    }

}