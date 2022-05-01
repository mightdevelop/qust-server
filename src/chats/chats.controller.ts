import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
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
import { isUserChatParticipantValidate } from './utils/is-user-chat-participant-validate'
import { CreateMessageContentDto } from 'src/messages/dto/create-message-content.dto'


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
            content: {
                text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
            }
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
        isUserChatParticipantValidate(user.id, dto.chatId)
        const chat: Chat = await this.chatsService.updateChat(dto)
        return chat
    }

    @Post('/:id')
    @UseGuards(JwtAuthGuard)
    async addUsersToChat(
        @Param('id') chatId: number,
        @Body() { chattersIds }: { chattersIds: number[] },
        @CurrentUser() user: RequestResponseUser,
    ): Promise<Chat> {
        const addUsersDto: AddUsersToChatDto = { chatId, chattersIds }
        isUserChatParticipantValidate(user.id, chatId)
        const chat: Chat = await this.chatsService.addUsersToChat(addUsersDto)
        const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
        const sendChatMessageDto: SendChatMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId,
            content: {
                text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
            }
        }
        await this.chatMessageService.sendMessageToChat(sendChatMessageDto)
        return chat
    }

    @Post('/:id/messages')
    @UseGuards(JwtAuthGuard)
    async sendMessageToChat(
        @Param('id') chatId: number,
        @CurrentUser() user: RequestResponseUser,
        @Body() dto: CreateMessageContentDto
    ): Promise<Message> {
        isUserChatParticipantValidate(user.id, chatId)
        const message: Message = await this.chatMessageService.sendMessageToChat({
            userId: user.id,
            username: user.username,
            chatId,
            content: dto
        })
        return message
    }

    @Get('/:id/messages')
    @UseGuards(JwtAuthGuard)
    async getMessagesFromChat(
        @Param('id') chatId: number,
        @CurrentUser() user: RequestResponseUser
    ): Promise<Message[]> {
        isUserChatParticipantValidate(user.id, chatId)
        const messages: Message[] = await this.chatMessageService.getMessagesFromChat(chatId)
        return messages
    }

}