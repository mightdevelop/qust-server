import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { NotificationsService } from 'src/notifications/notifications.service'
import { NotificationType } from 'src/notifications/types/notification-type'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { Chat } from './models/chats.model'


@Controller('/chats')
export class ChatsController {

    constructor(
        private chatsService: ChatsService,
        private notificationsService: NotificationsService,
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

}