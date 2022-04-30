import { Body, Controller, ForbiddenException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { ChatMessagesService } from 'src/messages/chat-messages.service'
import { NotificationsService } from 'src/notifications/notifications.service'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'
import { addUsersMessageContent } from 'src/messages/utils/messages-text-content'
import { SendChatMessageDto } from 'src/messages/dto/send-chat-message.dto'
import StandartBots from 'src/utils/standart-bots-const'
import { User } from 'src/users/models/users.model'


@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private notificationsService: NotificationsService,
        private chatMessagesService: ChatMessagesService,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
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
        const chatters: User[] = await this.chatsService.getChattersByChatId(chat.id)
        const sendChatMessageDto: SendChatMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId: chat.id,
            content: {
                text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
            }
        }
        await this.chatMessagesService.sendMessageToChat(sendChatMessageDto)
        return chat
    }

    @Put('/')
    @UseGuards(JwtAuthGuard)
    async updateChat(
        @Body() dto: UpdateChatDto,
        @CurrentUser() user: RequestResponseUser
    ): Promise<Chat> {
        const chatUserColumn: ChatUser = await this.chatUserRepository.findOne({ where: {
            userId: user.id,
            chatId: dto.chatId
        } })
        if (!chatUserColumn)
            throw new ForbiddenException({ message: 'You are not a chat participant' })
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
        const isChatParticipant = !!await this.chatUserRepository.findOne({ where: {
            userId: user.id,
            chatId
        } })
        if (!isChatParticipant)
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.addUsersToChat(addUsersDto)
        const chatters: User[] = await this.chatsService.getChattersByChatId(chatId)
        const sendChatMessageDto: SendChatMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId,
            content: {
                text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
            }
        }
        await this.chatMessagesService.sendMessageToChat(sendChatMessageDto)
        return chat
    }

}