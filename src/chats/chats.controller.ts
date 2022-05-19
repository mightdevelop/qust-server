import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { ChatMessageService } from 'src/messages/chat-message.service'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { Chat } from './models/chats.model'
import { addUsersMessageContent } from 'src/messages/utils/messages-text-content'
import { SendChatMessageDto } from 'src/messages/dto/send-chat-message.dto'
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
        @Body() createChatDto: CreateChatDto,
        @CurrentUser() user: RequestResponseUser
    ): Promise<Chat> {
        const chat: Chat = await this.chatsService.createChat({
            ...createChatDto, chattersIds: [ ...createChatDto.chattersIds, user.id ]
        })
        const chatters: User[] = await this.usersService.getChattersByChatId(chat.id)
        const sendChatMessageDto: SendChatMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId: chat.id,
            text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        }
        await this.chatMessageService.sendMessageToChat(sendChatMessageDto)
        return chat
    }

    @Put('/')
    @UseGuards(JwtAuthGuard)
    async updateChat(
        @Body() dto: UpdateChatDto,
        @CurrentUser() user: RequestResponseUser
    ): Promise<Chat> {
        if (!await this.chatsService.isUserChatParticipant(user.id, dto.chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.updateChat(dto)
        return chat
    }

    @Post('/:chatId')
    @UseGuards(JwtAuthGuard)
    async addUsersToChat(
        @Param('chatId') chatId: string,
        @Body() { chattersIds }: { chattersIds: string[] },
        @CurrentUser() user: RequestResponseUser,
    ): Promise<Chat> {
        const addUsersDto: AddUsersToChatDto = { chatId, chattersIds }
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.addUsersToChat(addUsersDto)
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        const sendChatMessageDto: SendChatMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId,
            text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        }
        await this.chatMessageService.sendMessageToChat(sendChatMessageDto)
        return chat
    }

    @Post('/:chatId/messages')
    @UseGuards(JwtAuthGuard)
    async sendMessageToChat(
        @Param('chatId') chatId: string,
        @CurrentUser() user: RequestResponseUser,
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
        @CurrentUser() user: RequestResponseUser
    ): Promise<Message[]> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const messages: Message[] = await this.chatsService.getMessagesFromChat(chatId)
        return messages
    }

}