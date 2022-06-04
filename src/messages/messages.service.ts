import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op } from 'sequelize'
import { ChatMessageService } from './chat-message.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { DeleteMessageDto } from './dto/delete-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { InternalMessagesCudEvent } from './events/internal-messages.CUD.event'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'
import { TextChannelMessageService } from './text-channel-message.service'


@Injectable()
export class MessagesService {

    constructor(
        private eventEmitter: EventEmitter2,
        @Inject(forwardRef(() => ChatMessageService))
            private chatMessageService: ChatMessageService,
        @Inject(forwardRef(() => TextChannelMessageService))
            private textChannelMessageService: TextChannelMessageService,
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(MessageContent) private messageContentRepository: typeof MessageContent,
    ) {}

    async getMessageById(messageId: string): Promise<Message> {
        return await this.messageRepository.findByPk(messageId, { include: MessageContent })
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

    async getNextMessage(
        message: Message,
    ): Promise<Message> {
        return message.messageLocation.groupId
            ?
            await this.chatMessageService.getNextMessageInChat({
                chatId: message.messageLocation.chatId,
                messageId: message.id
            })
            :
            await this.textChannelMessageService.getNextMessageInTextChannel({
                textChannelId: message.messageLocation.textChannelId,
                messageId: message.id
            })
    }

    async createMessage(dto: CreateMessageDto): Promise<Message> {
        const message: Message = await this.messageRepository.create(
            { userId: dto.userId, messageLocation: dto.location }
        )
        const content: MessageContent = await this.messageContentRepository.create({
            text: dto.text,
            messageId: message.id
        })
        message.content = content
        this.eventEmitter.emit(
            'internal-messages.created',
            new InternalMessagesCudEvent({
                message,
                action: 'create'
            })
        )
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