import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
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
    async createChat(
        @Body() dto: CreateChatDto,
        @CurrentUser() { id }: RequestResponseUser
    ): Promise<Chat> {
        dto.chattersIds.push(id)
        const chat: Chat = await this.chatsService.createChat(dto)
        await this.notificationsService.notificationMailing({
            notificationType: NotificationType.CREATE_CHAT,
            resipientsIds: dto.chattersIds
        })
        return chat
    }

}