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
import { ChatMessageService } from 'src/messages/chat-message.service'
import { InternalChatsMessageSentEvent } from 'src/messages/events/internal-chats.message-sent.event'
import { MessageContent } from 'src/messages/models/message-content.model'
import { Message } from 'src/messages/models/messages.model'
import { generateAddUsersMessageContent } from 'src/messages/utils/generate-messages-text-content'
import { SocketIoService } from 'src/socketio/socketio.service'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import StandartBots from 'src/utils/standart-bots-const'
import { ChatsService } from './chats.service'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { CreateChatDto } from './dto/create-chat.dto'
import { InternalChatCreatedEvent } from './events/internal-chat-created.event'
import { InternalChatDeletedEvent } from './events/internal-chat-deleted.event'
import { InternalChatUpdatedEvent } from './events/internal-chat-updated.event'
import { Chat } from './models/chats.model'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private chatsService: ChatsService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private socketIoService: SocketIoService,
        private chatMessageService: ChatMessageService
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

    @SubscribeMessage('connect-to-chat-rooms')
    @UseGuards(SocketIoJwtAuthGuard)
    async connectToChatRooms(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const chatsIds: string[] = await this.chatsService.getChatsIdsByUserId(user.id)
        socket.join(chatsIds.map(id => 'chat:' + id))
        socket.emit('200', chatsIds)
    }

    @SubscribeMessage('get-messages-from-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async getMessagesFromChat(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { chatId, offset }: { chatId: string, offset: number }
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + chatId)) {
            socket.emit('400', 'You are not connected to chat')
            return
        }
        const messages: Message[] =
            await this.chatMessageService.getMessagesFromChat(chatId, MessageContent, 30, offset)
        socket.emit('200', messages)
    }

    @SubscribeMessage('send-message')
    @UseGuards(SocketIoJwtAuthGuard)
    async sendMessageToChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() data: { chatId: string, text: string }
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + data.chatId)) {
            socket.emit('400', 'You are not connected to chat')
            return
        }
        const message: Message = await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            username: user.username,
            ...data
        })
        socket.emit('200', message)
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
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId: chat.id,
            text: generateAddUsersMessageContent(user.username, chat.chatters.map(c => c.username))
        })
        socket.emit('200', chat)
    }

    @SubscribeMessage('update-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async updateChat(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: { chatId: string, name: string }
    ): Promise<void> {
        if (!socket.rooms.has('chat:' + dto.chatId)) {
            socket.emit('400', 'You are not connected to chat')
            return
        }
        const chat: Chat = await this.chatsService.getChatById(dto.chatId)
        await this.chatsService.updateChat({ chat, name: dto.name })
        socket.emit('200', chat)
    }

    @SubscribeMessage('add-users-to-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async addUsersToChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() dto: AddUsersToChatDto,
    ): Promise<Chat> {
        if (!socket.rooms.has('chat:' + dto.chatId)) {
            socket.emit('400', 'You are not connected to chat:' + dto.chatId)
            return
        }
        await this.chatsService.addUsersToChat(dto)
        const chatters: User[] = await this.usersService.getChattersByChatId(dto.chatId)
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId: dto.chatId,
            text: generateAddUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        })
        socket.emit('200', chatters.map(chatter => chatter.id))
    }

    @SubscribeMessage('leave-from-chat')
    @UseGuards(SocketIoJwtAuthGuard)
    async leaveFromChat(
        @ConnectedSocket() socket: Socket,
        @SocketIoCurrentUser() user: UserFromRequest,
        @MessageBody() { chatId }: { chatId: string }
    ): Promise<Chat> {
        if (!socket.rooms.has('chat:' + chatId)) {
            socket.emit('400', 'You are not connected to chat:' + chatId)
            return
        }
        const chat: Chat = await this.chatsService.leaveFromChat({ userId: user.id, chatId })
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        if (chatters.length === 0)
            await this.chatsService.deleteChat(chat)
        socket.emit('200', 'left the chat:' + chatId)
    }

    @OnEvent('internal-chats.message-sent')
    async sendMessageFromChatToSockets(event: InternalChatsMessageSentEvent): Promise<void>  {
        this.server
            .to('chat:' + event.chatId)
            .emit('chat-message', event.message)
    }

    @OnEvent('internal-chats.created')
    async connectSocketsToNewChat({ chat }: InternalChatCreatedEvent): Promise<void>  {
        const sockets = await this.server.fetchSockets()
        const socketsOfChatters = (await this.socketIoService.getClients())
            .filter(client => chat.chatters.some(chatter => chatter.id === client.userId))
            .map(client => sockets.find(socket => socket.id === client.socketId))
        socketsOfChatters.forEach(socket => socket.join('chat:' + chat.id))
        this.server
            .to(socketsOfChatters.map(socket => socket.id))
            .emit('chat-created', chat)
    }

    @OnEvent('internal-chats.updated')
    async showToSocketsUpdatedChat({ chat }: InternalChatUpdatedEvent): Promise<void>  {
        const sockets = await this.server.fetchSockets()
        const socketsOfChatters = (await this.socketIoService.getClients())
            .filter(client => chat.chatters.some(chatter => chatter.id === client.userId))
            .map(client => sockets.find(socket => socket.id === client.socketId))
        this.server
            .to(socketsOfChatters.map(socket => socket.id))
            .emit('chat-updated', chat)
    }

    @OnEvent('internal-chats.deleted')
    async hideFromSocketsDeletedChat({ chat }: InternalChatDeletedEvent): Promise<void>  {
        const sockets = await this.server.fetchSockets()
        const socketsOfChatters = (await this.socketIoService.getClients())
            .filter(client => chat.chatters.some(chatter => chatter.id === client.userId))
            .map(client => sockets.find(socket => socket.id === client.socketId))
        socketsOfChatters.forEach(socket => socket.leave('chat:' + chat.id))
        this.server
            .to(socketsOfChatters.map(socket => socket.id))
            .emit('chat-deleted', chat.id)
    }

}