import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { ChatMessageService } from 'src/messages/chat-message.service'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { Chat } from './models/chats.model'
import { generateAddUsersMessageContent } from 'src/messages/utils/messages-text-content'
import StandartBots from 'src/utils/standart-bots-const'
import { User } from 'src/users/models/users.model'
import { Message } from 'src/messages/models/messages.model'
import { UsersService } from 'src/users/users.service'


@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private usersService: UsersService,
        private chatMessageService: ChatMessageService,
    ) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createChat(
        @Body() dto: CreateChatDto,
        @CurrentUser() user: UserFromRequest
    ): Promise<Chat> {
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
        return chat
    }

    @Put('/:chatId')
    @UseGuards(JwtAuthGuard)
    async updateChat(
        @Param('chatId') chatId,
        @Body() { name }: {name: string},
        @CurrentUser() user: UserFromRequest
    ): Promise<Chat> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.updateChat({ name, chatId })
        return chat
    }

    @Post('/:chatId')
    @UseGuards(JwtAuthGuard)
    async addUsersToChat(
        @Param('chatId') chatId: string,
        @Body() { chattersIds }: { chattersIds: string[] },
        @CurrentUser() user: UserFromRequest,
    ): Promise<Chat> {
        const dto: AddUsersToChatDto = { chatId, chattersIds }
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.addUsersToChat(dto)
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId,
            text: generateAddUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        })
        return chat
    }

    @Delete('/:chatId')
    @UseGuards(JwtAuthGuard)
    async leaveFromChat(
        @Param('chatId') chatId,
        @CurrentUser() user: UserFromRequest
    ): Promise<Chat> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.leaveFromChat({ userId: user.id, chatId })
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        if (chatters.length === 0)
            await this.chatsService.deleteChat(chat)
        return chat
    }

    @Post('/:chatId/messages')
    @UseGuards(JwtAuthGuard)
    async sendMessageToChat(
        @Param('chatId') chatId: string,
        @CurrentUser() user: UserFromRequest,
        @Body() { text }: { text: string }
    ): Promise<Message> {
        if (!await this.chatsService.getChatById(chatId))
            throw new NotFoundException({ message: 'Chat not found' })
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const message: Message = await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            username: user.username,
            chatId,
            text
        })
        return message
    }

    @Get('/:chatId/messages')
    @UseGuards(JwtAuthGuard)
    async getMessagesFromChat(
        @Param('chatId') chatId: string,
        @CurrentUser() user: UserFromRequest
    ): Promise<Message[]> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const messages: Message[] = await this.chatsService.getMessagesFromChat(chatId)
        return messages
    }

}