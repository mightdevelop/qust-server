import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateMessageDto } from './dto/create-message.dto'
import { DeleteMessageDto } from './dto/delete-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(MessageContent) private messageContentRepository: typeof MessageContent,
    ) {}

    async getMessageById(messageId: number): Promise<Message> {
        const message: Message = await this.messageRepository.findByPk(messageId, { include: MessageContent })
        return message
    }

    async getMessagesByIds(messagesIds: { id: number }[]): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({
            where: { [Op.or]: messagesIds }, include: MessageContent
        })
        return messages
    }

    async createMessage(dto: CreateMessageDto): Promise<Message> {
        const message: Message = await this.messageRepository.create({
            userId: dto.userId,
            username: dto.username,
        })
        const content: MessageContent = await this.messageContentRepository.create({
            text: dto.text,
            messageId: message.id
        })
        await message.$set('content', content)
        return message
    }

    async updateMessage({ message, text }: UpdateMessageDto): Promise<Message> {
        if (message.edited === false) await message.update({ edited: true })
        message.content.text = text
        await message.content.save()
        return message
    }

    async deleteMessage({ message }: DeleteMessageDto): Promise<Message> {
        await message.destroy()
        return message
    }

}