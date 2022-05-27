import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { SendTextChannelMessageDto } from './dto/send-text-channel-message.dto'
import { InternalTextChannelssMessageSentEvent } from './events/internal-text-channels.message-sent.event'
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

    async sendMessageToTextChannel(dto: SendTextChannelMessageDto): Promise<Message> {
        const message: Message = await this.messageService.createMessage({ ...dto })
        await this.textChannelMessageRepository.create({ messageId: message.id, channelId: dto.channelId })
        this.eventEmitter.emit(
            'internal-text-channels.message-sent',
            new InternalTextChannelssMessageSentEvent({ message, channelId: dto.channelId })
        )
        return message
    }

}