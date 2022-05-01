import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateMessageDto } from './dto/create-message.dto'
import { DeleteMessageDto } from './dto/delete-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageContentService } from './message-content.service'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Injectable()
export class MessagesService {

    constructor(
        private messageContentService: MessageContentService,
        @InjectModel(Message) private messageRepository: typeof Message,
    ) {}

    async getMessageById(messageId: number): Promise<Message> {
        const message: Message = await this.messageRepository.findByPk(messageId)
        return message
    }

    async getMessagesByIds(messagesIds: { id: number }[]): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({
            where: { [Op.or]: messagesIds }
        })
        return messages
    }

    async createMessage(dto: CreateMessageDto): Promise<Message> {
        const content: MessageContent = await this.messageContentService.createMessageContent(dto.content)
        const message: Message = await this.messageRepository.create({
            userId: dto.userId,
            username: dto.username,
            contentId: content.id,
            timestamp: Math.ceil(Date.now() / 1000),
        })
        return message
    }

    async updateMessage({ message, text }: UpdateMessageDto): Promise<Message> {
        if (message.edited === false) await message.update({ edited: true })
        await this.messageContentService.updateMessageContent({
            messageContentId: message.contentId,
            text: text
        })
        return message
    }

    async deleteMessage({ message }: DeleteMessageDto): Promise<Message> {
        await this.messageContentService.deleteMessageContent({ messageContentId: message.contentId })
        await message.destroy()
        return message
    }

}