import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { ChatMessageService } from './chat-message.service'
import { MessagesService } from './messages.service'
import { ChatMessage } from './models/chat-message'
import { Message } from './models/messages.model'
import { messageAuthorValidate } from './utils/message-author-validate'


@Controller('/messages')
export class MessagesController {

    constructor(
        private messagesService: MessagesService,
        private chatMessageService: ChatMessageService,
        // private channelMessagesService: ChannelMessagesService,
    ) {}

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async updateMessage(
        @CurrentUser() user: RequestResponseUser,
        @Param('id') messageId,
        @Body() { text }: { text: string }
    ): Promise<Message> {
        const message: Message = await this.messagesService.getMessageById(messageId)
        messageAuthorValidate(message.userId, user.id)
        const updatedMessage: Message = await this.messagesService.updateMessage({
            message,
            text
        })
        return updatedMessage
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMessage(
        @CurrentUser() user: RequestResponseUser,
        @Param('id') messageId: number
    ): Promise<Message> {
        const message: Message = await this.messagesService.getMessageById(messageId)
        messageAuthorValidate(message.userId, user.id)
        await this.messagesService.deleteMessage({ message })
        const messageInChat: ChatMessage = await this.chatMessageService.getChatMessageColumn(message.id)
        // if (!messageInChat)
        //     await this.channelMessagesService.getChannelMessageColumn(message.id)
        return message
    }

}