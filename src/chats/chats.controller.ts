import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { ChatMessageService } from 'src/messages/chat-message.service'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { Chat } from './models/chats.model'
import { generateAddUsersMessageContent } from 'src/messages/utils/generate-messages-text-content'
import StandartBots from 'src/utils/standart-bots-const'
import { User } from 'src/users/models/users.model'
import { Message } from 'src/messages/models/messages.model'
import { UsersService } from 'src/users/users.service'
import { MessageContent } from 'src/messages/models/message-content.model'
import { NameDto } from 'src/categories/dto/name.dto'
import { AddUsersToChatBody } from './dto/add-users-to-chat.body'
import { SendChatMessageBody } from 'src/messages/dto/send-chat-message.body'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ChatIdDto } from './dto/chat-id.dto'
import { PartialOffsetDto } from 'src/users/dto/partial-offset.dto'


@ApiTags('chats')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private usersService: UsersService,
        private chatMessageService: ChatMessageService,
    ) {}

    @Post('/')
    async createChat(
        @Body() dto: CreateChatDto,
        @CurrentUser() user: UserFromRequest
    ): Promise<Chat> {
        const chat: Chat = await this.chatsService.createChat({
            ...dto, chattersIds: [ ...dto.chattersIds, user.id ]
        }).catch(error => {
            throw new BadRequestException({ message: 'Users not found', error })
        })
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            chatId: chat.id,
            text: generateAddUsersMessageContent(user.id, chat.chatters.map(chatter => chatter.id))
        })
        return chat
    }

    @Put('/:chatId')
    async updateChat(
        @Param() { chatId }: ChatIdDto,
        @Body() { name }: NameDto,
        @CurrentUser() user: UserFromRequest
    ): Promise<Chat> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.getChatById(chatId)
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        const updatedChat: Chat = await this.chatsService.updateChat({ name, chat })
        return updatedChat
    }

    @Post('/:chatId')
    async addUsersToChat(
        @Param() { chatId }: ChatIdDto,
        @Body() { chattersIds }: AddUsersToChatBody,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Chat> {
        const dto: AddUsersToChatDto = { chatId, chattersIds }
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.addUsersToChat(dto)
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        await this.chatMessageService.sendMessageToChat({
            userId: StandartBots.CHAT_BOT.id,
            chatId,
            text: generateAddUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
        })
        return chat
    }

    @Delete('/:chatId')
    async leaveFromChat(
        @Param() { chatId }: ChatIdDto,
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
    async sendMessageToChat(
        @Param() { chatId }: ChatIdDto,
        @CurrentUser() user: UserFromRequest,
        @Body() { text, noMentions }: SendChatMessageBody
    ): Promise<Message> {
        if (!await this.chatsService.getChatById(chatId))
            throw new NotFoundException({ message: 'Chat not found' })
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const message: Message = await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            chatId,
            text,
            noMentions
        })
        return message
    }

    @Get('/:chatId/messages')
    async getMessagesFromChat(
        @Param() { chatId }: ChatIdDto,
        @CurrentUser() user: UserFromRequest,
        @Query() { offset }: PartialOffsetDto,
    ): Promise<Message[]> {
        if (!await this.chatsService.isUserChatParticipant(user.id, chatId))
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const messages: Message[] = await this.chatMessageService.getMessagesFromChat(
            chatId, MessageContent, 30, offset ? Number(offset) : undefined
        )
        return messages
    }

}