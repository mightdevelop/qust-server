import { Body, Controller, Delete, ForbiddenException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MessagesService } from './messages.service'
import { Message } from './models/messages.model'


@Controller('/messages')
export class MessagesController {

    constructor(
        private messagesService: MessagesService,
    ) {}

    @Put('/:messageId')
    @UseGuards(JwtAuthGuard)
    async updateMessage(
        @CurrentUser() user: UserFromRequest,
        @Param('messageId') messageId,
        @Body() { text }: { text: string }
    ): Promise<Message> {
        const message: Message = await this.messagesService.getMessageById(messageId)
        if (!message)
            throw new NotFoundException({ message: 'Message not found' })
        if (message.userId !== user.id)
            throw new ForbiddenException({ message: 'You have no access' })
        const updatedMessage: Message = await this.messagesService.updateMessage({
            message,
            text
        })
        return updatedMessage
    }

    @Delete('/:messageId')
    @UseGuards(JwtAuthGuard)
    async deleteMessage(
        @CurrentUser() user: UserFromRequest,
        @Param('messageId') messageId: string
    ): Promise<Message> {
        const message: Message = await this.messagesService.getMessageById(messageId)
        if (!message)
            throw new NotFoundException({ message: 'Message not found' })
        if (message.userId !== user.id)
            throw new ForbiddenException({ message: 'You have no access' })
        await this.messagesService.deleteMessage({ message })
        return message
    }

}