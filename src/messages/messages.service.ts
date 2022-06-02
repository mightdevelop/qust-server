import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op } from 'sequelize'
import { CreateMessageDto } from './dto/create-message.dto'
import { DeleteMessageDto } from './dto/delete-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { InternalMessagesCudEvent } from './events/internal-messages.CUD.event'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Injectable()
export class MessagesService {

    constructor(
        private eventEmitter: EventEmitter2,
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(MessageContent) private messageContentRepository: typeof MessageContent,
    ) {}

    async getMessageById(messageId: string): Promise<Message> {
        const message: Message = await this.messageRepository.findByPk(messageId, { include: MessageContent })
        return message
    }

    async getMessagesByIds(
        messagesIds: string[],
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({
            where: { [Op.or]: messagesIds.map(id => ({ id })) }, include, limit, offset
        })
        return messages
    }

    async createMessage(dto: CreateMessageDto): Promise<Message> {
        const message: Message = await this.messageRepository.create({ userId: dto.userId })
        const content: MessageContent = await this.messageContentRepository.create({
            text: dto.text,
            messageId: message.id
        })
        message.content = content
        return message
    }

    async updateMessage({ message, text }: UpdateMessageDto): Promise<Message> {
        if (message.edited === false) {
            message.edited = true
            await message.save()
        }
        message.content.text = text
        await message.content.save()
        this.eventEmitter.emit(
            'internal-messages.updated',
            new InternalMessagesCudEvent({
                message,
                action: 'update'
            })
        )
        return message
    }

    async deleteMessage({ message }: DeleteMessageDto): Promise<Message> {
        await message.destroy()
        this.eventEmitter.emit(
            'internal-messages.deleted',
            new InternalMessagesCudEvent({
                message,
                action: 'delete'
            })
        )
        return message
    }

}