import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable } from 'sequelize/types'
import { SendTextChannelMessageDto } from './dto/send-text-channel-message.dto'
import { InternalTextChannelsMessageSentEvent } from './events/internal-text-channels.message-sent.event'
import { MessagesService } from './messages.service'
import { Message } from './models/messages.model'
import { TextChannelMessage } from './models/text-channel-message.model'


@Injectable()
export class TextChannelMessageService {

    constructor(
        private messageService: MessagesService,
        private eventEmitter: EventEmitter2,
        @InjectModel(TextChannelMessage) private textChannelMessageRepository: typeof TextChannelMessage,
    ) {}

    async getTextChannelMessageRow(messageId: string): Promise<TextChannelMessage> {
        const row: TextChannelMessage =
            await this.textChannelMessageRepository.findOne({ where: { messageId } })
        return row
    }

    async getMessagesFromTextChannel(
        channelId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Message[]> {
        const messagesIds: string[] =
            (await this.textChannelMessageRepository.findAll({ where: { channelId } }))
                .map(row => row.messageId)
        const messages: Message[] =
            await this.messageService.getMessagesByIds(messagesIds, include, limit, offset)
        return messages
    }

    async sendMessageToTextChannel(dto: SendTextChannelMessageDto): Promise<Message> {
        const message: Message = await this.messageService.createMessage({ ...dto })
        await this.textChannelMessageRepository.create({ messageId: message.id, channelId: dto.channelId })
        this.eventEmitter.emit(
            'internal-text-channels.message-sent',
            new InternalTextChannelsMessageSentEvent({
                message,
                channelId: dto.channelId,
            })
        )
        return message
    }

}