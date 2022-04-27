import { Body, Controller, ForbiddenException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { MessagesService } from 'src/messages/messages.service'
import { NotificationsService } from 'src/notifications/notifications.service'
import { NotificationType } from 'src/notifications/types/notification-type'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { AddUsersToChatDto } from './dto/add-users-to-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'
import { addUsersMessageContent } from 'src/messages/utils/messages-text-content'
import { SendMessageDto } from 'src/messages/dto/send-message.dto'
import StandartBots from 'src/utils/standart-bots-const'
import { User } from 'src/users/models/users.model'


@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private notificationsService: NotificationsService,
        private messagesService: MessagesService,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
    ) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createChat(
        @Body() dto: CreateChatDto,
        @CurrentUser() user: RequestResponseUser
    ): Promise<Chat> {
        const chat: Chat = await this.chatsService.createChat({
            ...dto, chattersIds: [ ...dto.chattersIds, user.id ]
        })
        await this.notificationsService.notificationMailing({
            notificationType: NotificationType.CREATE_CHAT,
            resipientsIds: dto.chattersIds,
            dto: { requesterUsername: user.username }
        })
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
        const sendMessageDto: SendMessageDto = {
            userId: StandartBots.CHAT_BOT.id,
            username: StandartBots.CHAT_BOT.username,
            chatId,
            content: {
                text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
            }
        }
        await this.messagesService.sendMessage(sendMessageDto)
        return chat
    }

}