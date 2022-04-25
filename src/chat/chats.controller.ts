import { Body, Controller, ForbiddenException, Post, Put, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { NotificationsService } from 'src/notifications/notifications.service'
import { NotificationType } from 'src/notifications/types/notification-type'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'


@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private notificationsService: NotificationsService,
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
        const chatUserColumn: ChatUser = await this.chatUserRepository.findOne({ where: { userId: user.id } })
        if (!chatUserColumn)
            throw new ForbiddenException({ message: 'You are not a chat participant' })
        const chat: Chat = await this.chatsService.updateChat(dto)
        return chat
    }

}