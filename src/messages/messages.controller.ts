import { Body, Controller, Delete, ForbiddenException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TextDto } from 'src/text-channels/dto/text.dto'
import { MessageIdDto } from './dto/message-id.dto'
import { MessagesService } from './messages.service'
import { Message } from './models/messages.model'


@ApiTags('messages')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/messages')
export class MessagesController {

    constructor(
        private messagesService: MessagesService,
    ) {}

    @Put('/:messageId')
    async updateMessage(
        @CurrentUser() user: UserFromRequest,
        @Param() { messageId }: MessageIdDto,
        @Body() { text }: TextDto
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
    async deleteMessage(
        @CurrentUser() user: UserFromRequest,
        @Param() { messageId }: MessageIdDto,
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